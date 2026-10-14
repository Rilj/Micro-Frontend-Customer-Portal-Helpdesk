const http = require('http');

const data = JSON.stringify({
  subject: 'Test Complaint',
  description: 'Customer complaint test',
  priority: 'MEDIUM'
});

const options = {
  hostname: 'localhost',
  port: 8001,
  path: '/api/tickets',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('POST /api/tickets:', res.statusCode);
    console.log('Response:', d.substring(0, 300));
  });
});
req.on('error', e => console.log('Error:', e.message));
req.write(data);
req.end();
