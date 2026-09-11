import sgMail from "@sendgrid/mail";

const apiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.EMAIL_FROM ?? "no-reply@travulyn.com";

if (apiKey) {
  sgMail.setApiKey(apiKey);
}

async function send(to: string, subject: string, html: string) {
  if (!apiKey) {
    console.log(`[email:skipped, no SENDGRID_API_KEY] to=${to} subject="${subject}"\n${html}`);
    return;
  }
  await sgMail.send({ to, from: fromEmail, subject, html });
}

export async function sendCustomerPortalLink(params: {
  to: string;
  fullName: string;
  portalUrl: string;
}) {
  await send(
    params.to,
    "Track your travel documents with Travulyn",
    `<p>Hi ${params.fullName},</p>
     <p>Welcome to Travulyn! You can track the progress of your travel documents at the link below:</p>
     <p><a href="${params.portalUrl}">${params.portalUrl}</a></p>
     <p>This link is personal to you &mdash; no password needed.</p>`
  );
}

export async function sendProgressUpdate(params: {
  to: string;
  fullName: string;
  title: string;
  description?: string;
  portalUrl: string;
}) {
  await send(
    params.to,
    `Update on your Travulyn application: ${params.title}`,
    `<p>Hi ${params.fullName},</p>
     <p>${params.title}</p>
     ${params.description ? `<p>${params.description}</p>` : ""}
     <p>View full details: <a href="${params.portalUrl}">${params.portalUrl}</a></p>`
  );
}
