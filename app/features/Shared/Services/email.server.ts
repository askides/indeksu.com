export async function send(
  to: string | string[],
  subject: string,
  content: string
) {
  const from = process.env.EMAIL_FROM!;

  console.log("Sending email with Resend...");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${process.env.APP_NAME} <${from}>`,
      to: to,
      subject: subject,
      html: content,
    }),
  });

  const data = await response.json();

  if (response.ok) {
    return { status: "success", data: data };
  }

  throw new Error("Failed to send the email.");
}
