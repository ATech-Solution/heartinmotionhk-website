export function forgotPasswordEmailTemplate({
  token,
  user,
}: {
  token: string
  user: { email: string; name?: string }
}): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const resetUrl = `${siteUrl}/reset-password?token=${token}`

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://fonts.googleapis.com/css2?family=Gochi+Hand&display=swap" rel="stylesheet" />
</head>
<body style="font-family: Inter, Arial, sans-serif; background: #fdf6ee; margin: 0; padding: 40px 20px;">
  <div style="max-width: 560px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 2px 16px rgba(45,45,45,0.08);">
    <img src="${siteUrl}/images/logo_header.png" alt="Heart in Motion HK" style="height: 48px; margin-bottom: 32px;" />
    <h2 style="font-family: 'Gochi Hand', sans-serif; color: #2d2d2d; font-size: 28px; margin: 0 0 16px;">Reset Your Password</h2>
    <p style="color: #555; line-height: 1.6;">Hi ${user.name ?? user.email},</p>
    <p style="color: #555; line-height: 1.6;">We received a request to reset your password. Click the button below to choose a new password. This link expires in 1 hour.</p>
    <a href="${resetUrl}" style="display: inline-block; margin: 24px 0; padding: 14px 32px; background: #6dbfb8; color: white; text-decoration: none; border-radius: 999px; font-weight: 600; font-size: 15px;">Reset Password</a>
    <p style="color: #888; font-size: 13px; line-height: 1.6;">If you did not request a password reset, you can safely ignore this email. Your password will not be changed.</p>
    <hr style="border: none; border-top: 1px solid #f0e8dc; margin: 32px 0;" />
    <p style="color: #aaa; font-size: 12px;"><a href="${siteUrl}" style="color: #6dbfb8;">Heart in Motion HK</a></p>
  </div>
</body>
</html>`
}
