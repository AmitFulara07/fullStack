const axios = require('axios');

const SUPPORTED_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.cpp', '.c'];

const extractOwnerRepo = (repoUrl) => {
  const cleaned = repoUrl
    .replace('https://github.com/', '')
    .replace('http://github.com/', '')
    .replace(/\.git$/, '') // Strip .git extension
    .replace(/\/$/, '')
    .split('/');
  return { owner: cleaned[0], repo: cleaned[1] };
};

const fetchRepoFiles = async (repoUrl) => {
  const { owner, repo } = extractOwnerRepo(repoUrl);
  const isValidToken = process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN !== 'your_github_personal_access_token_here';
  const headers = isValidToken
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {};

  // Get full recursive file tree
  const treeRes = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`,
    { headers }
  );

  if (!treeRes.data.tree) {
    throw new Error('Could not fetch repository tree. Check if the repo is public.');
  }

  // Filter to supported source files only — skip node_modules, dist, .min.js
  const sourceFiles = treeRes.data.tree.filter(f =>
    f.type === 'blob' &&
    SUPPORTED_EXTENSIONS.some(ext => f.path.endsWith(ext)) &&
    !f.path.includes('node_modules') &&
    !f.path.includes('dist/') &&
    !f.path.includes('.min.')
  );

  if (sourceFiles.length === 0) {
    throw new Error('No supported source files found in this repository.');
  }

  // Limit to first 20 files to avoid GitHub API rate limits
  const filesToFetch = sourceFiles.slice(0, 20);

  // Fetch content of each file
  const files = await Promise.all(
    filesToFetch.map(async (f) => {
      try {
        const res = await axios.get(
          `https://api.github.com/repos/${owner}/${repo}/contents/${f.path}`,
          { headers }
        );
        const content = Buffer.from(res.data.content, 'base64').toString('utf-8');
        const ext = f.path.split('.').pop();
        return { path: f.path, content, language: ext };
      } catch {
        return null;
      }
    })
  );

  return files.filter(Boolean);
};

module.exports = { fetchRepoFiles };
