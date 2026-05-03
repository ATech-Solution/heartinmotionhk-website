/**
 * Mailpit API helper for reading captured test emails.
 * Mailpit SMTP: localhost:1025  |  API: localhost:8025
 */

const MAILPIT_API = process.env.MAILPIT_API ?? 'http://localhost:8025'

export interface MailpitMessage {
  ID: string
  From: { Address: string; Name: string }
  To: Array<{ Address: string; Name: string }>
  Subject: string
  Date: string
  Snippet: string
}

export interface MailpitMessageDetail extends MailpitMessage {
  HTML: string
  Text: string
}

export async function getEmails(): Promise<MailpitMessage[]> {
  const res = await fetch(`${MAILPIT_API}/api/v1/messages`)
  if (!res.ok) throw new Error(`Mailpit API error: ${res.status}`)
  const data = await res.json()
  return data.messages ?? []
}

export async function getEmailDetail(id: string): Promise<MailpitMessageDetail> {
  const res = await fetch(`${MAILPIT_API}/api/v1/message/${id}`)
  if (!res.ok) throw new Error(`Mailpit message fetch error: ${res.status}`)
  return res.json()
}

export async function waitForEmail(
  matcher: (msg: MailpitMessage) => boolean,
  timeoutMs = 15_000,
): Promise<MailpitMessage> {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    const messages = await getEmails()
    const found = messages.find(matcher)
    if (found) return found
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error('Timed out waiting for email matching condition')
}

export async function clearEmails(): Promise<void> {
  await fetch(`${MAILPIT_API}/api/v1/messages`, { method: 'DELETE' })
}

export async function isMailpitRunning(): Promise<boolean> {
  try {
    const res = await fetch(`${MAILPIT_API}/api/v1/info`, { signal: AbortSignal.timeout(2000) })
    return res.ok
  } catch {
    return false
  }
}
