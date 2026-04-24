import type { CollectionAfterChangeHook } from 'payload'

export const notifyContactFormSubmission: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') return doc

  const fields: Array<{ field: string; value: string }> = doc.submissionData ?? []
  const getValue = (name: string) => fields.find((f) => f.field === name)?.value ?? ''

  const subject = getValue('subject') || 'New Contact Form Submission'
  const html = `
    <h2>New contact form submission — Heart in Motion HK</h2>
    <table style="border-collapse: collapse; width: 100%;">
      ${fields.map(({ field, value }) => `
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #eee; font-weight: 600; background: #f9f9f9;">${field}</td>
          <td style="padding: 8px 12px; border: 1px solid #eee;">${value}</td>
        </tr>`).join('')}
    </table>
    <p style="color: #888; font-size: 12px; margin-top: 24px;">Submitted at ${new Date().toISOString()}</p>
  `

  try {
    await req.payload.sendEmail({
      to: process.env.EMAIL_FROM!,
      subject,
      html,
    })
  } catch (err) {
    req.payload.logger.error({ err }, 'notifyContactFormSubmission: failed to send email')
  }

  return doc
}
