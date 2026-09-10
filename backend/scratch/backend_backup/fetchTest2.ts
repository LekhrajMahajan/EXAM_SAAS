import mongoose from "mongoose";

const uri = "mongodb+srv://dhurv50:yTz2VpC3Hq2m9B8t@cluster0.k26y2.mongodb.net/exam_management_system?retryWrites=true&w=majority&appName=Cluster0";

async function main() {
  await mongoose.connect(uri);
  const Result = mongoose.model('Result', new mongoose.Schema({}, { strict: false, collection: 'results' }));
  const results = await Result.find().sort({_id: -1}).limit(5).lean();
  console.log(JSON.stringify(results, null, 2));
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
