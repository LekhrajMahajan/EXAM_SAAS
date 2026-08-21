const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/practice-exam-saas').then(async () => {
    try {
        const Employee = mongoose.model('Employee', new mongoose.Schema({}, {strict:false, collection:'employees'}));
        const User = mongoose.model('User', new mongoose.Schema({}, {strict:false, collection:'users'}));
        const Paper = mongoose.model('Paper', new mongoose.Schema({}, {strict:false, collection:'papers'}));
        const StaffAssignment = mongoose.model('StaffAssignment', new mongoose.Schema({}, {strict:false, collection:'staffassignments'}));

        const ps = await User.find({role: 'PAPER_SETTER'}).lean();
        console.log('--- USERS ---');
        console.log('Paper Setters users:', ps.length);
        ps.forEach(p => console.log(`  User: ${p._id}, email: ${p.email}`));

        const emps = await Employee.find({role: 'PAPER_SETTER'}).lean();
        console.log('\n--- EMPLOYEES ---');
        console.log('Paper Setters employees:', emps.length);
        emps.forEach(e => console.log(`  Employee: ${e._id}, userId: ${e.userId}, email: ${e.email}`));

        const papers = await Paper.find().lean();
        console.log('\n--- PAPERS ---');
        console.log('Papers:', papers.length);
        papers.forEach(p => console.log(`  Paper: ${p._id}, assignedTo: ${p.assignedTo}`));

        const assignments = await StaffAssignment.find().lean();
        console.log('\n--- ASSIGNMENTS ---');
        console.log('Assignments:', assignments.length);
        assignments.forEach(a => console.log(`  Assignment: ${a._id}, employeeId: ${a.employeeId}, role: ${a.role}`));
    } finally {
        await mongoose.disconnect();
    }
});
