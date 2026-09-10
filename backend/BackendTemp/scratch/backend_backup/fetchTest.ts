import mongoose from 'mongoose';

async function main() {
    await mongoose.connect('mongodb+srv://ChoiceMart:Lekhraj_135@cluster0.rbiphvv.mongodb.net/exam_saas?retryWrites=true&w=majority');
    
    const Result = mongoose.connection.db.collection('results');
    const res = await Result.findOne({ _id: new mongoose.Types.ObjectId('6a8d78c61696f59c0991be26') });
    console.log('Result Candidate ID:', res?.candidateId);
    console.log('Result Submission ID:', res?.submissionId);
    
    if (res && res.candidateId) {
        const Candidate = mongoose.connection.db.collection('candidates');
        const ImportCandidate = mongoose.connection.db.collection('importcandidate');
        
        let cand = await Candidate.findOne({ _id: res.candidateId });
        let coll = 'candidates';
        if (!cand) {
            cand = await ImportCandidate.findOne({ _id: res.candidateId });
            coll = 'importcandidate';
        }
        
        if (cand) {
            console.log('Found in:', coll);
            console.log('cand.firstName:', cand.firstName);
            console.log('cand.photo:', cand.photo);
            console.log('cand.candidatePhoto:', cand.candidatePhoto);
            console.log('cand.photoUrl:', cand.photoUrl);
            console.log('cand.profilePhoto:', cand.profilePhoto);
        } else {
            console.log('Candidate not found in either collection for id:', res.candidateId);
        }
    }

    if (res && res.submissionId) {
        const CandidateExamAnswer = mongoose.connection.db.collection('candidateexamanswer');
        
        const candAns = await CandidateExamAnswer.findOne({ 
            $or: [
                { _id: res.submissionId }, 
                { submissionId: res.submissionId },
                { _id: String(res.submissionId) },
                { submissionId: String(res.submissionId) }
            ] 
        });
        
        if (candAns) {
            console.log('\nFound candAns');
            console.log('name:', candAns.name);
            console.log('photo:', candAns.photo);
            console.log('photoUrl:', candAns.photoUrl);
            console.log('candidatePhoto:', candAns.candidatePhoto);
            console.log('profilePhoto:', candAns.profilePhoto);
        } else {
            console.log('\nCandAns not found for subId:', res.submissionId);
        }
    }
    
    process.exit(0);
}

main().catch(console.error);
