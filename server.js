const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Set up middlewares
server.use(middlewares);
server.use(jsonServer.bodyParser);

const port = process.env.PORT || 3000; 
server.listen(port, () => {
  console.log(`JSON Server is running on port ${port}`);
});