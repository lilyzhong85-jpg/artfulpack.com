# ArtfulPack inquiry setup

Status: Formspree endpoint configured as `https://formspree.io/f/xljdjwdp`; live delivery still needs a real submission test.

The homepage and contact form use `data-formspree-endpoint="https://formspree.io/f/xljdjwdp"`. Activate the receiving email in Formspree and verify a real submission, including an attachment if required.

Activate the receiving email in Formspree. Confirm the account supports file uploads before enabling live submissions with attachments. The frontend accepts PNG, JPG, PDF and AI up to 10 MB.

Verify a real submission and receipt after activation, including an attachment. Until configured, the form prepares a brief for email or WhatsApp and explicitly reports that nothing has been sent. Attachments must be attached manually in that fallback conversation.
