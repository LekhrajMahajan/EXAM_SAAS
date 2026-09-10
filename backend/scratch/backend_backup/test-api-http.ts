import http from 'http';

http.get('http://localhost:5000/api/v1/results', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const results = JSON.parse(data).data;
    if (results && results.length > 0) {
      const examId = results[0].examObj._id || results[0].examObj.id || results[0].examId;
      console.log('Fetching for exam:', examId);
      http.get('http://localhost:5000/api/v1/results/export/' + examId, { headers: { 'Authorization': 'Bearer test' } }, (res2) => {
         let data2 = '';
         res2.on('data', chunk => data2 += chunk);
         res2.on('end', () => {
             console.log("Status Code:", res2.statusCode);
             if (res2.statusCode !== 200) {
                 console.log("Error response:", data2);
                 return;
             }
             const exportData = JSON.parse(data2);
             console.log('Data returned length:', exportData.data ? exportData.data.length : 0);
             if (exportData.data && exportData.data.length > 0) {
                 console.log('Answers for candidate 1:', exportData.data[0].answers ? exportData.data[0].answers.length : 'undefined');
             }
         });
      });
    }
  });
}).on('error', err => console.log('Error:', err.message));
