import { Resend } from 'resend'

function getResend() {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

export async function sendNewMessageNotification({
  name,
  email,
  phone,
  message,
}: {
  name: string
  email: string
  phone: string
  message: string
}) {
  const resend = getResend()
  if (!resend) return // Resend not configured yet — skip silently

  await resend.emails.send({
    from: 'Trusty Paws Website <noreply@trustypawco.com>',
    to: process.env.RESEND_TO_EMAIL!,
    subject: `New message from ${name} — Trusty Paws Co.`,
    text: `You have a new message from your website.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}\n\nLog in to your portal to reply: ${process.env.NEXT_PUBLIC_SITE_URL}/admin/messages`,
  })
}
