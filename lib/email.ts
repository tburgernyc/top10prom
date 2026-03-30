// No 'use cache' — this module exports factory functions, not data fetches.
import { Resend } from 'resend'

const apiKey = process.env.RESEND_API_KEY
const fromAddress = process.env.RESEND_FROM ?? 'Top 10 Prom <noreply@top10prom.com>'

if (!apiKey) {
  console.warn('[Email] RESEND_API_KEY missing — email notifications disabled')
}

export const resend = apiKey ? new Resend(apiKey) : null

// ── Types ──────────────────────────────────────────────────────────────────

export interface BookingEmailData {
  customerName: string
  customerEmail: string
  parentEmail: string
  boutiqueName: string
  preferredDate: string
  preferredTime: string
  schoolName: string
  eventDate: string
  inquiryId: string
  dressName?: string | undefined
}

export interface StaffInviteEmailData {
  inviteeEmail: string
  boutiqueName: string
  role: string
  inviteLink: string
}

// ── HTML escape helper ─────────────────────────────────────────────────────

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// ── Email builders ─────────────────────────────────────────────────────────

function buildBookingHtml(data: BookingEmailData): string {
  const dressLine = data.dressName
    ? `<p><strong>Dress:</strong> ${esc(data.dressName)}</p>`
    : `<p><strong>Dress:</strong> To be selected in-store</p>`

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#050505;font-family:system-ui,sans-serif;color:#F5F5F5;">
  <div style="max-width:520px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:28px;color:#D4AF37;">✦</span>
      <h1 style="color:#D4AF37;font-size:22px;margin:8px 0 4px;">Top 10 Prom</h1>
      <p style="color:#C0C0C0;font-size:14px;margin:0;">Booking Confirmation</p>
    </div>

    <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:24px;margin-bottom:24px;">
      <h2 style="color:#F5F5F5;font-size:18px;margin:0 0 16px;">Your appointment request has been received!</h2>
      <p style="color:#C0C0C0;font-size:14px;margin:0 0 16px;">Hi ${esc(data.customerName)}, here are your booking details:</p>

      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:8px 0;color:#C0C0C0;width:140px;">Store</td><td style="padding:8px 0;color:#F5F5F5;">${esc(data.boutiqueName)}</td></tr>
        <tr><td style="padding:8px 0;color:#C0C0C0;">Appointment</td><td style="padding:8px 0;color:#F5F5F5;">${esc(data.preferredDate)} at ${esc(data.preferredTime)}</td></tr>
        <tr><td style="padding:8px 0;color:#C0C0C0;">School</td><td style="padding:8px 0;color:#F5F5F5;">${esc(data.schoolName)}</td></tr>
        <tr><td style="padding:8px 0;color:#C0C0C0;">Prom Date</td><td style="padding:8px 0;color:#F5F5F5;">${esc(data.eventDate)}</td></tr>
      </table>
      ${dressLine}
    </div>

    <div style="background:rgba(212,175,55,0.08);border:1px solid rgba(212,175,55,0.2);border-radius:12px;padding:16px;margin-bottom:24px;">
      <p style="color:#C0C0C0;font-size:13px;margin:0;">Our team will confirm your appointment within <strong style="color:#D4AF37;">24 hours</strong>. If you need to make changes, please contact your boutique directly.</p>
    </div>

    <p style="color:#C0C0C0;font-size:12px;text-align:center;margin:0;">Reference ID: ${esc(data.inquiryId)}</p>
  </div>
</body>
</html>`.trim()
}

function buildParentBookingHtml(data: BookingEmailData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#050505;font-family:system-ui,sans-serif;color:#F5F5F5;">
  <div style="max-width:520px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:28px;color:#D4AF37;">✦</span>
      <h1 style="color:#D4AF37;font-size:22px;margin:8px 0 4px;">Top 10 Prom</h1>
      <p style="color:#C0C0C0;font-size:14px;margin:0;">Parent/Guardian Notification</p>
    </div>

    <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:24px;margin-bottom:24px;">
      <p style="color:#C0C0C0;font-size:14px;margin:0 0 16px;">This is to inform you that <strong style="color:#F5F5F5;">${esc(data.customerName)}</strong> has submitted a prom dress appointment request at Top 10 Prom:</p>

      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:8px 0;color:#C0C0C0;width:140px;">Store</td><td style="padding:8px 0;color:#F5F5F5;">${esc(data.boutiqueName)}</td></tr>
        <tr><td style="padding:8px 0;color:#C0C0C0;">Appointment</td><td style="padding:8px 0;color:#F5F5F5;">${esc(data.preferredDate)} at ${esc(data.preferredTime)}</td></tr>
        <tr><td style="padding:8px 0;color:#C0C0C0;">School</td><td style="padding:8px 0;color:#F5F5F5;">${esc(data.schoolName)}</td></tr>
        <tr><td style="padding:8px 0;color:#C0C0C0;">Prom Date</td><td style="padding:8px 0;color:#F5F5F5;">${esc(data.eventDate)}</td></tr>
      </table>
    </div>

    <p style="color:#C0C0C0;font-size:12px;text-align:center;margin:0;">If you have questions, please contact the boutique directly.</p>
  </div>
</body>
</html>`.trim()
}

function buildStaffInviteHtml(data: StaffInviteEmailData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#050505;font-family:system-ui,sans-serif;color:#F5F5F5;">
  <div style="max-width:520px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:28px;color:#D4AF37;">✦</span>
      <h1 style="color:#D4AF37;font-size:22px;margin:8px 0 4px;">Top 10 Prom</h1>
      <p style="color:#C0C0C0;font-size:14px;margin:0;">Staff Invitation</p>
    </div>

    <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:24px;margin-bottom:24px;">
      <p style="color:#C0C0C0;font-size:14px;margin:0 0 16px;">You have been invited to join <strong style="color:#F5F5F5;">${esc(data.boutiqueName)}</strong> as a <strong style="color:#D4AF37;">${esc(data.role)}</strong>.</p>
      <p style="color:#C0C0C0;font-size:14px;margin:0 0 24px;">Click the button below to accept your invitation and set up your account:</p>
      <div style="text-align:center;">
        <a href="${esc(encodeURI(data.inviteLink))}" style="display:inline-block;padding:12px 32px;background:#D4AF37;color:#050505;font-weight:700;text-decoration:none;border-radius:10px;font-size:14px;">Accept Invitation</a>
      </div>
    </div>

    <p style="color:#C0C0C0;font-size:12px;text-align:center;margin:0;">This invitation link expires in 7 days. If you did not expect this, you can safely ignore this email.</p>
  </div>
</body>
</html>`.trim()
}

export interface ParentShareEmailData {
  parentEmail: string
  parentName: string
  dressName: string
  boutiqueName?: string | undefined
  shareUrl: string
}

function buildParentShareHtml(data: ParentShareEmailData): string {
  const boutiqueFragment = data.boutiqueName
    ? ` from <strong style="color:#F5F5F5;">${esc(data.boutiqueName)}</strong>`
    : ''
  const safeShareUrl = esc(encodeURI(data.shareUrl))
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#050505;font-family:system-ui,sans-serif;color:#F5F5F5;">
  <div style="max-width:520px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:28px;color:#D4AF37;">✦</span>
      <h1 style="color:#D4AF37;font-size:22px;margin:8px 0 4px;">Top 10 Prom</h1>
    </div>
    <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:24px;margin-bottom:24px;">
      <h2 style="color:#F5F5F5;font-size:18px;margin:0 0 12px;">Hi ${esc(data.parentName)} 👋</h2>
      <p style="color:#C0C0C0;font-size:15px;line-height:1.6;margin-bottom:20px;">
        Someone has picked out <strong style="color:#F5F5F5;">${esc(data.dressName)}</strong>${boutiqueFragment}
        and wants your opinion before booking an appointment.
      </p>
      <div style="text-align:center;margin-bottom:8px;">
        <a href="${safeShareUrl}" style="display:inline-block;background:#D4AF37;color:#050505;text-decoration:none;font-weight:700;padding:14px 32px;border-radius:12px;font-size:15px;">
          View Picks &amp; Vote →
        </a>
      </div>
    </div>
    <p style="color:#C0C0C0;font-size:12px;text-align:center;margin:0;border-top:1px solid rgba(255,255,255,0.1);padding-top:16px;">
      Top 10 Prom · One dress. One school. One night to remember.<br/>
      <a href="${safeShareUrl}" style="color:#D4AF37;">${esc(data.shareUrl)}</a>
    </p>
  </div>
</body>
</html>`.trim()
}

// ── Send functions ─────────────────────────────────────────────────────────

/**
 * Send booking confirmation emails to BOTH customer AND parent/guardian.
 * This is a business-critical invariant — both addresses MUST receive confirmation.
 */
export async function sendBookingConfirmationEmails(
  data: BookingEmailData
): Promise<void> {
  if (!resend) {
    console.warn('[Email] Resend not configured — skipping booking confirmation emails')
    return
  }

  const customerHtml = buildBookingHtml(data)
  const parentHtml   = buildParentBookingHtml(data)

  // Both sends are non-fatal — log errors but don't throw
  const results = await Promise.allSettled([
    resend.emails.send({
      from: fromAddress,
      to: data.customerEmail,
      subject: `Your Top 10 Prom appointment at ${data.boutiqueName} — ${data.preferredDate}`,
      html: customerHtml,
    }),
    resend.emails.send({
      from: fromAddress,
      to: data.parentEmail,
      subject: `Top 10 Prom appointment booked for ${data.customerName}`,
      html: parentHtml,
    }),
  ])

  for (const result of results) {
    if (result.status === 'rejected') {
      console.error('[Email] Failed to send booking confirmation:', result.reason)
    }
  }
}

/**
 * Send staff invite email.
 */
export async function sendStaffInviteEmail(
  data: StaffInviteEmailData
): Promise<void> {
  if (!resend) {
    console.warn('[Email] Resend not configured — skipping staff invite email')
    return
  }

  const { error } = await resend.emails.send({
    from: fromAddress,
    to: data.inviteeEmail,
    subject: `You're invited to join ${data.boutiqueName} on Top 10 Prom`,
    html: buildStaffInviteHtml(data),
  })

  if (error) {
    console.error('[Email] Failed to send staff invite:', error)
  }
}

/**
 * Send share-with-parent email so a parent/guardian can view and vote on dress picks.
 */
export async function sendParentShareEmail(
  data: ParentShareEmailData
): Promise<void> {
  if (!resend) {
    console.warn('[Email] Resend not configured — skipping parent share email')
    return
  }

  const { error } = await resend.emails.send({
    from: fromAddress,
    to: data.parentEmail,
    subject: `Someone wants your opinion on "${data.dressName}"`,
    html: buildParentShareHtml(data),
  })

  if (error) {
    console.error('[Email] Failed to send parent share email:', error)
  }
}
