# Vercel preview and production deployment

Vercel serves this app from the `web-react-app/` project root. It runs `npm run build` and publishes `dist/`. The Vercel rewrite sends browser routes to the SPA entry point so direct visits and refreshes on nested routes resolve through React Router. Vite's root-relative `/src/...` entry is replaced by generated `/assets/...` paths in production.

## One-time Vercel and GitHub setup

1. Create or select a Vercel project and link its root directory to `web-react-app/`.
2. Use the Vercel CLI from this directory to link the local checkout:

   ```bash
   npx --yes vercel@65.2.0 login
   npx --yes vercel@65.2.0 link
   ```

   Select the intended Vercel team and project. Keep `.vercel/` local; it is ignored by Git.
3. Add these repository Actions secrets in GitHub's **Settings → Secrets and variables → Actions**:
   - `VERCEL_TOKEN`: a Vercel token with access to the selected project.
   - `VERCEL_ORG_ID`: the Vercel team/account ID from `.vercel/project.json`.
   - `VERCEL_PROJECT_ID`: the project ID from `.vercel/project.json`.
4. In Vercel project settings, confirm the production branch is `main`, the root directory is `web-react-app`, the output directory is `dist`, and a public `.vercel.app` domain is assigned. Configure any custom domain and DNS there if desired.
5. Protect `main` and require the **Web app CI and deploy / verify** job before merging. Add the `production` GitHub environment and any required approval rule if production releases need approval.

Forked pull requests intentionally do not receive Vercel credentials and therefore do not deploy previews.

## Automated deployment

The workflow at `.github/workflows/web-ci-deploy.yml` runs ESLint, Jest with the coverage gate, the Vite production build, and Playwright in Chromium, Firefox, and WebKit. It saves Playwright reports and failure artifacts for 14 days. After verification succeeds:

- A pull request from this repository deploys a Vercel preview.
- A push to `main` deploys the production site over HTTPS.

The Vercel CLI prints the preview or production URL in the GitHub Actions job log. Confirm the production URL in Vercel project domains. Never commit Vercel credentials or `.vercel/`.

## Repeatable manual deployment

Run from `web-react-app/` after the one-time link:

```bash
npm ci
npm run lint
npm test -- --coverage
npm run build
npm run test:e2e
npm run deploy:preview
```

Test the preview before publishing. To publish the same project to production:

```bash
npm run deploy:production
```

The corresponding scripts pin Vercel CLI to `65.2.0`. CLI deployment uses the project settings and `vercel.json` in this directory.

## Preview smoke check

For both preview and production, open the root URL, log in with the demo account, navigate to an appointment detail URL, and refresh that nested URL directly. Confirm that the route remains rendered and the page loads generated JavaScript and CSS from `/assets/` with successful HTTPS requests. Also verify that an unauthenticated visit to `/appointments` redirects to `/login`.

This is a local-data demo. Do not enter real patient information or credentials into the public deployment.
