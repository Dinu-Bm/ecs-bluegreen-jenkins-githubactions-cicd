const http = require('http');

function request(path = '/') {
  return new Promise((resolve, reject) => {
    const req = http.request(
      { host: 'localhost', port: 3000, path, method: 'GET' },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => resolve({ status: res.statusCode, data }));
      }
    );
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  const { spawn } = require('child_process');
  const srv = spawn('node', ['server.js'], { cwd: __dirname + '/..' });
  await new Promise((r) => setTimeout(r, 1000));

  try {
    const health = await request('/health');
    if (health.status !== 200 || health.data !== 'OK') process.exit(1);

    const root = await request('/');
    if (root.status !== 200 || !root.data.includes('Hello from ECS')) process.exit(1);
  } catch (e) {
    process.exit(1);
  } finally {
    srv.kill();
  }
})();