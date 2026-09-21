import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://admin:Admin1234@cluster0.mongodb.net/test');
  console.log("Connected to MongoDB");

  const resultId = "6aaa72d7eed532f9656f1e39";
  
  const Result = mongoose.connection.db.collection('results');
  const resultDoc = await Result.findOne({ _id: new mongoose.Types.ObjectId(resultId) });
  
  if (!resultDoc) {
    console.log("Result not found");
    process.exit(1);
  }
  
  console.log("Result:", {
     id: resultDoc._id,
     examId: resultDoc.examId,
     submissionId: resultDoc.submissionId,
     subjectWiseBreakdown: JSON.stringify(resultDoc.subjectWiseBreakdown)
  });

  const CEA = mongoose.connection.db.collection('candidateexamanswer');
  const candAns = await CEA.findOne({ submissionId: resultDoc.submissionId });
  
  if (!candAns) {
    console.log("CandidateExamAnswer not found");
  } else {
    console.log("CandidateExamAnswer results count:", candAns.results?.length);
    if (candAns.results && candAns.results.length > 0) {
       console.log("Sample result 0:", candAns.results[0].questionId, candAns.results[0].subjectName);
       const apt = candAns.results.find(r => r.subjectName && r.subjectName.includes('Aptitude')) || candAns.results[1];
       console.log("Sample result 1 (Aptitude?):", apt.questionId, apt.subjectName);
    }
  }
  
  // Also dump a master question to see its subjectId
  if (candAns && candAns.results && candAns.results.length > 0) {
      const qId = candAns.results[1].questionId;
      const Question = mongoose.connection.db.collection('questions');
      const PaperQuestion = mongoose.connection.db.collection('paperquestions');
      const Subject = mongoose.connection.db.collection('subjects');
      
      const pq = await PaperQuestion.findOne({ _id: new mongoose.Types.ObjectId(String(qId)) });
      console.log("PaperQuestion:", pq);
      
      if (pq) {
          const q = await Question.findOne({ _id: pq.questionId });
          console.log("Master Question:", q);
          if (q && q.subjectId) {
             const s = await Subject.findOne({ _id: new mongoose.Types.ObjectId(String(q.subjectId)) });
             console.log("Subject:", s);
          }
      }
  }

  process.exit(0);
}

run().catch(console.error);
