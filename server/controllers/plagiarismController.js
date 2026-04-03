const asyncHandler        = require('../utils/asyncHandler');
const ProgressLog         = require('../models/ProgressLog');
const MentorAssignment    = require('../models/MentorAssignment');
const { fetchRepoFiles }  = require('../services/githubFetcherService');
const { checkPlagiarism } = require('../services/plagiarismService');
const User                = require('../models/User');

// POST /api/plagiarism/check/:logId
const checkLogPlagiarism = asyncHandler(async (req, res) => {
  const { logId } = req.params;

  // 1. Fetch the log
  const log = await ProgressLog.findById(logId)
    .populate('studentId', 'name email batch department');

  if (!log) {
    return res.status(404).json({ success: false, message: 'Log not found' });
  }

  // 2. Verify mentor is assigned to this student
  const assignment = await MentorAssignment.findOne({
    mentorId:  req.user.id,
    studentId: log.studentId._id,
    status:    'active',
  });

  if (!assignment) {
    return res.status(403).json({
      success: false,
      message: 'You are not assigned to this student',
    });
  }

  // 3. Get repo URL — from request body or from log's evidenceLinks
  let repoUrl = req.body.repoUrl;

  if (!repoUrl) {
    // Try to find a GitHub URL in the log's evidenceLinks
    repoUrl = (log.evidenceLinks || []).find(link =>
      link.includes('github.com')
    );
  }

  if (!repoUrl) {
    return res.status(400).json({
      success: false,
      message: 'No GitHub repository URL provided or found in this log.',
    });
  }

  // 4. Fetch source files from GitHub
  let files;
  try {
    files = await fetchRepoFiles(repoUrl);
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: `GitHub fetch failed: ${err.message}`,
    });
  }

  if (!files || files.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No source files found in repository.',
    });
  }

  // 5. Run plagiarism check
  const result = await checkPlagiarism(
    log.studentId._id,
    log._id,
    repoUrl,
    log.studentId.batch,
    files
  );

  // 6. Update log's integrityStatus based on result
  await ProgressLog.findByIdAndUpdate(logId, {
    'integrityStatus.score':   result.verdict,
    'integrityStatus.flags':   result.verdict !== 'clean'
      ? [`SIMILARITY_${result.overallScore}PCT`]
      : [],
  });

  // 7. Return result
  res.json({
    success: true,
    student: {
      name:  log.studentId.name,
      email: log.studentId.email,
      batch: log.studentId.batch,
    },
    repoUrl,
    filesScanned:  result.filesScanned,
    overallScore:  result.overallScore,
    verdict:       result.verdict,
    message:       result.message,
    matches:       result.matches,
  });
});

// GET /api/plagiarism/status/:logId
// Returns current integrity status of a log (for display in review card)
const getIntegrityStatus = asyncHandler(async (req, res) => {
  const log = await ProgressLog.findById(req.params.logId)
    .select('integrityStatus githubVerification studentId');

  if (!log) {
    return res.status(404).json({ success: false, message: 'Log not found' });
  }

  res.json({ success: true, integrityStatus: log.integrityStatus });
});

module.exports = { checkLogPlagiarism, getIntegrityStatus };
