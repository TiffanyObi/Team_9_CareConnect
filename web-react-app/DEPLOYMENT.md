# GitHub Pages preview and production deployment

The public site is configured for GitHub Pages:

- App root: `web-react-app/`
- Build output: `web-react-app/dist/`
- Production URL: `https://tiffanyobi.github.io/Team_9_CareConnect/`
- Preview URL for PR `42`: `https://tiffanyobi.github.io/Team_9_CareConnect/pr-preview/42/`

The app uses hash-based routes (for example, `/#/appointments`) because GitHub Pages does not rewrite arbitrary nested paths to the SPA entry point. Refreshing a route reloads `index.html` while retaining its route fragment. Vite emits relative `./assets/` URLs so the same build works from the production root and PR preview subdirectories. `npm run verify:build` checks that the generated JavaScript and CSS paths resolve to files inside `dist/`.

## One-time repository setup

1. Ensure the repository is public if the site must be publicly accessible on the GitHub Free plan.
2. Merge the workflow and app changes to `main`. CI verifies the app, then creates/updates the `gh-pages` branch with the production output.
3. In the repository, open **Settings → Pages**. Under **Build and deployment**, select **Deploy from a branch**, choose `gh-pages` and `/ (root)`, and save.
4. Wait for GitHub Pages to publish the site. Enable **Enforce HTTPS** in the same settings when it becomes available. GitHub supplies and renews HTTPS for the `github.io` domain; no deployment secrets or Vercel configuration are required.
5. Configure the `production` GitHub Actions environment or branch protection if production deployments should require approval.

The deployment workflow needs the repository's default `GITHUB_TOKEN` with `contents: write` to publish static files to `gh-pages`. No personal access token is used. If repository policy restricts workflow write permissions, enable **Settings → Actions → General → Workflow permissions → Read and write permissions**.

## Automated build, test, and deployment

The workflow at `.github/workflows/web-ci-deploy.yml` runs ESLint, Jest with coverage reporting (no minimum coverage threshold), the Vite build and asset-path verification, and Playwright in Chromium, Firefox, and WebKit. It saves browser reports and failure artifacts for 14 days. The separate `.github/workflows/web-pages-publish.yml` workflow publishes the successful build artifact. Keeping deployment in a trusted `workflow_run` workflow means PR-controlled build code does not execute with the repository's write token.

- Same-repository pull requests publish at `/pr-preview/<number>/` after all checks pass. The route is removed from the published branch when the PR closes.
- Fork pull requests run checks but do not publish a preview, because their code is untrusted.
- A push to `main` publishes the production site after all checks pass. Production deploys retain existing open-PR preview directories.

The workflow run's `preview/pr-<number>` or `production` environment links to the deployed HTTPS URL.

## Repeatable manual deployment

Run from `web-react-app/` with a Git remote named `origin` and permission to push to `gh-pages`:

```bash
npm ci
npm run lint
npm test -- --coverage
npm run build
npm run verify:build
npm run test:e2e
npm run deploy:production
```

To publish a preview at a PR-specific URL, first build and verify, then set the PR number and run the preview script:

```bash
npm run build
npm run verify:build
GITHUB_PR_NUMBER=42 npm run deploy:preview
```

In PowerShell, set the number with `$env:GITHUB_PR_NUMBER = "42"` before running `npm run deploy:preview`. To remove a preview manually, run `node scripts/publish-github-pages.mjs cleanup` with `GITHUB_PR_NUMBER` set. The deploy script safely updates only the selected production root or numeric PR preview directory on `gh-pages`.

## HTTPS and refresh smoke check

After deployment:

1. Open the production URL and verify the address uses `https://`.
2. Navigate to an appointment detail screen; confirm the URL contains a `#/appointments/...` fragment.
3. Refresh the page. Confirm the appointment screen still renders.
4. In browser developer tools, verify the JavaScript and CSS requests use relative `assets/` URLs under the current site or preview directory and return HTTP 200.
5. Open the public PR preview URL and repeat the route-refresh and asset checks.
6. Open `/#/appointments` while signed out and confirm the app redirects to its login screen.

This is a local-data demo. Do not enter real patient information or credentials into the public deployment.
