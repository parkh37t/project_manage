const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (replace with real DB in production)
let members = require('./data/members.json');
let projects = require('./data/projects.json');
let users = require('./data/users.json');

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ============================================
// AUTH ROUTES
// ============================================

// Login
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
    },
  });
});

// Register (admin only)
app.post('/api/auth/register', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const { username, password, name, role } = req.body;

  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: `U${String(users.length + 1).padStart(3, '0')}`,
    username,
    password: hashedPassword,
    name,
    role: role || 'user',
  };

  users.push(newUser);
  res.status(201).json({ message: 'User created successfully' });
});

// ============================================
// MEMBER ROUTES
// ============================================

// Get all members
app.get('/api/members', authenticateToken, (req, res) => {
  const { group, search } = req.query;

  let filtered = [...members];

  if (group && group !== 'all') {
    filtered = filtered.filter((m) => m.group === group);
  }

  if (search) {
    filtered = filtered.filter(
      (m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.position.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json(filtered);
});

// Get member by ID
app.get('/api/members/:id', authenticateToken, (req, res) => {
  const member = members.find((m) => m.id === req.params.id);
  if (!member) {
    return res.status(404).json({ error: 'Member not found' });
  }
  res.json(member);
});

// Create member
app.post('/api/members', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    return res.status(403).json({ error: 'Manager or admin access required' });
  }

  const maxId = Math.max(...members.map((m) => parseInt(m.id.substring(1))));
  const newMember = {
    ...req.body,
    id: `M${String(maxId + 1).padStart(3, '0')}`,
  };

  members.push(newMember);
  res.status(201).json(newMember);
});

// Update member
app.put('/api/members/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    return res.status(403).json({ error: 'Manager or admin access required' });
  }

  const index = members.findIndex((m) => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Member not found' });
  }

  members[index] = { ...members[index], ...req.body };
  res.json(members[index]);
});

// Delete member
app.delete('/api/members/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const index = members.findIndex((m) => m.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Member not found' });
  }

  members.splice(index, 1);
  res.json({ message: 'Member deleted successfully' });
});

// ============================================
// PROJECT ROUTES
// ============================================

// Get all projects
app.get('/api/projects', authenticateToken, (req, res) => {
  const { status } = req.query;

  let filtered = [...projects];

  if (status && status !== 'all') {
    filtered = filtered.filter((p) => p.status === status);
  }

  res.json(filtered);
});

// Get project by ID
app.get('/api/projects/:id', authenticateToken, (req, res) => {
  const project = projects.find((p) => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }
  res.json(project);
});

// Create project
app.post('/api/projects', authenticateToken, (req, res) => {
  const maxId = projects.length > 0 ? Math.max(...projects.map((p) => parseInt(p.id.substring(1)))) : 0;
  const newProject = {
    ...req.body,
    id: `P${String(maxId + 1).padStart(3, '0')}`,
    status: 'pending',
  };

  projects.push(newProject);
  res.status(201).json(newProject);
});

// Update project
app.put('/api/projects/:id', authenticateToken, (req, res) => {
  const index = projects.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  projects[index] = { ...projects[index], ...req.body };
  res.json(projects[index]);
});

// Review project (admin/manager only)
app.post('/api/projects/:id/review', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    return res.status(403).json({ error: 'Manager or admin access required' });
  }

  const index = projects.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const { status, comments } = req.body;
  projects[index] = {
    ...projects[index],
    status,
    reviewComments: comments,
    reviewedBy: req.user.name,
    reviewedAt: new Date().toISOString().split('T')[0],
  };

  res.json(projects[index]);
});

// Delete project
app.delete('/api/projects/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const index = projects.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  projects.splice(index, 1);
  res.json({ message: 'Project deleted successfully' });
});

// ============================================
// ANALYTICS ROUTES
// ============================================

// Get monthly metrics
app.get('/api/analytics/monthly', authenticateToken, (req, res) => {
  const monthlyMetrics = require('./data/monthlyMetrics.json');
  res.json(monthlyMetrics);
});

// Get group metrics
app.get('/api/analytics/groups', authenticateToken, (req, res) => {
  const groupMetrics = require('./data/groupMetrics.json');
  res.json(groupMetrics);
});

// Get yearly goal
app.get('/api/analytics/yearly-goal', authenticateToken, (req, res) => {
  const yearlyGoal = require('./data/yearlyGoal.json');
  res.json(yearlyGoal);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});
