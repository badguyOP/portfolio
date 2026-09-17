# Setting up the content editor (/admin)

This site now has a Decap CMS admin panel at `/admin` for adding Research
reports and Blog posts through a form — no code editing needed. It writes
directly to this repo (files in `/content/research` and `/content/blog`),
so every publish is just a normal git commit that triggers a Netlify
rebuild, same as if you'd pushed the change yourself.

## One-time setup (do this after deploying to Netlify)

1. **Push this repo to GitHub**, then create a new site on Netlify from it.
   Netlify will auto-detect the Next.js build settings.
2. In the Netlify dashboard for this site: **Site configuration → Identity
   → Enable Identity**.
3. Still under Identity → **Registration**, set it to **Invite only** (so
   random people can't sign themselves up).
4. Under Identity → **Services**, enable **Git Gateway**. This is what lets
   your login commit to the repo without you managing a GitHub token.
5. Under Identity → **Invite users**, invite your own email. You'll get an
   email with a link to set a password.
6. Visit `https://your-site.netlify.app/admin`, log in, and you're in.

## Using it day to day

- **New research report**: Research & Analysis → New Report. Fill in the
  fields, upload the PDF/Excel file (or paste a link instead), optionally
  add a cover image, hit **Publish**. It'll go live after the next build
  (usually under a minute on Netlify).
- **New blog post**: Blog → New Post. Write in the body field like a normal
  document — use the image icon in the toolbar to drop pictures in wherever
  you want them in the text.
- **Editing/deleting** existing entries: click into them from the CMS list
  view, same as adding new ones.

## If you ever move off Netlify

The CMS's login (`backend: git-gateway` in `public/admin/config.yml`) is
Netlify-specific. If you move hosting later, this is the one piece that
needs redoing — swap it for GitHub-OAuth-based login instead. Everything
else (the content files, the site itself) is unaffected either way.
