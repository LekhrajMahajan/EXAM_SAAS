const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const reqs = await mongoose.connection.collection('companyadminrequests').find({}).toArray();
  console.log("Requests in DB:", JSON.stringify(reqs, null, 2));

  // If companyAdminId or companyId is missing, let's update them to a valid user/company
  for (let r of reqs) {
    if (!r.companyAdminId || !r.companyId) {
       console.log(`Fixing request ${r._id}...`);
       const defaultCompany = await mongoose.connection.collection('companies').findOne({});
       const defaultUser = await mongoose.connection.collection('users').findOne({ role: 'COMPANY_ADMIN' });
       if (defaultCompany && defaultUser) {
         await mongoose.connection.collection('companyadminrequests').updateOne(
           { _id: r._id },
           { $set: { 
               companyId: r.companyId || defaultCompany._id,
               companyAdminId: r.companyAdminId || defaultUser._id 
             }
           }
         );
         console.log("Fixed!");
       }
    }
  }
  process.exit(0);
});
