require('dotenv').config();
const mongoose = require('mongoose');

async function viewDatabase() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is missing in server/.env');
    process.exit(1);
  }

  console.log('\n==================================================');
  console.log('       FINSTAT - MONGODB DATABASE VIEWER');
  console.log('==================================================');
  console.log('Connecting to MongoDB Atlas...');

  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    console.log(`\x1b[32m✔ Connected Successfully!\x1b[0m`);
    console.log(`Database Name: \x1b[36m${mongoose.connection.name}\x1b[0m\n`);

    const collections = await db.listCollections().toArray();
    
    for (const colInfo of collections) {
      const colName = colInfo.name;
      const count = await db.collection(colName).countDocuments();
      console.log(`--------------------------------------------------`);
      console.log(`📁 COLLECTION: \x1b[33m${colName}\x1b[0m (${count} document${count === 1 ? '' : 's'})`);
      console.log(`--------------------------------------------------`);

      const docs = await db.collection(colName).find({}).sort({ createdAt: -1 }).toArray();

      if (docs.length === 0) {
        console.log('   (empty collection)');
      } else {
        docs.forEach((doc, idx) => {
          console.log(`\n[#${idx + 1}] ID: ${doc._id}`);
          if (colName === 'users') {
            console.log(`   Name:     ${doc.fullName}`);
            console.log(`   Email:    ${doc.email}`);
            console.log(`   Created:  ${doc.createdAt}`);
            console.log(`   Password: [Hashed with bcrypt: ${doc.passwordHash.substring(0, 15)}...]`);
          } else if (colName === 'transactions') {
            console.log(`   Type:        ${doc.type.toUpperCase()}`);
            console.log(`   Amount:      ₹${doc.amount}`);
            console.log(`   Category:    ${doc.category}`);
            console.log(`   Description: ${doc.description || '(none)'}`);
            console.log(`   Date:        ${new Date(doc.date).toLocaleDateString()}`);
            console.log(`   Mode:        ${doc.mode}`);
            console.log(`   User Ref:    ${doc.user}`);
          } else if (colName === 'savingspots') {
            console.log(`   Name:           ${doc.name}`);
            console.log(`   Target Amount:  ₹${doc.targetAmount}`);
            console.log(`   Current Amount: ₹${doc.currentAmount}`);
            console.log(`   Status:         ${doc.isLocked ? '🔒 LOCKED' : '🔓 OPEN'}`);
            console.log(`   Target Date:    ${doc.targetDate ? new Date(doc.targetDate).toLocaleDateString() : 'None'}`);
            console.log(`   User Ref:       ${doc.user}`);
          } else if (colName === 'incomesources') {
            console.log(`   Name:      ${doc.name}`);
            console.log(`   Amount:    ₹${doc.amount}`);
            console.log(`   Frequency: ${doc.frequency}`);
            console.log(`   Active:    ${doc.isActive ? 'Active' : 'Inactive'}`);
            console.log(`   User Ref:  ${doc.user}`);
          } else if (colName === 'notifications') {
            console.log(`   Title:    ${doc.title}`);
            console.log(`   Message:  ${doc.message}`);
            console.log(`   Severity: ${doc.severity}`);
            console.log(`   Status:   ${doc.isRead ? 'Read' : 'Unread'}`);
            console.log(`   User Ref: ${doc.user}`);
          } else {
            console.log(JSON.stringify(doc, null, 2));
          }
        });
      }
      console.log('');
    }

    console.log('==================================================');
    console.log('       END OF DATABASE INSPECTION');
    console.log('==================================================\n');

  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

viewDatabase();
