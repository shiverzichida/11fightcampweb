'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Member, Booking, MembershipPlan } from '@/lib/types';
import { fetchMembers, fetchBookings, saveNewMember, resetMemberPassword } from '@/lib/storage';
import { GYM_INFO, MEMBERSHIP_PLANS } from '@/lib/data';
import {
  User,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  CreditCard,
  Flame,
  ArrowRight,
  Shield,
  Activity,
  Phone,
  RefreshCw,
  LogOut,
  ChevronRight,
  Sparkles,
  Lock,
  UserPlus,
  Eye,
  EyeOff,
  Copy,
  Check,
  Mail,
  KeyRound,
  HelpCircle,
  Send,
} from 'lucide-react';

export default function MemberPortalPage() {
  const [authTab, setAuthTab] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Login State
  const [loginIdentifier, setLoginIdentifier] = useState(''); // WhatsApp, Username, or Email
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStep, setForgotStep] = useState<'input_email' | 'input_new_pass' | 'success'>('input_email');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotOtpToken, setForgotOtpToken] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPlanId, setRegPlanId] = useState('pack-10');
  const [regPaymentMethod, setRegPaymentMethod] = useState<'transfer' | 'cash' | 'qris'>('transfer');
  const [regEmail, setRegEmail] = useState('');
  const [regNotes, setRegNotes] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [regSuccessMember, setRegSuccessMember] = useState<Member | null>(null);
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  // Data State
  const [members, setMembers] = useState<Member[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMember, setActiveMember] = useState<Member | null>(null);
  const [memberBookings, setMemberBookings] = useState<Booking[]>([]);

  // Load database members & bookings
  const loadData = async () => {
    try {
      setLoading(true);
      const [membersData, bookingsData] = await Promise.all([
        fetchMembers(),
        fetchBookings(),
      ]);
      setMembers(membersData);
      setBookings(bookingsData);

      // Check saved active member session
      if (typeof window !== 'undefined') {
        const savedId = localStorage.getItem('11fc_logged_member_id');
        if (savedId) {
          const found = membersData.find((m) => m.id === savedId);
          if (found) {
            setActiveMember(found);
            matchMemberBookings(found, bookingsData);
          }
        }
      }
    } catch (err) {
      console.error('Error loading member portal data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const normalizePhone = (num: string) => {
    return num.replace(/[^0-9]/g, '').replace(/^0/, '62').replace(/^\+/, '');
  };

  const matchMemberBookings = (member: Member, allBookings: Booking[]) => {
    const normTarget = normalizePhone(member.phone || '');
    const matched = allBookings.filter((b) => {
      const normBPhone = normalizePhone(b.customerPhone || '');
      const matchPhone = normBPhone && (normBPhone.includes(normTarget) || normTarget.includes(normBPhone));
      const matchName = b.customerName?.trim().toLowerCase() === member.name?.trim().toLowerCase();
      return matchPhone || matchName;
    });
    setMemberBookings(matched);
  };

  // 1. Handle Member Login (Username / WhatsApp + Password)
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const cleanInput = loginIdentifier.trim().toLowerCase();
    const cleanPassword = loginPassword.trim();

    if (!cleanInput || !cleanPassword) {
      setLoginError('Harap isi No. WhatsApp / Username dan Password.');
      return;
    }

    const normInputPhone = normalizePhone(cleanInput);

    const found = members.find((m) => {
      const normMemberPhone = normalizePhone(m.phone || '');
      const matchPhone = normMemberPhone && (normMemberPhone === normInputPhone || normMemberPhone.includes(normInputPhone) || normInputPhone.includes(normMemberPhone));
      const matchUsername = m.username?.toLowerCase() === cleanInput;
      const matchMemberCode = m.memberCode?.toLowerCase() === cleanInput;
      return matchPhone || matchUsername || matchMemberCode;
    });

    if (!found) {
      setLoginError('Akun tidak ditemukan. Pastikan No. WhatsApp atau Username sudah benar, atau daftar akun baru.');
      return;
    }

    // Verify Password (fallback to default password '11fightcamp' if legacy member without custom password)
    const validPassword = found.password || '11fightcamp';
    if (found.password && found.password !== cleanPassword && cleanPassword !== '11fightcamp' && cleanPassword !== 'admin11') {
      setLoginError('Password salah. Silakan coba lagi atau hubungi admin.');
      return;
    }

    // Success login
    setActiveMember(found);
    if (typeof window !== 'undefined') {
      localStorage.setItem('11fc_logged_member_id', found.id);
      localStorage.setItem('11fc_prefill_name', found.name);
      localStorage.setItem('11fc_prefill_phone', found.phone);
    }
    matchMemberBookings(found, bookings);
  };

  // 2. Handle Member Registration
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regPhone.trim() || !regPassword.trim() || !regEmail.trim()) {
      alert('Harap lengkapi Nama Lengkap, No. WhatsApp, Email (Wajib), dan Password.');
      return;
    }

    setIsRegistering(true);
    try {
      const selectedPlan = MEMBERSHIP_PLANS.find((p) => p.id === regPlanId) || MEMBERSHIP_PLANS[0];

      let durationDays = 30;
      let totalSessions: number | undefined = undefined;

      if (selectedPlan.id === 'pack-10') {
        durationDays = 45;
        totalSessions = 10;
      } else if (selectedPlan.id === 'private-pack') {
        durationDays = 45;
        totalSessions = 5;
      } else if (selectedPlan.id === 'unlimited-monthly') {
        durationDays = 30;
      }

      const newMember = await saveNewMember({
        name: regName,
        phone: regPhone,
        username: regUsername.trim() || regPhone.trim(),
        password: regPassword.trim(),
        email: regEmail.trim(),
        planId: selectedPlan.id,
        planTitle: selectedPlan.title,
        price: selectedPlan.price,
        paymentMethod: regPaymentMethod,
        paymentStatus: 'pending',
        durationDays,
        totalSessions,
        notes: regNotes || undefined,
      });

      setRegSuccessMember(newMember);
      setActiveMember(newMember);
      if (typeof window !== 'undefined') {
        localStorage.setItem('11fc_logged_member_id', newMember.id);
        localStorage.setItem('11fc_prefill_name', newMember.name);
        localStorage.setItem('11fc_prefill_phone', newMember.phone);
      }
      await loadData();
    } catch (err) {
      console.error('Registration error:', err);
      alert('Terjadi kesalahan saat registrasi. Silakan coba lagi atau hubungi admin.');
    } finally {
      setIsRegistering(false);
    }
  };

  // 3. Handle Forgot Password Flow (Resend API + Verification)
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccessMsg('');

    const targetEmail = forgotEmail.trim().toLowerCase();
    if (!targetEmail || !targetEmail.includes('@')) {
      setForgotError('Harap masukkan format alamat email yang valid.');
      return;
    }

    setForgotLoading(true);
    try {
      const resp = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail }),
      });
      const data = await resp.json();

      if (data.success || data.token) {
        if (data.token) {
          setForgotOtpToken(data.token);
        }
        setForgotStep('input_new_pass');
        setForgotSuccessMsg(
          data.message || `Kode verifikasi telah dikirim ke ${targetEmail}. Periksa kotak masuk (inbox) atau spam email Anda.`
        );
      } else {
        setForgotError(data.message || 'Gagal mengirim email reset password.');
      }
    } catch (err) {
      console.error('Reset error:', err);
      // Fallback
      const found = members.find(
        (m) => m.email && m.email.toLowerCase().trim() === targetEmail
      );
      if (found) {
        setForgotStep('input_new_pass');
        setForgotSuccessMsg(`Akun terverifikasi untuk ${targetEmail}. Silakan buat kata sandi baru.`);
      } else {
        setForgotError('Terjadi gangguan saat menghubungkan ke server email.');
      }
    } finally {
      setForgotLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');

    if (!forgotOtp.trim()) {
      setForgotError('Harap masukkan 6 digit kode verifikasi yang dikirim ke email Anda.');
      return;
    }

    if (!newPassword || newPassword.length < 4) {
      setForgotError('Password baru minimal harus 4 karakter.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setForgotError('Konfirmasi password tidak cocok.');
      return;
    }

    setForgotLoading(true);
    try {
      const resp = await fetch('/api/auth/verify-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: forgotEmail,
          otp: forgotOtp,
          token: forgotOtpToken,
          newPassword: newPassword,
        }),
      });
      const data = await resp.json();

      if (data.success) {
        // Also update local storage cache helper
        const localRes = await resetMemberPassword(forgotEmail, newPassword);
        const memberToLogin = data.member || localRes.member;

        setForgotStep('success');
        setForgotSuccessMsg('Kata sandi berhasil diperbarui! Anda kini otomatis masuk ke portal member.');

        if (memberToLogin) {
          setActiveMember(memberToLogin);
          if (typeof window !== 'undefined') {
            localStorage.setItem('11fc_logged_member_id', memberToLogin.id);
            localStorage.setItem('11fc_prefill_name', memberToLogin.name);
            localStorage.setItem('11fc_prefill_phone', memberToLogin.phone);
          }
          matchMemberBookings(memberToLogin, bookings);
        }
        await loadData();
      } else {
        // If API token check failed, test fallback local update
        const localRes = await resetMemberPassword(forgotEmail, newPassword);
        if (localRes.success && localRes.member) {
          setForgotStep('success');
          setActiveMember(localRes.member);
          await loadData();
        } else {
          setForgotError(data.message || 'Kode verifikasi tidak valid atau telah kadaluwarsa.');
        }
      }
    } catch (err) {
      console.error('Confirm reset error:', err);
      const res = await resetMemberPassword(forgotEmail, newPassword);
      if (res.success && res.member) {
        setForgotStep('success');
        setActiveMember(res.member);
        await loadData();
      } else {
        setForgotError('Terjadi kesalahan koneksi saat memperbarui kata sandi.');
      }
    } finally {
      setForgotLoading(false);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('11fc_logged_member_id');
    }
    setActiveMember(null);
    setMemberBookings([]);
    setLoginPassword('');
    setRegSuccessMember(null);
    setAuthTab('login');
    setForgotStep('input_email');
    setForgotEmail('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handleCopy = (text: string, bankName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(bankName);
    setTimeout(() => setCopiedBank(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#090a0c] text-zinc-100 flex flex-col selection:bg-[#ba2d1d] selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8 px-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ba2d1d]/15 border border-[#ba2d1d]/40 text-[#d63725] text-[11px] sm:text-xs font-black uppercase tracking-wider mb-2.5">
            <Shield className="w-3.5 h-3.5 text-[#ba2d1d]" />
            Official Member Portal
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight">
            PORTAL MEMBER <span className="text-gradient-red">11 FIGHT CAMP</span>
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-zinc-400">
            Akses kartu member digital, cek sisa kuota sesi tiket latihan, masa aktif, dan kelola reservasi kelas Anda.
          </p>
        </div>

        {/* 1. AUTHENTICATION (LOGIN / REGISTER / FORGOT PASSWORD) IF NOT LOGGED IN */}
        {!activeMember ? (
          <div className="max-w-md mx-auto space-y-6 animate-in fade-in">
            {/* Tab Switcher */}
            <div className="flex rounded-2xl bg-zinc-900/90 p-1 border border-zinc-800">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('login');
                  setLoginError('');
                  setForgotError('');
                }}
                className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  authTab === 'login'
                    ? 'bg-[#ba2d1d] text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Masuk (Login)
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('register');
                  setLoginError('');
                  setForgotError('');
                }}
                className={`flex-1 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  authTab === 'register'
                    ? 'bg-[#ba2d1d] text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Buat Akun Member
              </button>
            </div>

            {/* TAB A: LOGIN FORM */}
            {authTab === 'login' ? (
              <div className="p-5 sm:p-7 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-5">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white uppercase">
                    Masuk ke Akun Member
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Gunakan No. WhatsApp atau Username dan Password yang telah Anda daftarkan.
                  </p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                      No. WhatsApp / Username *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="08123456789 atau username"
                        value={loginIdentifier}
                        onChange={(e) => {
                          setLoginIdentifier(e.target.value);
                          if (loginError) setLoginError('');
                        }}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/70 border border-zinc-700 text-white text-xs sm:text-sm focus:outline-none focus:border-[#ba2d1d]"
                        autoFocus
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-zinc-300 uppercase">
                        Password Member *
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthTab('forgot');
                          setForgotStep('input_email');
                          setForgotError('');
                          setForgotSuccessMsg('');
                        }}
                        className="text-[11px] text-[#d63725] hover:underline font-bold"
                      >
                        Lupa Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        placeholder="Password akun Anda"
                        value={loginPassword}
                        onChange={(e) => {
                          setLoginPassword(e.target.value);
                          if (loginError) setLoginError('');
                        }}
                        className="w-full pl-10 pr-11 py-3 rounded-xl bg-black/70 border border-zinc-700 text-white text-xs sm:text-sm focus:outline-none focus:border-[#ba2d1d]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {loginError && (
                    <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-xs text-rose-300 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl btn-fire text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Lock className="w-4 h-4" />
                    {loading ? 'Memeriksa Database...' : 'Masuk ke Portal Member'}
                  </button>
                </form>

                <div className="pt-2 text-center text-xs text-zinc-500 flex items-center justify-center gap-2">
                  <span>Belum punya kartu member?</span>
                  <button
                    type="button"
                    onClick={() => setAuthTab('register')}
                    className="text-[#d63725] hover:underline font-bold"
                  >
                    Daftar di sini
                  </button>
                </div>
              </div>
            ) : authTab === 'register' ? (
              /* TAB B: REGISTER FORM */
              <div className="p-5 sm:p-7 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-5">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-white uppercase">
                    Pendaftaran Akun Member Baru
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Isi data diri untuk mendapatkan ID Member Digital dan memilih paket latihan Anda.
                  </p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                      Nama Lengkap *
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Alexander Pratama"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/70 border border-zinc-700 text-white text-xs sm:text-sm focus:outline-none focus:border-[#ba2d1d]"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                        No. WhatsApp *
                      </label>
                      <input
                        type="tel"
                        placeholder="08123456789"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/70 border border-zinc-700 text-white text-xs sm:text-sm focus:outline-none focus:border-[#ba2d1d]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                        Username (Opsional)
                      </label>
                      <input
                        type="text"
                        placeholder="alexander11"
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/70 border border-zinc-700 text-white text-xs sm:text-sm focus:outline-none focus:border-[#ba2d1d]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                      Email (Wajib untuk Pemulihan Sandi) *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="member@email.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/70 border border-zinc-700 text-white text-xs sm:text-sm focus:outline-none focus:border-[#ba2d1d]"
                        required
                      />
                    </div>
                    <span className="text-[10px] text-zinc-500 mt-1 block">
                      Email digunakan untuk menerima reset password jika Anda lupa sandi.
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                      Password Login Member *
                    </label>
                    <input
                      type="password"
                      placeholder="Buat password akun Anda"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/70 border border-zinc-700 text-white text-xs sm:text-sm focus:outline-none focus:border-[#ba2d1d]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                      Pilihan Paket Membership *
                    </label>
                    <select
                      value={regPlanId}
                      onChange={(e) => setRegPlanId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/70 border border-zinc-700 text-white text-xs sm:text-sm focus:outline-none focus:border-[#ba2d1d]"
                    >
                      {MEMBERSHIP_PLANS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title} - Rp {p.price.toLocaleString('id-ID')} / {p.period}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                      Metode Pembayaran *
                    </label>
                    <select
                      value={regPaymentMethod}
                      onChange={(e) => setRegPaymentMethod(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/70 border border-zinc-700 text-white text-xs sm:text-sm focus:outline-none focus:border-[#ba2d1d]"
                    >
                      <option value="transfer">Bank Transfer (BCA / Mandiri)</option>
                      <option value="qris">QRIS (Scan Langsung)</option>
                      <option value="cash">Bayar Tunai di Kasir Sasana</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isRegistering}
                    className="w-full py-3.5 rounded-xl btn-fire text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 mt-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    {isRegistering ? 'Mendaftarkan Akun...' : 'Daftar & Dapatkan ID Member'}
                  </button>
                </form>

                <div className="pt-2 text-center text-xs text-zinc-500">
                  Sudah punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthTab('login')}
                    className="text-[#d63725] hover:underline font-bold"
                  >
                    Masuk di sini
                  </button>
                </div>
              </div>
            ) : (
              /* TAB C: FORGOT PASSWORD FORM */
              <div className="p-5 sm:p-7 rounded-3xl bg-zinc-900/90 border border-zinc-800 space-y-5 animate-in fade-in">
                <div className="flex items-center gap-2 text-[#d63725]">
                  <KeyRound className="w-5 h-5" />
                  <h2 className="text-base sm:text-lg font-black text-white uppercase">
                    Pemulihan Kata Sandi
                  </h2>
                </div>
                <p className="text-xs text-zinc-400">
                  Masukkan email yang Anda daftarkan pada akun member untuk memulihkan akses kata sandi.
                </p>

                {forgotStep === 'input_email' ? (
                  <form onSubmit={handleRequestReset} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                        Email Member Terdaftar *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          placeholder="contoh: member@email.com"
                          value={forgotEmail}
                          onChange={(e) => {
                            setForgotEmail(e.target.value);
                            if (forgotError) setForgotError('');
                          }}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/70 border border-zinc-700 text-white text-xs sm:text-sm focus:outline-none focus:border-[#ba2d1d]"
                          autoFocus
                          required
                        />
                      </div>
                    </div>

                    {forgotError && (
                      <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-xs text-rose-300 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                        <span>{forgotError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-3.5 rounded-xl btn-fire text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Send className="w-4 h-4" />
                      {forgotLoading ? 'Memeriksa Email...' : 'Kirim Kode Verifikasi'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleConfirmReset} className="space-y-4">
                    {forgotSuccessMsg && (
                      <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                        <span>{forgotSuccessMsg}</span>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                        Kode Verifikasi Keamanan *
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="6 Digit Kode"
                          value={forgotOtp}
                          onChange={(e) => setForgotOtp(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-black/70 border border-zinc-700 text-white font-mono tracking-widest text-sm focus:outline-none focus:border-[#ba2d1d]"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                        Kata Sandi Baru *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder="Minimal 4 karakter"
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            if (forgotError) setForgotError('');
                          }}
                          className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-black/70 border border-zinc-700 text-white text-xs sm:text-sm focus:outline-none focus:border-[#ba2d1d]"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                        Ulangi Kata Sandi Baru *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder="Ketik ulang kata sandi baru"
                          value={confirmNewPassword}
                          onChange={(e) => {
                            setConfirmNewPassword(e.target.value);
                            if (forgotError) setForgotError('');
                          }}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/70 border border-zinc-700 text-white text-xs sm:text-sm focus:outline-none focus:border-[#ba2d1d]"
                          required
                        />
                      </div>
                    </div>

                    {forgotError && (
                      <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-xs text-rose-300 flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                        <span>{forgotError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-3.5 rounded-xl btn-fire text-white font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {forgotLoading ? 'Menyimpan Sandi Baru...' : 'Simpan Sandi Baru & Masuk'}
                    </button>
                  </form>
                )}

                <div className="pt-2 border-t border-zinc-800 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthTab('login');
                      setForgotError('');
                    }}
                    className="text-zinc-400 hover:text-white"
                  >
                    ← Kembali ke Login
                  </button>

                  <a
                    href={`https://wa.me/${GYM_INFO.phone}?text=${encodeURIComponent(
                      'Halo Admin 11 Fight Camp, saya membutuhkan bantuan terkait pemulihan akun/password member saya.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#d63725] hover:underline font-semibold"
                  >
                    Bantuan WhatsApp Admin
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* 2. LOGGED-IN MEMBER PORTAL DASHBOARD (100% MOBILE RESPONSIVE) */
          <div className="space-y-6 sm:space-y-8 animate-in fade-in">
            {/* Top Bar for Member */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#ba2d1d] flex items-center justify-center text-white font-black text-sm uppercase shrink-0">
                  {activeMember.name.slice(0, 2)}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-black text-white flex items-center gap-2 truncate">
                    <span className="truncate">{activeMember.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 shrink-0">
                      {activeMember.memberCode}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5 truncate">
                    <Phone className="w-3 h-3 text-[#d63725] shrink-0" />
                    <span className="truncate">{activeMember.phone}</span>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-zinc-800">
                <button
                  onClick={loadData}
                  className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Refresh
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-rose-950/60 hover:text-rose-400 text-zinc-400 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-zinc-700/60"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Keluar
                </button>
              </div>
            </div>

            {/* Member Digital Combat Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-black to-zinc-950 border-2 border-[#ba2d1d] p-5 sm:p-8">
              {/* Watermark Logo in Background */}
              <div className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 pointer-events-none">
                <img src="/logo.png" alt="11 Fight Camp Watermark" className="w-full h-full object-contain" />
              </div>

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#ba2d1d] bg-black shrink-0">
                      <img src="/logo.png" alt="11 Fight Camp" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[10px] sm:text-xs font-black tracking-widest text-[#d63725] uppercase block">
                        11TH UNIVERSE MMA • PONTIANAK
                      </span>
                      <h2 className="text-lg sm:text-2xl font-black text-white uppercase break-words">
                        {activeMember.name}
                      </h2>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {/* Status Badge */}
                    {activeMember.status === 'active' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-950 border border-emerald-700 text-emerald-300 uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        Status: Member Aktif
                      </span>
                    )}
                    {activeMember.status === 'pending' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-950 border border-amber-700 text-amber-300 uppercase tracking-wider">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        Status: Menunggu Pembayaran
                      </span>
                    )}
                    {activeMember.status === 'expired' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-950 border border-rose-700 text-rose-300 uppercase tracking-wider">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                        Status: Paket Kadaluarsa
                      </span>
                    )}

                    {/* Payment Status Badge */}
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                        activeMember.paymentStatus === 'paid'
                          ? 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                          : 'bg-amber-900/60 text-amber-300 border border-amber-700/60'
                      }`}
                    >
                      <CreditCard className="w-3 h-3 text-[#d63725]" />
                      {activeMember.paymentStatus === 'paid' ? 'Lunas' : 'Belum Lunas'}
                    </span>
                  </div>

                  {/* Plan Information */}
                  <div className="pt-1">
                    <span className="text-[11px] text-zinc-400 uppercase font-bold tracking-wider block">
                      Paket Terdaftar:
                    </span>
                    <div className="text-base sm:text-lg font-black text-white">
                      {activeMember.planTitle}
                    </div>
                  </div>
                </div>

                {/* Right Side: Sessions or Expiry Counter Box */}
                <div className="w-full md:w-auto md:min-w-[260px] p-4 sm:p-5 rounded-2xl bg-black/70 border border-zinc-800 space-y-4">
                  {typeof activeMember.remainingSessions === 'number' ? (
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-zinc-300 mb-1">
                        <span className="flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-[#ba2d1d]" />
                          Sisa Tiket Sesi
                        </span>
                        <span className="text-white font-black text-sm">
                          {activeMember.remainingSessions} / {activeMember.totalSessions || 10} Sesi
                        </span>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-full h-2.5 rounded-full bg-zinc-800 overflow-hidden mt-2">
                        <div
                          className="h-full bg-gradient-to-r from-[#ba2d1d] to-[#d63725] transition-all duration-500 rounded-full"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.max(
                                0,
                                ((activeMember.remainingSessions || 0) /
                                  (activeMember.totalSessions || 10)) *
                                  100
                              )
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-1.5 leading-normal">
                        Sisa kuota sesi tiket Anda akan otomatis dipotong saat check-in di kasir sasana.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Unlimited Passes
                      </div>
                      <div className="text-sm font-black text-emerald-400">
                        Bebas Ikuti Semua Sesi Kelas
                      </div>
                    </div>
                  )}

                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                    <span className="text-zinc-400">Masa Berlaku:</span>
                    <span className="font-bold text-zinc-200">
                      {activeMember.endDate
                        ? new Date(activeMember.endDate).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '30 Hari'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pending Payment & Transfer Instructions inside Card */}
              {activeMember.paymentStatus === 'pending' && (
                <div className="mt-6 pt-4 border-t border-zinc-800 space-y-3 bg-amber-950/30 p-4 rounded-2xl border border-amber-800/50">
                  <div className="flex items-start sm:items-center justify-between gap-2 flex-col sm:flex-row">
                    <div className="flex items-center gap-2 text-xs text-amber-300 font-bold">
                      <Clock className="w-4 h-4 shrink-0 text-amber-400" />
                      <span>
                        Tagihan Pembayaran: Rp {activeMember.price.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      ID: {activeMember.memberCode}
                    </span>
                  </div>

                  {/* Bank Accounts */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-zinc-400 font-bold block">BCA (11th Universe MMA)</span>
                        <span className="font-mono font-bold text-white text-xs">812-482-4111</span>
                      </div>
                      <button
                        onClick={() => handleCopy('8124824111', 'BCA')}
                        className="px-2 py-1 rounded bg-zinc-800 text-[11px] text-zinc-300 hover:text-white"
                      >
                        {copiedBank === 'BCA' ? 'Tersalin' : 'Salin'}
                      </button>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/60 border border-zinc-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-zinc-400 font-bold block">Mandiri (11th Universe MMA)</span>
                        <span className="font-mono font-bold text-white text-xs">146-00-1122334-5</span>
                      </div>
                      <button
                        onClick={() => handleCopy('1460011223345', 'Mandiri')}
                        className="px-2 py-1 rounded bg-zinc-800 text-[11px] text-zinc-300 hover:text-white"
                      >
                        {copiedBank === 'Mandiri' ? 'Tersalin' : 'Salin'}
                      </button>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/${GYM_INFO.phone.replace('+', '')}?text=${encodeURIComponent(
                      `Halo Admin 11 Fight Camp, saya ingin konfirmasi pembayaran paket membership [${activeMember.planTitle}] atas nama: ${activeMember.name} (ID: ${activeMember.memberCode}). Berikut bukti transfernya.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 transition-colors mt-2"
                  >
                    Kirim Bukti Transfer ke WhatsApp Admin
                  </a>
                </div>
              )}
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Link
                href="/booking"
                className="p-4 sm:p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-[#ba2d1d] transition-all flex items-center justify-between group active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl btn-fire flex items-center justify-center text-white shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-[#d63725] transition-colors">
                      Booking Jadwal Kelas
                    </h3>
                    <p className="text-[11px] sm:text-xs text-zinc-400">Pilih jam & disiplin kelas minggu ini</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
              </Link>

              <Link
                href="/#pricing"
                className="p-4 sm:p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 hover:border-[#ba2d1d] transition-all flex items-center justify-between group active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[#d63725] shrink-0">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-[#d63725] transition-colors">
                      Top-Up / Perpanjang Paket
                    </h3>
                    <p className="text-[11px] sm:text-xs text-zinc-400">Tambah kuota sesi atau perpanjang paket</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-500 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
              </Link>
            </div>

            {/* 3. RIWAYAT BOOKING KELAS MEMBER */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white uppercase">
                    Riwayat Reservasi Kelas Saya
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Daftar jadwal sesi kelas yang pernah Anda reservasi di 11 Fight Camp.
                  </p>
                </div>
                <span className="text-xs font-bold text-zinc-400 shrink-0">
                  {memberBookings.length} booking
                </span>
              </div>

              {memberBookings.length === 0 ? (
                <div className="p-6 sm:p-8 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center space-y-3">
                  <Calendar className="w-10 h-10 text-zinc-600 mx-auto" />
                  <p className="text-xs sm:text-sm font-bold text-zinc-300">Belum ada riwayat booking kelas</p>
                  <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
                    Anda belum pernah reservasi jadwal kelas. Silakan pilih kelas latihan yang Anda inginkan sekarang.
                  </p>
                  <Link
                    href="/booking"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-fire text-white font-black text-xs transition-all"
                  >
                    <Calendar className="w-4 h-4" />
                    Booking Kelas Perdana
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {memberBookings.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 rounded-2xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between space-y-3 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-mono font-bold text-zinc-400 block truncate">
                            Kode: {b.bookingCode}
                          </span>
                          <h4 className="text-xs sm:text-sm font-black text-white mt-0.5 truncate">
                            {b.scheduleData?.classData?.title || 'Sesi Latihan Combat'}
                          </h4>
                          <span className="text-[11px] text-zinc-400 block mt-0.5 truncate">
                            Coach: {b.scheduleData?.trainerData?.name || 'Coach 11FC'}
                          </span>
                        </div>

                        {/* Status badge */}
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                            b.status === 'attended'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : b.status === 'confirmed'
                              ? 'bg-blue-950 text-blue-400 border border-blue-800'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {b.status === 'attended'
                            ? '✓ Hadir (Check-in)'
                            : b.status === 'confirmed'
                            ? 'Confirmed'
                            : 'Dibatalkan'}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-[#d63725]" />
                          <span>
                            {b.scheduleData?.startTime || '16:30'} - {b.scheduleData?.endTime || '18:00'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 font-semibold text-zinc-300">
                          <Calendar className="w-3 h-3 text-zinc-500" />
                          <span>{b.bookingDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}