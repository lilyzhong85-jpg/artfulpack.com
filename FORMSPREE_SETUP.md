# ArtfulPack inquiry setup

Status: frontend prepared; Formspree endpoint pending. No live delivery has been tested.

Set `data-formspree-endpoint` in `scripts/build.py` to the ArtfulPack form URL, then run `scripts/build.py`. This updates both homepage and contact form. Do not use another website's endpoint.

Activate the receiving email in Formspree. Confirm the account supports file uploads before enabling live submissions with attachments. The frontend accepts PNG, JPG, PDF and AI up to 10 MB.

Verify a real submission and receipt after activation, including an attachment. Until configured, the form prepares a brief for email or WhatsApp and explicitly reports that nothing has been sent. Attachments must be attached manually in that fallback conversation.
