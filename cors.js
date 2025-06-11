const jsonServer = require('json-server');

module.exports = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else if (req.method === 'POST' && req.url === '/login') {
    // Custom /login endpoint
    const { email, password } = req.body;
    const db = jsonServer.router('db.json').db;
    const user = db
      .get('users')
      .find({ email: email.toLowerCase(), password })
      .value();

    if (user) {
      res.status(200).json({
        user,
        token: 'fake-token' // Replace with real JWT in production
      });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } else if (req.method === 'POST' && req.url === '/users') {
    // Add default role and createdAt for new users
    req.body.role = req.body.role || 'user';
    req.body.createdAt = req.body.createdAt || new Date().toISOString();
    next();
  } else {
    next();
  }
};