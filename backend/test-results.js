const http = require('http');

http.get('http://localhost:5000/api/v1/results', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    const examObj = json.data[0]?.examObj;
    console.log(JSON.stringify(examObj, null, 2));
  });
}).on('error', err => {
  console.log('Error:', err.message);
});
