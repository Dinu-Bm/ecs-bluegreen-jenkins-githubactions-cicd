const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/health', (req, res) => res.status(200).send('OK'));

app.get('/', (req, res) => {
  const version = process.env.APP_VERSION || 'local-dev';
  res.send(`Hello from ECS Blue-Green! Version: ${version}`);
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});