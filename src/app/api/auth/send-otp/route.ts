import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const resendApiKey = process.env.RESEND_API_KEY || '';
const resend = new Resend(resendApiKey);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const SECRET = resendApiKey || '11fc-secret-token-key';

function createOtpToken(email: string, otp: string): string {
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes validity
  const data = `${email.toLowerCase()}:${otp}:${expiresAt}`;
  const signature = crypto.createHmac('sha256', SECRET).update(data).digest('hex');
  return Buffer.from(JSON.stringify({ email: email.toLowerCase(), otp, expiresAt, signature })).toString('base64');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body?.email?.trim().toLowerCase();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Alamat email tidak valid.' },
        { status: 400 }
      );
    }

    // 1. Check if member exists in database
    let memberName = 'Member 11 Fight Camp';

    try {
      const { data: members, error } = await supabase
        .from('members')
        .select('*');

      if (!error && members && members.length > 0) {
        const found = members.find(
          (m: any) => m.email && m.email.toLowerCase().trim() === email
        );
        if (found) {
          memberName = found.name || 'Member 11 Fight Camp';
        }
      }
    } catch (dbErr) {
      console.warn('Supabase lookup warning in send-otp:', dbErr);
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const token = createOtpToken(email, otp);

    // 2. Send email via Resend
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kode Reset Password 11 Fight Camp</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #090a0c; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f4f4f5;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; margin: 30px auto; background-color: #121316; border: 1px solid #27272a; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 20px 32px; text-align: center; background: linear-gradient(180deg, #1f1414 0%, #121316 100%); border-bottom: 1px solid #27272a;">
              <div style="display: inline-block; padding: 6px 16px; background-color: rgba(186, 45, 29, 0.15); border: 1px solid rgba(186, 45, 29, 0.4); border-radius: 9999px; color: #d63725; font-size: 11px; font-weight: 800; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px;">
                11 FIGHT CAMP PONTIANAK
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 900; letter-spacing: -0.5px; text-transform: uppercase;">
                PEMULIHAN KATA SANDI
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px 32px 20px 32px;">
              <p style="margin: 0 0 16px 0; font-size: 15px; color: #e4e4e7; line-height: 1.6;">
                Halo <strong>${memberName}</strong>,
              </p>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #a1a1aa; line-height: 1.6;">
                Kami menerima permintaan untuk mengatur ulang kata sandi akun Member Portal 11 Fight Camp Anda. Gunakan kode verifikasi di bawah ini untuk melanjutkan:
              </p>
              
              <!-- OTP Box -->
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 24px 0;">
                <tr>
                  <td align="center" style="background-color: #1c1d22; border: 2px dashed #ba2d1d; border-radius: 12px; padding: 20px;">
                    <div style="font-size: 11px; font-weight: 700; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px;">
                      KODE VERIFIKASI KEAMANAN (OTP)
                    </div>
                    <div style="font-size: 34px; font-weight: 900; font-family: monospace; letter-spacing: 8px; color: #ffffff;">
                      ${otp}
                    </div>
                    <div style="font-size: 12px; color: #ef4444; margin-top: 8px; font-weight: 600;">
                      Berlaku selama 15 menit
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin: 24px 0 0 0; font-size: 13px; color: #71717a; line-height: 1.5;">
                Jika Anda tidak melakukan permintaan ini, silakan abaikan email ini atau hubungi Admin 11 Fight Camp jika ada aktivitas yang mencurigakan.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #090a0c; border-top: 1px solid #27272a; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #52525b;">
                © 11 Fight Camp • Pontianak, Kalimantan Barat
              </p>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #3f3f46;">
                Email otomatis dari sistem keamanan portal member 11 Fight Camp
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const { data: resendData, error: resendError } = await resend.emails.send({
      from: '11 Fight Camp <onboarding@resend.dev>',
      to: [email],
      subject: `[${otp}] Kode Reset Password Akun Member - 11 Fight Camp`,
      html: htmlContent,
    });

    if (resendError) {
      console.error('Resend API error:', resendError);
      
      // Friendly message explaining Resend sandbox rule
      let customMsg = resendError.message;
      if (resendError.message?.includes('testing emails to your own email address')) {
        customMsg = 'Akun Resend saat ini dalam mode Sandbox (hanya bisa kirim ke email pemilik akun Resend). Verifikasi domain di resend.com/domains untuk kirim ke seluruh email publik, atau gunakan bantuan Admin WhatsApp.';
      }

      return NextResponse.json(
        {
          success: false,
          message: customMsg,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      token,
      message: `Kode verifikasi telah berhasil dikirim ke ${email}. Silakan cek kotak masuk (inbox) atau spam Anda.`,
    });
  } catch (error: any) {
    console.error('Unexpected error in send-otp route:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Terjadi kesalahan server saat mengirim email.' },
      { status: 500 }
    );
  }
}
