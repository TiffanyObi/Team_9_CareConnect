import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repositoryRoot = path.resolve(appRoot, '..');
const mode = process.argv[2];
const pullRequestNumber = process.env.GITHUB_PR_NUMBER;

if (!['preview', 'production', 'cleanup'].includes(mode)) {
  throw new Error('Usage: node scripts/publish-github-pages.mjs <preview|production|cleanup>');
}

if (mode !== 'production' && !/^\d+$/.test(pullRequestNumber || '')) {
  throw new Error('Set GITHUB_PR_NUMBER to the pull request number for preview or cleanup.');
}

const distRoot = path.join(appRoot, 'dist');
if (mode !== 'cleanup' && !fs.existsSync(path.join(distRoot, 'index.html'))) {
  throw new Error('Build output is missing dist/index.html. Run npm run build first.');
}

function runGit(args, cwd = repositoryRoot, allowedStatuses = []) {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8', stdio: 'pipe' });
  if (result.error) throw result.error;
  if (result.status !== 0 && !allowedStatuses.includes(result.status)) {
    throw new Error(`git ${args.join(' ')} failed: ${result.stderr || result.stdout}`);
  }
  return result;
}

const branchExists = runGit(
  ['ls-remote', '--exit-code', 'origin', 'refs/heads/gh-pages'],
  repositoryRoot,
  [2],
).status === 0;

if (mode === 'cleanup' && !branchExists) {
  console.log('No gh-pages branch exists; there is no preview to clean up.');
  process.exit(0);
}

const temporaryRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'careconnect-pages-'));
const pagesWorktree = path.join(temporaryRoot, 'site');
let worktreeAdded = false;

try {
  if (branchExists) {
    runGit(['fetch', 'origin', 'gh-pages']);
    runGit(['worktree', 'add', '-B', 'gh-pages', pagesWorktree, 'origin/gh-pages']);
  } else {
    runGit(['worktree', 'add', '--orphan', '-b', 'gh-pages', pagesWorktree]);
  }
  worktreeAdded = true;

  if (mode === 'cleanup') {
    const previewRoot = path.resolve(pagesWorktree, 'pr-preview');
    const previewPath = path.resolve(previewRoot, pullRequestNumber);
    if (!previewPath.startsWith(`${previewRoot}${path.sep}`)) {
      throw new Error('Invalid preview path.');
    }
    fs.rmSync(previewPath, { recursive: true, force: true });
  } else {
    const destination = mode === 'production'
      ? pagesWorktree
      : path.join(pagesWorktree, 'pr-preview', pullRequestNumber);
    fs.mkdirSync(destination, { recursive: true });
    fs.cpSync(distRoot, destination, { recursive: true, force: true });
    fs.writeFileSync(path.join(pagesWorktree, '.nojekyll'), '');
  }

  runGit(['config', 'user.name', 'github-actions[bot]'], pagesWorktree);
  runGit(['config', 'user.email', '41898282+github-actions[bot]@users.noreply.github.com'], pagesWorktree);
  runGit(['add', '-A'], pagesWorktree);

  if (runGit(['diff', '--cached', '--quiet'], pagesWorktree, [1]).status === 1) {
    const message = mode === 'production'
      ? 'Deploy web app to GitHub Pages'
      : mode === 'preview'
        ? `Deploy PR #${pullRequestNumber} preview`
        : `Remove PR #${pullRequestNumber} preview`;
    runGit(['commit', '-m', message], pagesWorktree);
    try {
      runGit(['push', 'origin', 'gh-pages'], pagesWorktree);
    } catch (pushError) {
      if (!branchExists) throw pushError;
      runGit(['fetch', 'origin', 'gh-pages'], pagesWorktree);
      runGit(['rebase', 'origin/gh-pages'], pagesWorktree);
      runGit(['push', 'origin', 'gh-pages'], pagesWorktree);
    }
  } else {
    console.log('GitHub Pages already contains this build.');
  }

  const repository = process.env.GITHUB_REPOSITORY || runGit(
    ['config', '--get', 'remote.origin.url'],
  ).stdout.trim().replace(/\.git$/, '').split(':').pop().replace(/.*github\.com\//, '');
  const [owner, name] = repository.split('/');
  const sitePath = mode === 'production' ? '' : `pr-preview/${pullRequestNumber}/`;
  const url = `https://${owner}.github.io/${name}/${sitePath}`;
  console.log(`${mode === 'cleanup' ? 'Removed preview' : 'Published'}: ${url}`);
} finally {
  if (worktreeAdded) runGit(['worktree', 'remove', '--force', pagesWorktree]);
  fs.rmSync(temporaryRoot, { recursive: true, force: true });
}
