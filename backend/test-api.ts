import mongoose from "mongoose";

const run = async () => {
    await mongoose.connect('mongodb://localhost:27017/exam_saas');
    const Result = mongoose.connection.collection('results');
    const CandidateExamAnswer = mongoose.connection.collection('candidateexamanswer');

    const results = await Result.find({}).toArray();

    const data = await Promise.all(results.map(async (r) => {
        const subId = r.submissionId;
        let candAns: any = null;
        if (subId) {
            candAns = await CandidateExamAnswer.findOne({ $or: [{ _id: subId }, { submissionId: subId }, { _id: String(subId) }, { submissionId: String(subId) }] });
        }
        
        let answers: any[] = [];
        if (candAns && candAns.results && Array.isArray(candAns.results)) {
            answers = candAns.results.map((res: any) => {
                let isCorrect = false;
                let selected = Array.isArray(res.candidateAnswer) ? res.candidateAnswer.map(String).join(", ") : String(res.candidateAnswer || "");
                let correct = Array.isArray(res.correctAnswer) ? res.correctAnswer.map(String).join(", ") : String(res.correctAnswer || "");
                
                if (selected && correct && correct.includes(selected)) {
                    isCorrect = true;
                }
                if (selected === correct) isCorrect = true;

                return {
                    questionId: res.questionId,
                    questionText: res.questionText || 'Question',
                    isAnswered: res.status !== 'NOT_VISITED' && res.candidateAnswer !== null && res.candidateAnswer !== undefined,
                    selectedAnswer: selected,
                    correctAnswer: correct,
                    isCorrect: isCorrect,
                    marks: res.marks || 1,
                    negativeMarks: res.negativeMarks || 0
                };
            });
        }
        
        return {
            id: r._id,
            answers: answers
        };
    }));

    console.log(`Answers length:`, data[0].answers.length);
    if (data[0].answers.length > 0) {
        console.log(data[0].answers[0]);
    }
    
    process.exit(0);
};

run().catch(console.error);
