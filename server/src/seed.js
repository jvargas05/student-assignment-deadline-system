// Optional: fills the database with sample data for demos/screenshots.
// WARNING: this DELETES all existing assignments first.
// Run with:  npm run seed
import 'dotenv/config';
import mongoose from 'mongoose';
import Assignment from './models/Assignment.js';
import { connectDB } from './config/db.js';

const inDays = (days, hour = 17) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, 0, 0, 0);
  return d;
};

const samples = [
  { title: 'React Router Activity', course: 'DCIT 26', category: 'Lab', dueDate: inDays(-1), priority: 'High', status: 'Pending', description: 'Add routes and a dynamic detail page.' },
  { title: 'Lab 7 - VLSM in Packet Tracer', course: 'ITEC 90', category: 'Lab', dueDate: inDays(0, 23), priority: 'High', status: 'In Progress', description: 'Subnet 192.168.50.0/24 for IT, HR and Finance.' },
  { title: 'HCI Midterm Exam', course: 'ITEC 80', category: 'Exam', dueDate: inDays(2, 9), priority: 'High', status: 'Pending', description: 'Topics 1-4 and Module 5.' },
  { title: 'DCIT 26 Final Project Proposal', course: 'DCIT 26', category: 'Project', dueDate: inDays(4), priority: 'Medium', status: 'In Progress', description: 'Title, problem, objectives, features, wireframe.' },
  { title: 'Information Assurance Reflection', course: 'ITEC 85', category: 'Assignment', dueDate: inDays(6), priority: 'Low', status: 'Pending', description: 'Reflection on Laboratory 1 and 2.' },
  { title: 'Reference List (APA 6th)', course: 'Research Writing', category: 'Assignment', dueDate: inDays(9), priority: 'Medium', status: 'Pending', description: '' },
  { title: 'Arduino Part C - 2 Buttons, 2 LEDs', course: 'Embedded Systems', category: 'Lab', dueDate: inDays(-5), priority: 'Medium', status: 'Submitted', description: 'Submitted with wiring photo.' },
  { title: 'Quiz 3 - useState and useEffect', course: 'DCIT 26', category: 'Quiz', dueDate: inDays(-3), priority: 'Low', status: 'Submitted', description: '' },
];

async function run() {
  try {
    await connectDB();
    await Assignment.deleteMany({});
    const created = await Assignment.insertMany(samples);
    console.log(`Seeded ${created.length} assignments.`);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

run();
