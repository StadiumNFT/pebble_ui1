
PEBBLE STARTER BUNDLE
- ui-wow/  → GitHub Pages-ready website (CDN imports, kid-friendly UI)
- ui-onefile/ → single-file fallback (just upload index.html)
- proxy/   → Node/Express backend proxy
- docs/    → simple setup guides

Quickest path:
1) Create a public repo for the website. Upload CONTENTS of ui-wow/ to the repo ROOT.
2) Enable GitHub Pages (main / root). Open your site.
3) Create a second repo for the proxy, push proxy/ folder there, deploy to Render, set OPENAI_API_KEY.
4) Paste the proxy URL into the UI footer, Save. Done.
