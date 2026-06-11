# AdSense Owner Call - 2026-06-11

This note treats the AdSense setup as a Codex owner action, not a meeting.

## Call Summary

- Site: `spirithub.ro`
- AdSense status shown by Google: site requires review.
- Verification method chosen: AdSense code snippet.
- Publisher/client id added to the app: `ca-pub-8681888147711861`
- Implementation: the shared `AdsenseScript` component is mounted inside the root layout `<head>`, so every page includes the Google snippet between `<head></head>`.

## Owner Action

After this change is deployed to production:

1. Open the AdSense site review screen for `spirithub.ro`.
2. Keep `AdSense code snippet` selected.
3. Tick `I've placed the code`.
4. Click `Verify`.
5. If verification succeeds, click `Request review`.

## Evidence Needed Next

Keep one screenshot after the AdSense account action:

- Success screenshot if AdSense accepts the verification and review request.
- Error screenshot if Google still cannot detect the code.

## Follow-Up After Approval

Ad slots are not active yet. When AdSense approves the site, collect:

- result-page inline ad slot id,
- content-footer ad slot id,
- any Google policy warning or recommendation shown in the account.

Then configure the deployment variables for:

- `NEXT_PUBLIC_ADSENSE_SLOT_RESULT_INLINE`
- `NEXT_PUBLIC_ADSENSE_SLOT_CONTENT_FOOTER`
