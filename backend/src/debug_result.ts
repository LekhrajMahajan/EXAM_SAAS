import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://admin:Lekhraj123@cluster0.rbiphvv.mongodb.net/exam_saas?retryWrites=true&w=majority&appName=Cluster0";

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");
  
  const resultId = "6aaa72d7eed532f9656f1e39";
  
  const Result = mongoose.connection.db!.collection('results');
  const resultDoc = await Result.findOne({ _id: new mongoose.Types.ObjectId(resultId) });
  
  if (!resultDoc) {
    console.log("Result not found");
    process.exit(1);
  }
  
  console.log("Result submissionId:", resultDoc.submissionId);
  console.log("Result candidateId:", resultDoc.candidateId);
  console.log("Result examId:", resultDoc.examId);

  const CandidateExamAnswer = mongoose.connection.db!.collection('candidateexamanswer');
  const candAnsDocs = await CandidateExamAnswer.find({ 
    candidateId: String(resultDoc.candidateId)
  }).toArray();

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
