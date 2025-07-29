const request = require('supertest');
const app = require('./server');

describe('API Tests', () => {
  let authToken;

  // Helper function to get auth token
  const getAuthToken = async () => {
    const response = await request(app)
      .post('/login')
      .send({
        username: 'admin',
        password: 'password'
      });
    return response.body.token;
  };

  beforeAll(async () => {
    authToken = await getAuthToken();
  });

  describe('Authentication', () => {
    describe('POST /login', () => {
      test('should login with valid credentials', async () => {
        const response = await request(app)
          .post('/login')
          .send({
            username: 'admin',
            password: 'password'
          });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.username).toBe('admin');
      });

      test('should fail with invalid username', async () => {
        const response = await request(app)
          .post('/login')
          .send({
            username: 'invalid',
            password: 'password'
          });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Invalid credentials');
      });

      test('should fail with invalid password', async () => {
        const response = await request(app)
          .post('/login')
          .send({
            username: 'admin',
            password: 'wrongpassword'
          });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Invalid credentials');
      });

      test('should fail with missing username', async () => {
        const response = await request(app)
          .post('/login')
          .send({
            password: 'password'
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Username and password required');
      });

      test('should fail with missing password', async () => {
        const response = await request(app)
          .post('/login')
          .send({
            username: 'admin'
          });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Username and password required');
      });
    });
  });

  describe('Items CRUD Operations', () => {
    describe('GET /items', () => {
      test('should get all items for authenticated user', async () => {
        const response = await request(app)
          .get('/items')
          .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('title');
        expect(response.body[0]).toHaveProperty('description');
        expect(response.body[0]).toHaveProperty('completed');
      });

      test('should fail without authentication', async () => {
        const response = await request(app)
          .get('/items');

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Access token required');
      });

      test('should fail with invalid token', async () => {
        const response = await request(app)
          .get('/items')
          .set('Authorization', 'Bearer invalid-token');

        expect(response.status).toBe(403);
        expect(response.body.error).toBe('Invalid token');
      });
    });

    describe('POST /items', () => {
      test('should create new item with valid data', async () => {
        const newItem = {
          title: 'Test Item',
          description: 'Test Description'
        };

        const response = await request(app)
          .post('/items')
          .set('Authorization', `Bearer ${authToken}`)
          .send(newItem);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.title).toBe(newItem.title);
        expect(response.body.description).toBe(newItem.description);
        expect(response.body.completed).toBe(false);
      });

      test('should create item with only title', async () => {
        const newItem = {
          title: 'Test Item 2'
        };

        const response = await request(app)
          .post('/items')
          .set('Authorization', `Bearer ${authToken}`)
          .send(newItem);

        expect(response.status).toBe(201);
        expect(response.body.title).toBe(newItem.title);
        expect(response.body.description).toBe('');
      });

      test('should fail without title', async () => {
        const newItem = {
          description: 'Test Description'
        };

        const response = await request(app)
          .post('/items')
          .set('Authorization', `Bearer ${authToken}`)
          .send(newItem);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Title is required');
      });

      test('should fail without authentication', async () => {
        const newItem = {
          title: 'Test Item',
          description: 'Test Description'
        };

        const response = await request(app)
          .post('/items')
          .send(newItem);

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Access token required');
      });
    });

    describe('PUT /items/:id', () => {
      test('should update existing item', async () => {
        const updateData = {
          title: 'Updated Title',
          description: 'Updated Description',
          completed: true
        };

        const response = await request(app)
          .put('/items/1')
          .set('Authorization', `Bearer ${authToken}`)
          .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe(updateData.title);
        expect(response.body.description).toBe(updateData.description);
        expect(response.body.completed).toBe(updateData.completed);
      });

      test('should update only provided fields', async () => {
        const updateData = {
          completed: false
        };

        const response = await request(app)
          .put('/items/1')
          .set('Authorization', `Bearer ${authToken}`)
          .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.completed).toBe(updateData.completed);
        // Other fields should remain unchanged
        expect(response.body.title).toBe('Updated Title');
      });

      test('should fail with non-existent item', async () => {
        const updateData = {
          title: 'Updated Title'
        };

        const response = await request(app)
          .put('/items/999')
          .set('Authorization', `Bearer ${authToken}`)
          .send(updateData);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Item not found');
      });

      test('should fail without authentication', async () => {
        const updateData = {
          title: 'Updated Title'
        };

        const response = await request(app)
          .put('/items/1')
          .send(updateData);

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Access token required');
      });
    });

    describe('DELETE /items/:id', () => {
      test('should delete existing item', async () => {
        const response = await request(app)
          .delete('/items/2')
          .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Item deleted successfully');
        expect(response.body.deletedItem).toHaveProperty('id');
      });

      test('should fail with non-existent item', async () => {
        const response = await request(app)
          .delete('/items/999')
          .set('Authorization', `Bearer ${authToken}`);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Item not found');
      });

      test('should fail without authentication', async () => {
        const response = await request(app)
          .delete('/items/1');

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Access token required');
      });
    });
  });

  describe('Health Check', () => {
    test('should return health status', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('OK');
      expect(response.body).toHaveProperty('timestamp');
    });
  });
}); 