const mongoose = require('mongoose');

async function check() {
  await mongoose.connect('mongodb://127.0.0.1:27017/examguard-pro'); // Assuming default local MongoDB
  
  const MeritList = mongoose.model("MeritList", new mongoose.Schema({}, { strict: false, collection: 'meritlists' }));
  const ImportCandidate = mongoose.model("importcandidate", new mongoose.Schema({}, { strict: false, collection: 'importcandidate' }));
  const Candidate = mongoose.model("Candidate", new mongoose.Schema({}, { strict: false, collection: 'candidates' }));
  
  const merits = await MeritList.find({}).lean();
  console.log(`Found ${merits.length} merits`);
  
  for (const m of merits) {
    const candId = m.candidateId?._id || m.candidateId;
    console.log(`Checking candidateId: ${candId}`);
    if (candId) {
        let cand = await Candidate.findById(candId).lean();
        if (cand) console.log(`Found in Candidate: ${cand.fullName || cand.firstName}`);
        if (!cand) {
            cand = await ImportCandidate.findById(candId).lean();
            if (cand) console.log(`Found in ImportCandidate: ${cand.candidateFullName || cand.fullName}`);
        }
        if (!cand) console.log(`Candidate NOT FOUND in either collection for candId: ${candId}`);
    }
  }
  
  mongoose.disconnect();
}

check().catch(console.error);
