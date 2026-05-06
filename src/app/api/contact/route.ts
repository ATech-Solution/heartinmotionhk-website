import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const CONTACT_FORM_TITLE = 'Contact Us'

async function getOrCreateContactForm(payload: Awaited<ReturnType<typeof getPayload>>) {
  const existing = await payload.find({
    collection: 'forms',
    where: { title: { equals: CONTACT_FORM_TITLE } },
    limit: 1,
    overrideAccess: true,
  })
  if (existing.docs.length > 0) return existing.docs[0]!

  return payload.create({
    collection: 'forms',
    overrideAccess: true,
    data: {
      title: CONTACT_FORM_TITLE,
      fields: [
        { blockType: 'text', name: 'fullName', label: 'Full Name', required: true },
        { blockType: 'email', name: 'email', label: 'Email Address', required: true },
        { blockType: 'text', name: 'phone', label: 'Phone Number', required: true },
        { blockType: 'text', name: 'subject', label: 'Subject', required: true },
        { blockType: 'textarea', name: 'message', label: 'Message', required: false },
      ],
      submitButtonLabel: 'Submit',
      confirmationType: 'message',
      confirmationMessage: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'Thank you! Your message has been received.', version: 1 }],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
        },
      },
    },
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { fullName, email, phone, subject, message } = body

    if (!fullName || !email || !phone || !subject) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const form = await getOrCreateContactForm(payload)

    const submissionData: Array<{ field: string; value: string }> = [
      { field: 'fullName', value: fullName },
      { field: 'email', value: email },
      { field: 'phone', value: phone },
      { field: 'subject', value: subject },
      ...(message ? [{ field: 'message', value: message }] : []),
    ]

    await payload.create({
      collection: 'form-submissions',
      overrideAccess: true,
      data: {
        form: form.id,
        submissionData,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Contact form submission error:', message, err)
    return NextResponse.json({ error: 'Failed to send message', detail: message }, { status: 500 })
  }
}
