# Bridge policy and account-deletion pages

This directory is a standalone static site for GitHub Pages. It does not require a purchased domain or paid hosting. Keep this repository public if using GitHub Free.

## Publish with GitHub Pages

1. Create one **public** GitHub repository for the pages.
2. Copy the contents of this directory to the repository root (the `index.html` file should be at the repository root).
3. In the repository, open **Settings → Pages** and choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then save.
4. Wait for GitHub Pages to publish the site. The URLs will look like `https://YOUR-USERNAME.github.io/REPOSITORY/` with `/privacy/`, `/terms/`, `/child-safety/`, and `/delete-account/` paths.
5. In Supabase, add the full deletion-page URL to **Authentication → URL Configuration → Redirect URLs**. Keep the existing Android/app redirect URLs.
6. In Google Cloud OAuth, make sure the Supabase Auth callback URL is listed as an authorized redirect URI. The callback is the Supabase URL shown in the Supabase Google provider settings; the GitHub Pages URL is the final redirect target configured in Supabase.
7. If Bridge is to support Google Sign-In only, disable the Email provider in Supabase **Authentication → Sign In / Providers**. Email is currently enabled in the live project; check for any legacy email/password accounts first so their owners are not unexpectedly locked out.

The deletion form uses Bridge's public Supabase URL and publishable/anon key, which are also present in the app. It never contains a service-role key or requests a Google password. Before publishing, double-check those configuration values still match Bridge.

## Pages

- `privacy/index.html` — Privacy Policy, last updated September 26, 2026.
- `terms/index.html` — Terms & Conditions, effective September 26, 2026.
- `child-safety/index.html` — Child Safety Standards, last updated September 26, 2026.
- `delete-account/index.html` — ownership-verified deletion request form.

Use the in-app pages as the source of truth when updating legal text. Update the date on a page whenever its text changes materially. Play Console also requires a monitored child-safety contact email; use the developer account email if it is actively monitored for these reports, or provide a dedicated safety address.
