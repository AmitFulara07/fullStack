const acorn = require('acorn');
const CodeFingerprint = require('../models/CodeFingerprint');

// ─── Pre-processing ────────────────────────────────────────────────────────────

const stripAndNormalize = (code) => {
  return code
    .replace(/\/\/.*$/gm, '')           // strip single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')   // strip block comments
    .replace(/#.*$/gm, '')              // strip Python # comments
    .replace(/["'`]([^"'`]*)["'`]/g, '"STRING"')  // normalize string literals
    .replace(/\b\d+\.?\d*\b/g, 'NUM')  // normalize numbers
    .replace(/\s+/g, ' ')              // collapse whitespace
    .trim();
};

// ─── AST Fingerprint (JavaScript/TypeScript) ─────────────────────────────────

const generateJSFingerprint = (code) => {
  try {
    const ast = acorn.parse(code, {
      ecmaVersion: 2022,
      sourceType: 'module',
      onInsertedSemicolon: () => {},
      onTrailingComma: () => {},
    });

    const nodeTypes = [];
    const walk = (node) => {
      if (!node || typeof node !== 'object') return;
      if (node.type) nodeTypes.push(node.type);
      for (const key of Object.keys(node)) {
        if (key === 'type' || key === 'start' || key === 'end') continue;
        const child = node[key];
        if (Array.isArray(child)) child.forEach(walk);
        else if (child && typeof child === 'object') walk(child);
      }
    };
    walk(ast);
    return nodeTypes.join(',');
  } catch {
    // Fallback to token-based fingerprint if AST parse fails
    return stripAndNormalize(code)
      .split(' ')
      .filter(t => t.length > 2)
      .join(',');
  }
};

// ─── Token-based fingerprint (Python, Java, C++) ────────────────────────────

const generateTokenFingerprint = (code) => {
  const normalized = stripAndNormalize(code);
  const tokens = normalized
    .split(/[\s,;.()\[\]{}]+/)
    .filter(t => t.length > 2);
  return tokens.join(',');
};

// ─── Choose fingerprint strategy by language ─────────────────────────────────

const generateFingerprint = (content, language) => {
  if (['js', 'jsx', 'ts', 'tsx'].includes(language)) {
    return generateJSFingerprint(content);
  }
  return generateTokenFingerprint(content);
};

// ─── Jaccard Similarity ───────────────────────────────────────────────────────

const computeJaccardSimilarity = (fp1, fp2) => {
  if (!fp1 || !fp2) return 0;
  const set1 = new Set(fp1.split(','));
  const set2 = new Set(fp2.split(','));
  if (set1.size === 0 && set2.size === 0) return 100;
  const intersection = [...set1].filter(x => set2.has(x)).length;
  const union = new Set([...set1, ...set2]).size;
  return Math.round((intersection / union) * 100);
};

// ─── Store fingerprint after log submission ───────────────────────────────────

const storeFingerprint = async (studentId, logId, repoUrl, batch, files) => {
  try {
    const fingerprints = files.map(f => ({
      path:        f.path,
      fingerprint: generateFingerprint(f.content, f.language),
      language:    f.language,
    }));

    // Upsert — one fingerprint record per log
    await CodeFingerprint.findOneAndUpdate(
      { logId },
      { studentId, logId, repoUrl, batch, files: fingerprints, totalFiles: fingerprints.length },
      { upsert: true, new: true }
    );

    return fingerprints;
  } catch (err) {
    console.error('storeFingerprint error:', err.message);
    return [];
  }
};

// ─── Main comparison function ─────────────────────────────────────────────────

const checkPlagiarism = async (studentId, logId, repoUrl, batch, files) => {
  // Step 1: Generate fingerprints for submitted files
  const currentFingerprints = files.map(f => ({
    path:        f.path,
    fingerprint: generateFingerprint(f.content, f.language),
    language:    f.language,
  }));

  // Step 2: Store them for future comparisons
  await CodeFingerprint.findOneAndUpdate(
    { logId },
    {
      studentId, logId, repoUrl, batch,
      files: currentFingerprints,
      totalFiles: currentFingerprints.length,
    },
    { upsert: true, new: true }
  );

  // Step 3: Fetch all OTHER fingerprints from same batch
  const others = await CodeFingerprint.find({
    batch,
    studentId: { $ne: studentId },
  }).populate('studentId', 'name email');

  if (others.length === 0) {
    return {
      overallScore:  0,
      verdict:       'clean',
      message:       'No other submissions in this batch to compare against yet.',
      matches:       [],
      filesScanned:  currentFingerprints.length,
    };
  }

  // Step 4: Compare current submission against each other student
  const matchResults = [];

  for (const other of others) {
    const fileMatches = [];
    let totalSimilarity = 0;
    let comparisons = 0;

    for (const currentFile of currentFingerprints) {
      for (const otherFile of other.files) {
        // Only compare files with same extension
        if (currentFile.language !== otherFile.language) continue;

        const similarity = computeJaccardSimilarity(
          currentFile.fingerprint,
          otherFile.fingerprint
        );

        if (similarity > 40) {
          fileMatches.push({
            currentFile:  currentFile.path,
            matchedFile:  otherFile.path,
            similarity,
          });
        }

        totalSimilarity += similarity;
        comparisons++;
      }
    }

    const avgSimilarity = comparisons > 0
      ? Math.round(totalSimilarity / comparisons)
      : 0;

    if (avgSimilarity > 20 || fileMatches.length > 0) {
      matchResults.push({
        matchedStudent: {
          id:    other.studentId._id,
          name:  other.studentId.name,
          email: other.studentId.email,
        },
        averageSimilarity: avgSimilarity,
        fileMatches:       fileMatches.sort((a, b) => b.similarity - a.similarity),
        repoUrl:           other.repoUrl,
      });
    }
  }

  // Step 5: Sort by highest similarity
  matchResults.sort((a, b) => b.averageSimilarity - a.averageSimilarity);

  // Step 6: Compute overall score from highest match
  const overallScore = matchResults.length > 0
    ? matchResults[0].averageSimilarity
    : 0;

  // Step 7: Determine verdict
  let verdict;
  if (overallScore < 30)       verdict = 'clean';
  else if (overallScore < 60)  verdict = 'suspicious';
  else                          verdict = 'flagged';

  return {
    overallScore,
    verdict,
    matches:      matchResults,
    filesScanned: currentFingerprints.length,
    message:      matchResults.length === 0
      ? 'No significant matches found.'
      : `Found ${matchResults.length} student(s) with similar code.`,
  };
};

module.exports = { checkPlagiarism, storeFingerprint, generateFingerprint };
