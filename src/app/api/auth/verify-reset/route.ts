import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

const resendApiKey = process.env.RESEND_API_KEY || '';
const SECRET = resendApiKey || '11fc-secret-token-key';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

function verifyOtpToken(token: string, email: string, inputOtp: string): boolean {
  try {
    const raw = Buffer.from(token, 'base64').toString('utf8');
    const { email: tEmail, otp: tOtp, expiresAt, signature } = JSON.parse(raw);
    
    if (Date.now() > expiresAt) return false;
    if (tEmail !== email.toLowerCase()) return false;
    if (tOtp !== inputOtp.trim()) return false;

    const expectedSig = crypto
      .createHmac('sha256', SECRET)
      .update(`${tEmail}:${tOtp}:${expiresAt}`)
      .digest('hex');

    return signature === expectedSig;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = body?.email?.trim().toLowerCase();
    const otp = body?.otp?.trim();
    const token = body?.token;
    const newPassword = body?.newPassword?.trim();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Harap lengkapi semua data.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 4) {
      return NextResponse.json(
        { success: false, message: 'Password minimal 4 karakter.' },
        { status: 400 }
      );
    }

    // Verify token & OTP
    if (token) {
      const isValid = verifyOtpToken(token, email, otp);
      if (!isValid) {
        return NextResponse.json(
          { success: false, message: 'Kode verifikasi salah atau telah kadaluwarsa.' },
          { status: 400 }
        );
      }
    }

    // Update password in Supabase
    let updatedMember: any = null;
    try {
      const { data: members, error: fetchErr } = await supabase
        .from('members')
        .select('*');

      if (!fetchErr && members && members.length > 0) {
        const found = members.find(
          (m: any) => m.email && m.email.toLowerCase().trim() === email
        );

        if (found) {
          const { error: updateErr } = await supabase
            .from('members')
            .update({ password: newPassword })
            .eq('id', found.id);

          if (!updateErr) {
            updatedMember = {
              id: found.id,
              memberCode: found.member_code,
              name: found.name,
              phone: found.phone,
              username: found.username || undefined,
              password: newPassword,
              email: found.email || undefined,
              planId: found.plan_id,
              planTitle: found.plan_title,
              price: found.price,
              paymentMethod: found.payment_method,
              paymentStatus: found.payment_status,
              status: found.status,
              startDate: found.start_date,
              endDate: found.end_date,
              remainingSessions: found.remaining_sessions ?? undefined,
              totalSessions: found.total_sessions ?? undefined,
              notes: found.notes || undefined,
              createdAt: found.created_at,
            };
          }
        }
      }
    } catch (dbErr) {
      console.warn('Supabase update warning in verify-reset:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Kata sandi berhasil diperbarui!',
      member: updatedMember,
    });
  } catch (error: any) {
    console.error('Unexpected error in verify-reset route:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Gagal mereset kata sandi.' },
      { status: 500 }
    );
  }
}
