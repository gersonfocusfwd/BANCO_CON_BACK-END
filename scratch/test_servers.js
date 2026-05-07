
const http = require('http');

const checkUrl = (url) => {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      resolve({ status: res.statusCode, ok: true });
    }).on('error', (err) => {
      resolve({ ok: false, error: err.message });
    });
  });
};

async function test() {
  console.log('--- Testing Backend (Port 3000) ---');
  const backend = await checkUrl('http://localhost:3000/api/usuarios');
  console.log('Backend result:', backend);

  console.log('\n--- Testing Frontend (Port 5173) ---');
  const frontend = await checkUrl('http://localhost:5173');
  console.log('Frontend result:', frontend);
}

test();
