const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage (for demo purposes)
let users = [
  {
    id: 1,
    username: 'admin',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    email: 'admin@test.com'
  }
];

let items = [
  { id: 1, title: 'Learn Testing', description: 'Study automated testing', completed: false, userId: 1 },
  { id: 2, title: 'Build API', description: 'Create REST API', completed: true, userId: 1 }
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// POST /login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /items
app.get('/items', authenticateToken, (req, res) => {
  const userItems = items.filter(item => item.userId === req.user.id);
  res.json(userItems);
});

// POST /items
app.post('/items', authenticateToken, (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newItem = {
      id: items.length + 1,
      title,
      description: description || '',
      completed: false,
      userId: req.user.id
    };

    items.push(newItem);
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /items/:id
app.put('/items/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    
    const itemIndex = items.findIndex(item => item.id === parseInt(id) && item.userId === req.user.id);
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    items[itemIndex] = {
      ...items[itemIndex],
      title: title || items[itemIndex].title,
      description: description !== undefined ? description : items[itemIndex].description,
      completed: completed !== undefined ? completed : items[itemIndex].completed
    };

    res.json(items[itemIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /items/:id
app.delete('/items/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const itemIndex = items.findIndex(item => item.id === parseInt(id) && item.userId === req.user.id);
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const deletedItem = items[itemIndex];
    items.splice(itemIndex, 1);
    
    res.json({ message: 'Item deleted successfully', deletedItem });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Only start server if this is the main module (not being required for testing)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app; 