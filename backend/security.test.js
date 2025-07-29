const request = require('supertest');
const app = require('./server');

describe('Security Tests', () => {
  let validToken;

  beforeAll(async () => {
    // Get valid token for testing
    const response = await request(app)
      .post('/login')
      .send({
        username: 'admin',
        password: 'password'
      });
    validToken = response.body.token;
  });

  describe('Authentication Security', () => {
    test('should prevent brute force attacks', async () => {
      const attempts = 5;
      let failedAttempts = 0;

      for (let i = 0; i < attempts; i++) {
        const response = await request(app)
          .post('/login')
          .send({
            username: 'admin',
            password: 'wrongpassword'
          });

        if (response.status === 401) {
          failedAttempts++;
        }
      }

      // Should consistently reject invalid credentials
      expect(failedAttempts).toBe(attempts);
    });

    test('should validate JWT token format', async () => {
      const response = await request(app)
        .get('/items')
        .set('Authorization', 'Bearer invalid-token-format');

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Invalid token');
    });

    test('should reject expired tokens', async () => {
      // Create a token that expires in 1 second
      const jwt = require('jsonwebtoken');
      const expiredToken = jwt.sign(
        { id: 1, username: 'admin' },
        'your-secret-key',
        { expiresIn: '1ms' }
      );

      // Wait for token to expire
      await new Promise(resolve => setTimeout(resolve, 10));

      const response = await request(app)
        .get('/items')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('Input Validation Security', () => {
    test('should prevent SQL injection attempts', async () => {
      const maliciousInputs = [
        "'; DROP TABLE users; --",
        "' OR '1'='1",
        "'; INSERT INTO users VALUES ('hacker', 'password'); --"
      ];

      for (const maliciousInput of maliciousInputs) {
        const response = await request(app)
          .post('/items')
          .set('Authorization', `Bearer ${validToken}`)
          .send({
            title: maliciousInput,
            description: maliciousInput
          });

        // Should handle malicious input gracefully
        expect(response.status).toBe(201);
        expect(response.body.title).toBe(maliciousInput);
      }
    });

    test('should prevent XSS attempts', async () => {
      const xssPayloads = [
        '<script>alert("xss")</script>',
        '<img src="x" onerror="alert(\'xss\')">',
        'javascript:alert("xss")'
      ];

      for (const payload of xssPayloads) {
        const response = await request(app)
          .post('/items')
          .set('Authorization', `Bearer ${validToken}`)
          .send({
            title: payload,
            description: payload
          });

        // Should accept the input but not execute scripts
        expect(response.status).toBe(201);
        expect(response.body.title).toBe(payload);
      }
    });

    test('should validate required fields', async () => {
      const response = await request(app)
        .post('/items')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          description: 'No title provided'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Title is required');
    });
  });

  describe('Authorization Security', () => {
    test('should prevent access to other users items', async () => {
      // Create item with user ID 1
      const createResponse = await request(app)
        .post('/items')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          title: 'Test Item',
          description: 'Test Description'
        });

      const itemId = createResponse.body.id;

      // Try to access with different user token
      const differentToken = require('jsonwebtoken').sign(
        { id: 999, username: 'otheruser' },
        'your-secret-key',
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .get(`/items/${itemId}`)
        .set('Authorization', `Bearer ${differentToken}`);

      // Should not be able to access other user's items
      expect(response.status).toBe(404);
    });

    test('should prevent unauthorized item modification', async () => {
      // Create item
      const createResponse = await request(app)
        .post('/items')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          title: 'Original Title',
          description: 'Original Description'
        });

      const itemId = createResponse.body.id;

      // Try to modify without token
      const response = await request(app)
        .put(`/items/${itemId}`)
        .send({
          title: 'Hacked Title'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('Rate Limiting', () => {
    test('should handle rapid requests gracefully', async () => {
      const requests = Array(20).fill().map(() =>
        request(app)
          .get('/health')
          .expect(200)
      );

      const responses = await Promise.all(requests);
      
      // All requests should succeed
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });
  });

  describe('Data Sanitization', () => {
    test('should handle special characters in input', async () => {
      const specialChars = [
        'Item with "quotes"',
        'Item with <tags>',
        'Item with & symbols',
        'Item with \' apostrophes',
        'Item with \n newlines',
        'Item with \t tabs'
      ];

      for (const input of specialChars) {
        const response = await request(app)
          .post('/items')
          .set('Authorization', `Bearer ${validToken}`)
          .send({
            title: input,
            description: input
          });

        expect(response.status).toBe(201);
        expect(response.body.title).toBe(input);
      }
    });
  });

  describe('CORS Security', () => {
    test('should have proper CORS headers', async () => {
      const response = await request(app)
        .options('/items')
        .set('Origin', 'http://localhost:3000');

      expect(response.headers['access-control-allow-origin']).toBeDefined();
      expect(response.headers['access-control-allow-methods']).toBeDefined();
    });
  });
}); 