# GitHub Pages Custom Domain Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the existing GitHub Pages site at `https://www.peyt.org` and redirect `https://peyt.org` to the `www` hostname.

**Architecture:** Keep GitHub Pages as the static-site origin. Add a tracked `public/CNAME` file so Vite copies the canonical hostname into `dist/` on every build, then configure Cloudflare DNS with GitHub Pages' root A records and the repository account's `github.io` CNAME. Configure the Pages custom domain as `www.peyt.org`; do not introduce Cloudflare Tunnel.

**Tech Stack:** Vite 6, GitHub Actions Pages deployment, Cloudflare DNS, GitHub Pages custom domains.

## Global Constraints

- Canonical public hostname: `www.peyt.org`.
- Root hostname `peyt.org` must redirect to `www.peyt.org`.
- Cloudflare records must remain `DNS only` rather than proxied.
- The `www` CNAME target must be the GitHub Pages account hostname, not a guessed repository hostname.
- Do not change application routing, page content, or the existing deployment workflow.
- Do not create or use a Cloudflare Tunnel for this static GitHub Pages site.

---

### Task 1: Add the Pages custom-domain declaration

**Files:**
- Create: `public/CNAME`

**Interfaces:**
- Produces the build artifact file `dist/CNAME`, consumed by GitHub Pages during the existing deployment workflow.

- [ ] **Step 1: Create the exact CNAME file**

Create `public/CNAME` with exactly this content and one trailing newline:

```text
www.peyt.org
```

- [ ] **Step 2: Build and verify the artifact**

Run:

```bash
npm run build
```

Expected: the command exits successfully and `dist/CNAME` contains exactly `www.peyt.org`.

- [ ] **Step 3: Commit the repository change**

```bash
git add public/CNAME
git commit -m "chore: configure GitHub Pages custom domain"
```

### Task 2: Configure Cloudflare DNS

**Files:**
- External Cloudflare zone: `peyt.org`

**Interfaces:**
- Provides DNS resolution for `peyt.org` and `www.peyt.org` to GitHub Pages.

- [ ] **Step 1: Add the four root A records**

In Cloudflare DNS for `peyt.org`, add these records, each with proxy status `DNS only` and the default TTL:

```text
@  A  185.199.108.153
@  A  185.199.109.153
@  A  185.199.110.153
@  A  185.199.111.153
```

- [ ] **Step 2: Add the www CNAME record**

Add one DNS-only record:

```text
www  CNAME  <GitHub Pages account hostname>.github.io
```

Use the account hostname shown by the repository's GitHub Pages settings. For this repository, verify the account owner before saving; do not assume the `NoWint` or fork remote is the Pages owner.

- [ ] **Step 3: Confirm there are no conflicting records**

Verify that `@` has no conflicting CNAME record and `www` has no existing A/AAAA record. Do not delete unrelated records if any appear; stop and report them for review.

### Task 3: Set the GitHub Pages custom domain

**Files:**
- External GitHub repository Pages settings for the deployed `main` branch

**Interfaces:**
- Configures GitHub Pages to serve and validate `www.peyt.org`.

- [ ] **Step 1: Open Pages settings for the deployed repository**

Use the repository that owns the active Pages deployment and open **Settings → Pages**. Confirm the source is the existing GitHub Actions workflow before changing the custom domain.

- [ ] **Step 2: Set the custom domain**

Set the custom domain to:

```text
www.peyt.org
```

Save the setting and wait for GitHub to verify the DNS records. Do not enable any alternate domain.

- [ ] **Step 3: Enable HTTPS enforcement**

After GitHub reports the certificate as available, enable **Enforce HTTPS**. If GitHub reports a DNS or certificate error, leave the domain setting in place and report the exact error instead of changing DNS guesses.

### Task 4: Validate public behavior

**Files:**
- None

- [ ] **Step 1: Validate DNS resolution**

Run:

```bash
dig +short A peyt.org
dig +short CNAME www.peyt.org
dig +short A www.peyt.org
```

Expected: root resolves to the four GitHub Pages IPs; `www` resolves through the configured GitHub Pages CNAME.

- [ ] **Step 2: Validate the canonical site**

Run:

```bash
curl -I https://www.peyt.org
```

Expected: successful HTTPS response from the published site, with no certificate-name error.

- [ ] **Step 3: Validate root redirect**

Run:

```bash
curl -I https://peyt.org
```

Expected: a redirect response whose `Location` points to `https://www.peyt.org/` (preserving any requested path if GitHub provides that behavior).

- [ ] **Step 4: Check repository state**

Run:

```bash
git status --short
git log --oneline -2
```

Expected: a clean worktree and the CNAME commit present.
