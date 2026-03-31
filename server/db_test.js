const mongoose = require('mongoose');
require('dotenv').config();

const MentorAssignment = require('./models/MentorAssignment');
const User = require('./models/User');
const Project = require('./models/Project');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    try {
      console.log("Connected. Fetching mentor assignments...");
      // Let's find ANY mentor assignment
      const all = await MentorAssignment.find()
        .populate('studentId', 'name email batch department')
        .populate('projectId', 'title currentPhase status');
      console.log("SUCCESS!", all);
    } catch (err) {
      console.error("MONGOOSE ERROR CAUGHT:");
      console.error(err);
    } finally {
      process.exit();
    }
  })
  .catch(err => {
    console.error("Connection error:", err);
    process.exit();
  });
