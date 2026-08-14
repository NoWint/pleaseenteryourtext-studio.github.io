# GitHub Pages Custom Domain Design

**Date:** 2026-08-15

## Goal

Serve the existing GitHub Pages deployment from `https://www.peyt.org`, while making `https://peyt.org` redirect to the `www` hostname.

## Selected Approach

Use GitHub Pages as the site origin and Cloudflare only as the authoritative DNS provider. Do not use Cloudflare Tunnel / `cloudflared`: the project is a static Vite site already deployed through `.github/workflows/deploy.yml`.

## DNS

Create DNS-only records in the Cloudflare `peyt.org` zone:

| Host | Type | Content | Proxy |
| --- | --- | --- | --- |
| `@` | A | `185.199.108.153` | DNS only |
| `@` | A | `185.199.109.153` | DNS only |
| `@` | A | `185.199.110.153` | DNS only |
| `@` | A | `185.199.111.153` | DNS only |
| `www` | CNAME | `<GitHub Pages account>.github.io` | DNS only |

The root-domain A records are GitHub Pages' documented addresses. The subdomain CNAME must use the account hostname for the repository that serves this Pages deployment, rather than the repository name.

## GitHub Pages

Set the serving repository's Pages custom domain to `www.peyt.org` and enable HTTPS once GitHub completes its DNS verification and certificate issuance. GitHub Pages handles the redirect from `peyt.org` to `www.peyt.org` when the custom domain is configured as `www.peyt.org` and the root domain resolves to GitHub Pages.

## Deployment Guardrail

Create `public/CNAME` containing exactly `www.peyt.org` plus a trailing newline. Vite copies `public/` to `dist/`, so every GitHub Pages deployment carries the custom-domain declaration instead of relying solely on a dashboard setting.

## Validation

1. Confirm both hostnames resolve to GitHub Pages DNS records.
2. Confirm `https://www.peyt.org` delivers the published site.
3. Confirm `https://peyt.org` redirects to `https://www.peyt.org`.
4. Confirm the Pages settings show HTTPS enforced.
