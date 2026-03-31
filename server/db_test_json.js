const mongoose = require('mongoose');
require('dotenv').config();

const MentorAssignment = require('./models/MentorAssignment');
const User = require('./models/User');
const Project = require('./models/Project');
const fs = require('fs');

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    try {
      const all = await MentorAssignment.find()
        .populate('studentId', 'name email batch department')
        .populate('projectId', 'title currentPhase status');
      fs.writeFileSync('err.json', JSON.stringify({ success: true, data: all }, null, 2));
    } catch (err) {
      fs.writeFileSync('err.json', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    } finally {
      process.exit();
    }
  })
  .catch(err => {
    fs.writeFileSync('err.json', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
    process.exit();
  });
