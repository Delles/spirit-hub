# AdSense Owner Call - 2026-06-11

This note treats the AdSense setup as a Codex owner action, not a meeting.

## Call Summary

- Site: `spirithub.ro`
- AdSense status shown by Google: review requested.
- Verification method chosen: AdSense code snippet.
- Publisher/client id added to the app: `ca-pub-8681888147711861`
- Implementation: the shared `AdsenseScript` component is mounted inside the root layout `<head>`, so every page includes the Google snippet between `<head></head>`.
- Review request time shown in AdSense: 11 Jun 2026 15:57.

## Owner Action

Completed in AdSense:

1. Open the AdSense site review screen for `spirithub.ro`.
2. Keep `AdSense code snippet` selected.
3. Tick `I've placed the code`.
4. Click `Verify`.
5. If verification succeeds, click `Request review`.

## Evidence Needed Next

Keep one screenshot when Google returns the site review decision:

- Approval screenshot if Google approves `spirithub.ro`.
- Rejection or issue screenshot if Google asks for fixes.

Google says the review usually takes a few days, but in some cases can take 2-4 weeks.

## Follow-Up After Approval

Ad slots are not active yet. When AdSense approves the site, collect:

- result-page inline ad slot id,
- content-footer ad slot id,
- any Google policy warning or recommendation shown in the account.

Then configure the deployment variables for:

- `NEXT_PUBLIC_ADSENSE_SLOT_RESULT_INLINE`
- `NEXT_PUBLIC_ADSENSE_SLOT_CONTENT_FOOTER`
