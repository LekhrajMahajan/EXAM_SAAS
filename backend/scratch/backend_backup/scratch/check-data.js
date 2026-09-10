const http = require('http');

http.get('http://localhost:5001/api/v1/reports/attendance/list', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log("Status Code:", res.statusCode);
    console.log("Response:", data.substring(0, 1000));
  });
}).on("error", (err) => {
  console.log("Error:", err);
});
