import http from 'http';
http.get('http://localhost:5000/api/v1/merit-lists?limit=1', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
}).on('error', console.error);
