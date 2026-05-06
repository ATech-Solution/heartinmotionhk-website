import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { fullName, email, phone, subject, message } = body

    if (!fullName || !email || !phone || !subject) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const html = `
      <h2>New contact form submission — Heart in Motion HK</h2>
      <table style="border-collapse: collapse; width: 100%; font-family: sans-serif;">
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #eee; font-weight: 600; background: #f9f9f9; width: 140px;">Full Name</td>
          <td style="padding: 8px 12px; border: 1px solid #eee;">${fullName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #eee; font-weight: 600; background: #f9f9f9;">Email</td>
          <td style="padding: 8px 12px; border: 1px solid #eee;">${email}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #eee; font-weight: 600; background: #f9f9f9;">Phone</td>
          <td style="padding: 8px 12px; border: 1px solid #eee;">${phone}</td>
        </tr>
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #eee; font-weight: 600; background: #f9f9f9;">Subject</td>
          <td style="padding: 8px 12px; border: 1px solid #eee;">${subject}</td>
        </tr>
        ${message ? `
        <tr>
          <td style="padding: 8px 12px; border: 1px solid #eee; font-weight: 600; background: #f9f9f9;">Message</td>
          <td style="padding: 8px 12px; border: 1px solid #eee; white-space: pre-wrap;">${message}</td>
        </tr>` : ''}
      </table>
      <p style="color: #888; font-size: 12px; margin-top: 24px;">Submitted at ${new Date().toISOString()}</p>
    `

    await payload.sendEmail({
      to: process.env.EMAIL_FROM!,
      subject: subject || 'New Contact Form Submission',
      html,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact form submission error:', err)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
