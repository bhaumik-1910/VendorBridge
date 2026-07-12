const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { RFQ, Quotation } = require('../src/models');

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://[YOUR_NAME]:[PASSWORD]@cluster0.edp4acr.mongodb.net/vendorbridge?retryWrites=true&w=majority&appName=Cluster0');
        console.log('Connected to DB');

        const rfqs = await RFQ.find({ isDeleted: false });
        console.log('\nRFQs:');
        rfqs.forEach(r => {
            console.log(`- ID: ${r._id}, Num: ${r.rfqNumber}, Title: ${r.title}, Status: ${r.status}, Responses: ${r.responses}`);
        });

        const quotes = await Quotation.find({ isDeleted: false });
        console.log('\nQuotations:');
        quotes.forEach(q => {
            console.log(`- ID: ${q._id}, RFQ: ${q.rfq}, Vendor: ${q.vendor}, Status: ${q.status}, Price: ${q.price}`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkData();
