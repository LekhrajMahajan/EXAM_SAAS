import { connectDatabase } from '../src/config/database';
import mongoose from 'mongoose';

async function main() {
    await connectDatabase();
    const db = mongoose.connection.db;
    const invoices = await db.collection('invoices').find().toArray();
    console.log('Invoices count:', invoices.length);
    invoices.forEach(i => console.log(i.invoiceNumber, i.grandTotal, i.status));
    process.exit(0);
}

main();
