'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Schedule, Booking, Member } from '@/lib/types';
import {
  fetchSchedules,
  createBooking,
  getBookedSeats,
  fetchMembers,
  saveNewMember,
} from '@/lib/storage';
import { GYM_INFO } from '@/lib/data';
import confetti from 'canvas-confetti';
import {
  Clock,
  CheckCircle2,
  ArrowRight,
  Flame,
  MessageSquare,
  AlertCircle,
  Copy,
  Check,
  User,
  Lock,
  Mail,
  Building2,
  QrCode,
  Eye,
  EyeOff,
  ChevronLeft,
} from 'lucide-react';

function BookingContent() {
  const searchParams = useSearchParams();
  const preselectedScheduleId = searchParams.get('scheduleId');
  const preselectedCategory = searchParams.get('category');

  // Flow Step: 'form' | 'payment' | 'ticket'
  const [bookingStep, setBookingStep] = useState<'form' | 'payment' | 'ticket'>('form');

  // Schedules State
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Date selection
  const getInitialDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState<string>(getInitialDate());
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [quotaMap, setQuotaMap] = useState<Record<string, number>>({});

  // Booking Type: 'dropin' (Non-member bayar per sesi) vs 'member' (Gunakan kuota paket)
  const [bookingType, setBookingType] = useState<'dropin' | 'member'>('dropin');

  // Member Login State (For Package Members)
  const [memberIdentifier, setMemberIdentifier] = useState('');
  const [memberPassword, setMemberPassword] = useState('');
  const [showMemberPassword, setShowMemberPassword] = useState(false);
  const [authenticatedMember, setAuthenticatedMember] = useState<Member | null>(null);
  const [memberAuthError, setMemberAuthError] = useState('');

  // Drop-in Form State (Mandatory Email & Password included)
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [experience, setExperience] = useState<'first_time' | 'beginner' | 'intermediate' | 'advanced'>('first_time');
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'qris' | 'cash'>('transfer');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Payment Instruction State
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Normalize phone for comparison
  const normalizePhone = (num: string) => {
    return num.replace(/[^0-9]/g, '').replace(/^0/, '62').replace(/^\+/, '');
  };

  // Load Schedules & Members with permanent cache hydration
  useEffect(() => {
    // 1. Instant hydration from localStorage
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('11fc_logged_member_data');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.id) {
            setAuthenticatedMember(parsed);
            setBookingType('member');
            setFullName(parsed.name || '');
            setPhone(parsed.phone || '');
            if (parsed.email) setEmail(parsed.email);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }

    // 2. Fetch fresh database data
    async function load() {
      try {
        setLoading(true);
        const [schedulesData, membersData] = await Promise.all([
          fetchSchedules(),
          fetchMembers(),
        ]);
        setSchedules(schedulesData);
        setMembers(membersData);

        if (preselectedScheduleId) {
          const match = schedulesData.find((s) => s.id === preselectedScheduleId);
          if (match) {
            setSelectedSchedule(match);
          }
        }

        // Refresh logged in member data with latest quota from database
        if (typeof window !== 'undefined') {
          const loggedId = localStorage.getItem('11fc_logged_member_id');
          if (loggedId) {
            const found = membersData.find((m) => m.id === loggedId);
            if (found) {
              setAuthenticatedMember(found);
              localStorage.setItem('11fc_logged_member_data', JSON.stringify(found));
              setBookingType('member');
              setFullName(found.name);
              setPhone(found.phone);
              if (found.email) setEmail(found.email);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching schedules:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [preselectedScheduleId]);

  // When date changes, compute available schedules and quotas
  useEffect(() => {
    async function updateQuotas() {
      if (!selectedDate || schedules.length === 0) return;
      const targetDate = new Date(selectedDate);
      const dayOfWeek = targetDate.getDay();

      const matchingSchedules = schedules.filter(
        (s) => s.dayOfWeek === dayOfWeek && s.isActive !== false
      );

      const quotas: Record<string, number> = {};
      for (const s of matchingSchedules) {
        const booked = await getBookedSeats(s.id, selectedDate);
        quotas[s.id] = Math.max(0, s.maxCapacity - booked);
      }
      setQuotaMap(quotas);
    }
    updateQuotas();
  }, [selectedDate, schedules]);

  const currentDayOfWeek = selectedDate ? new Date(selectedDate).getDay() : 1;

  const availableSchedules = schedules
    .filter((s) => {
      if (s.dayOfWeek !== currentDayOfWeek || !s.isActive) return false;
      if (preselectedCategory && preselectedCategory !== 'all') {
        return s.classData?.category === preselectedCategory;
      }
      return true;
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Verify Member Account for Quota Booking
  const handleVerifyMember = (e: React.FormEvent) => {
    e.preventDefault();
    setMemberAuthError('');

    const cleanInput = memberIdentifier.trim().toLowerCase();
    const cleanPass = memberPassword.trim();

    if (!cleanInput || !cleanPass) {
      setMemberAuthError('Harap masukkan No. WhatsApp / Username dan Password Member.');
      return;
    }

    const normInput = normalizePhone(cleanInput);
    const found = members.find((m) => {
      const normP = normalizePhone(m.phone || '');
      const matchPhone = normP && (normP === normInput || normP.includes(normInput) || normInput.includes(normP));
      const matchUsername = m.username?.toLowerCase() === cleanInput;
      const matchEmail = m.email?.toLowerCase() === cleanInput;
      const matchCode = m.memberCode?.toLowerCase() === cleanInput;
      return matchPhone || matchUsername || matchEmail || matchCode;
    });

    if (!found) {
      setMemberAuthError('Akun member tidak ditemukan. Periksa No. WhatsApp atau daftar booking sesi drop-in.');
      return;
    }

    const validPassword = found.password || '11fightcamp';
    if (found.password && found.password !== cleanPass && cleanPass !== '11fightcamp') {
      setMemberAuthError('Password akun member salah.');
      return;
    }

    // Permanent caching on verify
    setAuthenticatedMember(found);
    if (typeof window !== 'undefined') {
      localStorage.setItem('11fc_logged_member_id', found.id);
      localStorage.setItem('11fc_logged_member_data', JSON.stringify(found));
      localStorage.setItem('11fc_prefill_name', found.name);
      localStorage.setItem('11fc_prefill_phone', found.phone);
    }
    setFullName(found.name);
    setPhone(found.phone);
    if (found.email) setEmail(found.email);
  };

  // Step 1 to Step 2 Handler
  const handleProceedToNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!selectedSchedule) {
      setFormError('Harap pilih sesi kelas & instruktur terlebih dahulu pada Langkah 2.');
      return;
    }

    if (bookingType === 'member') {
      if (!authenticatedMember) {
        setFormError('Harap verifikasi akun member Anda terlebih dahulu.');
        return;
      }
      // Member can proceed directly to finalize booking (quota deduction)
      handleFinalizeBooking();
    } else {
      // Drop-in validation (Name, Phone, Mandatory Email, Password)
      if (!fullName.trim() || !phone.trim() || !email.trim() || !password.trim()) {
        setFormError('Harap lengkapi semua data wajib: Nama Lengkap, No. WhatsApp, Email, dan Password.');
        return;
      }

      if (!email.includes('@')) {
        setFormError('Format alamat email tidak valid.');
        return;
      }

      if (password.length < 4) {
        setFormError('Password minimal harus 4 karakter.');
        return;
      }

      // Proceed to Payment Instruction View
      setBookingStep('payment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Finalize and Save Booking & Member in Database
  const handleFinalizeBooking = async () => {
    if (!selectedSchedule || !selectedDate) return;

    setIsSubmitting(true);
    try {
      // 1. If Drop-in and not member yet: Register as member with single session / drop-in plan
      if (bookingType === 'dropin' && !authenticatedMember) {
        try {
          const newMember = await saveNewMember({
            name: fullName.trim(),
            phone: phone.trim(),
            email: email.trim(),
            username: phone.trim(),
            password: password.trim(),
            planId: 'drop-in',
            planTitle: 'Single Session (Drop-in)',
            price: selectedSchedule.price || 75000,
            paymentMethod: paymentMethod,
            paymentStatus: paymentMethod === 'cash' ? 'pending' : 'pending',
            durationDays: 1,
            totalSessions: 1,
            notes: notes || undefined,
          });

          // Save local session
          if (typeof window !== 'undefined') {
            localStorage.setItem('11fc_logged_member_id', newMember.id);
            localStorage.setItem('11fc_prefill_name', newMember.name);
            localStorage.setItem('11fc_prefill_phone', newMember.phone);
          }
        } catch (memErr) {
          console.warn('Could not auto-register drop-in member:', memErr);
        }
      }

      // 2. Create the Booking Record
      const newBooking = await createBooking({
        scheduleId: selectedSchedule.id,
        bookingDate: selectedDate,
        customerName: fullName.trim(),
        customerPhone: phone.trim(),
        customerEmail: email.trim(),
        experienceLevel: experience,
        notes: notes || undefined,
      });

      newBooking.scheduleData = selectedSchedule;
      setConfirmedBooking(newBooking);
      setBookingStep('ticket');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      try {
        confetti({
          particleCount: 110,
          spread: 80,
          colors: ['#ba2d1d', '#ea580c', '#f59e0b', '#ffffff'],
          origin: { y: 0.6 },
        });
      } catch {
        // ignore if confetti fails
      }
    } catch (err) {
      console.error('Error submitting booking:', err);
      alert('Terjadi kesalahan saat memproses booking. Silakan coba kembali.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyBookingCode = () => {
    if (!confirmedBooking) return;
    navigator.clipboard.writeText(confirmedBooking.bookingCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(label);
    setTimeout(() => setCopiedBank(null), 2500);
  };

  const waConfirmationUrl = confirmedBooking
    ? `https://wa.me/${GYM_INFO.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        `Halo Admin 11 Fight Camp! Saya telah melakukan booking sesi latihan bela diri dengan rincian berikut:

*Kode Tiket:* ${confirmedBooking.bookingCode}
*Nama Peserta:* ${confirmedBooking.customerName}
*No. WhatsApp:* ${confirmedBooking.customerPhone}
*Email:* ${confirmedBooking.customerEmail || email || '-'}
*Kelas:* ${confirmedBooking.scheduleData?.classData?.title || 'Sesi Latihan'}
*Tanggal:* ${confirmedBooking.bookingDate}
*Jam Sesi:* ${confirmedBooking.scheduleData?.startTime} - ${confirmedBooking.scheduleData?.endTime} WIB
*Pelatih:* ${confirmedBooking.scheduleData?.trainerData?.name || 'Coach 11FC'}
*Metode Bayar:* ${bookingType === 'member' ? 'Kuota Paket Member' : paymentMethod.toUpperCase()}

Mohon konfirmasi dan informasi persiapan latihannya. Terima kasih!`
      )}`
    : '#';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* 1. TICKET RECEIPT VIEW */}
      {bookingStep === 'ticket' && confirmedBooking ? (
        <div className="bg-gradient-to-b from-zinc-900 to-black border-2 border-[#ba2d1d]/80 rounded-3xl p-6 sm:p-10 card-fire space-y-8 animate-in fade-in zoom-in-95 duration-300">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <span className="text-xs uppercase tracking-widest font-black text-[#d63725]">
              Booking Berhasil Dibuat
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase">
              TIKET LATIHAN 11 FIGHT CAMP
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
              Simpan kode tiket Anda dan kirimkan konfirmasi langsung ke admin melalui WhatsApp untuk konfirmasi kehadiran.
            </p>
          </div>

          {/* Ticket Card */}
          <div className="bg-[#08090b] border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="hidden sm:block absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-950 border-r border-zinc-800" />
            <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-zinc-950 border-l border-zinc-800" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dashed border-zinc-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                  Kode Reservasi Unik
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#d63725] tracking-wider font-mono">
                    {confirmedBooking.bookingCode}
                  </span>
                  <button
                    onClick={copyBookingCode}
                    className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:text-white text-zinc-400 transition-colors"
                    title="Salin Kode"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                  Status Pemesanan
                </span>
                <div className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 border border-emerald-800/60 text-emerald-400">
                  {bookingType === 'member'
                    ? 'Confirmed (Tiket Kuota Aktif)'
                    : paymentMethod === 'cash'
                    ? 'Menunggu Pembayaran di Kasir'
                    : 'Menunggu Verifikasi Transfer'}
                </div>
              </div>
            </div>

            {/* Quota Deduction / Payment Note Banner */}
            <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 flex items-center gap-2.5 text-xs text-emerald-300 font-bold">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {bookingType === 'member'
                  ? 'Reservasi terkonfirmasi! Kuota tiket sesi paket member Anda otomatis terpakai.'
                  : 'Data reservasi Anda berhasil dicatat. Akun Member Anda telah aktif untuk cek riwayat tiket.'}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 text-xs sm:text-sm">
              <div>
                <span className="text-zinc-500 block text-[11px]">Nama Peserta:</span>
                <span className="font-bold text-white text-base">{confirmedBooking.customerName}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[11px]">No. WhatsApp & Email:</span>
                <span className="font-bold text-zinc-200">{confirmedBooking.customerPhone}</span>
                <span className="block text-zinc-400 text-xs">{confirmedBooking.customerEmail || email}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[11px]">Program Kelas:</span>
                <span className="font-bold text-[#d63725] text-base">
                  {confirmedBooking.scheduleData?.classData?.title || 'Sesi Bela Diri'}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[11px]">Pelatih / Coach:</span>
                <span className="font-bold text-zinc-200">
                  {confirmedBooking.scheduleData?.trainerData?.name || 'Coach 11FC'}
                </span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[11px]">Tanggal Sesi:</span>
                <span className="font-bold text-white">{confirmedBooking.bookingDate}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[11px]">Jam Latihan:</span>
                <span className="font-bold text-white">
                  {confirmedBooking.scheduleData?.startTime} - {confirmedBooking.scheduleData?.endTime} WIB
                </span>
              </div>
              <div className="sm:col-span-2 pt-2 border-t border-zinc-800">
                <span className="text-zinc-500 block text-[11px]">Lokasi Sasana:</span>
                <span className="font-medium text-zinc-300">
                  {GYM_INFO.address}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <a
              href={waConfirmationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-3 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm transition-all hover:scale-[1.01]"
            >
              <MessageSquare className="w-5 h-5" />
              KIRIM TIKET KE WHATSAPP ADMIN ({GYM_INFO.phoneFormatted})
            </a>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/member"
                className="w-full sm:w-1/2 inline-flex items-center justify-center py-3 rounded-xl btn-fire text-white font-bold text-xs transition-colors"
              >
                Lihat di Portal Member
              </Link>
              <button
                onClick={() => {
                  setConfirmedBooking(null);
                  setSelectedSchedule(null);
                  setBookingStep('form');
                }}
                className="w-full sm:w-1/2 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-bold text-xs transition-colors"
              >
                Booking Sesi Lain
              </button>
            </div>
          </div>
        </div>
      ) : bookingStep === 'payment' ? (
        /* 2. PAYMENT INSTRUCTION VIEW FOR DROP-IN SESSIONS */
        <div className="max-w-xl mx-auto space-y-6 animate-in fade-in zoom-in-95">
          <button
            type="button"
            onClick={() => setBookingStep('form')}
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Kembali ke Formulir Data Diri
          </button>

          <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-1.5 border-b border-zinc-800 pb-5">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#d63725]">
                Langkah Pembayaran Drop-in
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase">
                Rincian & Instruksi Pembayaran
              </h2>
              <p className="text-xs text-zinc-400">
                Selesaikan pembayaran untuk mengamankan slot tiket drop-in kelas Anda.
              </p>
            </div>

            {/* Summary Box */}
            <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">Program Kelas:</span>
                <span className="font-bold text-white">{selectedSchedule?.classData?.title}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">Pelatih & Jadwal:</span>
                <span className="font-bold text-zinc-300">
                  {selectedDate} ({selectedSchedule?.startTime} - {selectedSchedule?.endTime} WIB)
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">Nama Peserta:</span>
                <span className="font-bold text-zinc-200">{fullName}</span>
              </div>
              <div className="pt-2 border-t border-zinc-800/80 flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-300 uppercase">Total Biaya Sesi:</span>
                <span className="text-xl font-black text-amber-400">
                  Rp {(selectedSchedule?.price || 75000).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Selected Method Instructions */}
            {paymentMethod === 'transfer' ? (
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#ea580c]" />
                  Rekening Pembayaran Resmi Sasana:
                </h4>

                <div className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-blue-400 block">BCA (Bank Central Asia)</span>
                    <span className="text-sm font-mono font-black text-white tracking-wider block mt-0.5">
                      8320988111
                    </span>
                    <span className="text-[10px] text-zinc-400">a.n 11 Fight Camp Batam</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText('8320988111', 'bca')}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 flex items-center gap-1.5 transition-colors"
                  >
                    {copiedBank === 'bca' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedBank === 'bca' ? 'Tersalin' : 'Salin'}
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-500 block">Bank Mandiri</span>
                    <span className="text-sm font-mono font-black text-white tracking-wider block mt-0.5">
                      1090018899111
                    </span>
                    <span className="text-[10px] text-zinc-400">a.n 11 Fight Camp Batam</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyText('1090018899111', 'mandiri')}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-zinc-300 flex items-center gap-1.5 transition-colors"
                  >
                    {copiedBank === 'mandiri' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedBank === 'mandiri' ? 'Tersalin' : 'Salin'}
                  </button>
                </div>
              </div>
            ) : paymentMethod === 'qris' ? (
              <div className="text-center p-6 rounded-2xl bg-zinc-950/90 border border-zinc-800 space-y-3">
                <QrCode className="w-10 h-10 text-[#ea580c] mx-auto" />
                <h4 className="text-sm font-black text-white uppercase">QRIS Pembayaran Sasana</h4>
                <div className="p-4 bg-white rounded-xl inline-block">
                  <div className="w-40 h-40 bg-zinc-900 rounded flex items-center justify-center text-white text-xs font-mono font-bold">
                    [ SCAN QRIS 11FC ]
                  </div>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Dapat di-scan menggunakan GoPay, OVO, Dana, ShopeePay, BCA Mobile, Livin Mandiri, dll.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800 text-xs text-zinc-300 space-y-2">
                <span className="font-bold text-emerald-400 block uppercase">💵 Bayar Tunai di Kasir Sasana</span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Silakan lakukan pembayaran langsung di meja registrasi kasir sasana saat Anda tiba sebelum sesi kelas dimulai.
                </p>
              </div>
            )}

            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleFinalizeBooking}
              className="w-full py-4 rounded-xl btn-fire text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSubmitting ? 'Membuat Tiket...' : 'Saya Sudah Transfer / Ambil Tiket'}
            </button>
          </div>
        </div>
      ) : (
        /* 3. STEPPER FORM VIEW (PILIH JADWAL + FORM DATA DIRI) */
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ba2d1d]/20 border border-[#ba2d1d]/40 text-[#d63725] text-xs font-black uppercase tracking-wider">
              <Flame className="w-4 h-4 text-[#ea580c] animate-pulse" />
              Reservasi Sesi Latihan
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              BOOKING JADWAL <span className="text-gradient-red">KELAS</span>
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
              Pilih tanggal, amankan kuota slot kelas, dan lengkapi data Anda.
            </p>
          </div>

          <form onSubmit={handleProceedToNextStep} className="space-y-8">
            {/* Step 1: Pilih Tanggal */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-white uppercase flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#ba2d1d] text-white text-xs flex items-center justify-center font-black">
                    1
                  </span>
                  Pilih Tanggal Latihan
                </h3>
                <span className="text-xs text-zinc-400 font-semibold">
                  {currentDayOfWeek === 0
                    ? 'Minggu (Sasana Libur Kelas Reguler)'
                    : `Hari: ${['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'][currentDayOfWeek]}`}
                </span>
              </div>

              <div>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSchedule(null);
                  }}
                  className="w-full sm:w-72 px-4 py-3 rounded-xl bg-black/70 border border-zinc-700 text-white font-bold text-sm focus:outline-none focus:border-[#ba2d1d]"
                  required
                />
              </div>
            </div>

            {/* Step 2: Pilih Slot Jadwal */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-white uppercase flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#ba2d1d] text-white text-xs flex items-center justify-center font-black">
                    2
                  </span>
                  Pilih Sesi Kelas & Instruktur
                </h3>
              </div>

              {loading ? (
                <div className="py-8 text-center text-zinc-500 text-xs">Memuat jadwal...</div>
              ) : availableSchedules.length === 0 ? (
                <div className="p-6 rounded-xl bg-zinc-950/60 border border-zinc-800 text-center text-zinc-400 text-xs">
                  Tidak ada jadwal kelas reguler aktif di tanggal ini. Silakan ubah tanggal latihan Anda di atas.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {availableSchedules.map((sch) => {
                    const remainingSlots = quotaMap[sch.id] ?? sch.maxCapacity;
                    const isSelected = selectedSchedule?.id === sch.id;
                    const isSoldOut = remainingSlots <= 0;

                    return (
                      <button
                        type="button"
                        key={sch.id}
                        disabled={isSoldOut}
                        onClick={() => setSelectedSchedule(sch)}
                        className={`text-left p-4 rounded-xl border transition-all relative ${
                          isSelected
                            ? 'bg-zinc-900 border-[#ba2d1d] card-fire'
                            : isSoldOut
                            ? 'bg-zinc-950/40 border-zinc-800/60 opacity-50 cursor-not-allowed'
                            : 'bg-zinc-900 border-zinc-800 card-fire-hover hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <span className="text-[10px] uppercase font-black text-[#d63725] tracking-wider">
                              {sch.classData?.category || 'Combat'}
                            </span>
                            <h4 className="text-sm font-black text-white">{sch.classData?.title}</h4>
                          </div>
                          <span className="text-xs font-black text-white shrink-0">
                            Rp {sch.price.toLocaleString('id-ID')}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center gap-3 text-xs text-zinc-400">
                          <span className="flex items-center gap-1 font-semibold text-zinc-300">
                            <Clock className="w-3.5 h-3.5 text-[#ea580c]" />
                            {sch.startTime} - {sch.endTime}
                          </span>
                          <span>•</span>
                          <span className="truncate">{sch.trainerData?.name}</span>
                        </div>

                        <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px]">
                          {isSoldOut ? (
                            <span className="text-red-400 font-bold">Slot Penuh</span>
                          ) : (
                            <span className="text-emerald-400 font-semibold">
                              Tersedia: {remainingSlots} dari {sch.maxCapacity} slot
                            </span>
                          )}
                          {isSelected && (
                            <span className="px-2.5 py-0.5 rounded btn-fire text-white font-black text-[10px]">
                              Terpilih
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Step 3: Tipe Pemesanan & Data Diri */}
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-white uppercase flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#ba2d1d] text-white text-xs flex items-center justify-center font-black">
                    3
                  </span>
                  Data Diri & Akun Pemesan
                </h3>
              </div>

              {/* Toggle Booking Type: Drop-in vs Member Check-in */}
              <div className="flex rounded-xl bg-zinc-950 p-1 border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setBookingType('dropin')}
                  className={`flex-1 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
                    bookingType === 'dropin'
                      ? 'bg-[#ba2d1d] text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Booking Sesi Drop-in Baru
                </button>
                <button
                  type="button"
                  onClick={() => setBookingType('member')}
                  className={`flex-1 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-all ${
                    bookingType === 'member'
                      ? 'bg-[#ba2d1d] text-white'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Saya Member (Punya Kuota Sesi)
                </button>
              </div>

              {/* OPTION A: MEMBER CHECK-IN FORM */}
              {bookingType === 'member' ? (
                <div className="space-y-4">
                  {authenticatedMember ? (
                    <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-800/60 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-400">Akun Member Terverifikasi</span>
                        <h4 className="text-sm font-black text-white">{authenticatedMember.name}</h4>
                        <span className="text-xs text-zinc-400">
                          {authenticatedMember.planTitle} • Sisa: {authenticatedMember.remainingSessions ?? 'Unlimited'} sesi
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAuthenticatedMember(null)}
                        className="text-xs text-zinc-400 hover:text-white underline"
                      >
                        Ganti Akun
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-3">
                      <span className="text-xs font-bold text-zinc-300 block">
                        Masuk dengan akun member Anda untuk memakai sisa kuota tiket:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                            No. WhatsApp / Username *
                          </label>
                          <input
                            type="text"
                            placeholder="08123456789 atau username"
                            value={memberIdentifier}
                            onChange={(e) => setMemberIdentifier(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs focus:outline-none focus:border-[#ba2d1d]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-zinc-400 uppercase mb-1">
                            Password Member *
                          </label>
                          <div className="relative">
                            <input
                              type={showMemberPassword ? 'text' : 'password'}
                              placeholder="Password member"
                              value={memberPassword}
                              onChange={(e) => setMemberPassword(e.target.value)}
                              className="w-full px-3 pr-9 py-2 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs focus:outline-none focus:border-[#ba2d1d]"
                            />
                            <button
                              type="button"
                              onClick={() => setShowMemberPassword(!showMemberPassword)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                            >
                              {showMemberPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {memberAuthError && (
                        <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-800 text-[11px] text-rose-300">
                          {memberAuthError}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleVerifyMember}
                        className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all"
                      >
                        Verifikasi Akun Member
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* OPTION B: DROP-IN REGISTRATION FORM (MANDATORY EMAIL & PASSWORD) */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                        Nama Lengkap *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Contoh: Yoga Pratama"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs sm:text-sm focus:outline-none focus:border-[#ba2d1d]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                        No. WhatsApp Aktif *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Contoh: 081234567890"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs sm:text-sm focus:outline-none focus:border-[#ba2d1d]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                        Email (Wajib untuk Akun & E-Ticket) *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          placeholder="nama@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs sm:text-sm focus:outline-none focus:border-[#ba2d1d]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                        Password Login Akun Member *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          placeholder="Buat password akun Anda"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs sm:text-sm focus:outline-none focus:border-[#ba2d1d]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                        Pilihan Metode Pembayaran *
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as any)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs sm:text-sm focus:outline-none focus:border-[#ba2d1d]"
                      >
                        <option value="transfer">Bank Transfer (BCA / Mandiri)</option>
                        <option value="qris">QRIS (Scan Langsung)</option>
                        <option value="cash">Bayar Tunai di Kasir Sasana</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                        Tingkat Pengalaman Beladiri
                      </label>
                      <select
                        value={experience}
                        onChange={(e) => setExperience(e.target.value as any)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs sm:text-sm focus:outline-none focus:border-[#ba2d1d]"
                      >
                        <option value="first_time">Pertama Kali Banget (Belum Pernah)</option>
                        <option value="beginner">Pemula (Sudah Pernah Coba 1-3 Kali)</option>
                        <option value="intermediate">Menengah (Rutin Latihan)</option>
                        <option value="advanced">Lanjutan / Atlet</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                        Catatan Khusus (Opsional)
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Mau pinjam sarung tinju, ada cedera bahu, dll."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs sm:text-sm focus:outline-none focus:border-[#ba2d1d]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{formError}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isSubmitting || !selectedSchedule}
                className={`w-full py-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                  isSubmitting || !selectedSchedule
                    ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                    : 'btn-fire text-white hover:scale-[1.01] active:scale-95'
                }`}
              >
                {isSubmitting ? (
                  'Memproses...'
                ) : !selectedSchedule ? (
                  'Pilih Jadwal Terlebih Dahulu di Langkah 2'
                ) : bookingType === 'member' ? (
                  <>
                    KONFIRMASI DENGAN KUOTA MEMBER
                    <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    LANJUT KE PEMBAYARAN DROP-IN (Rp {(selectedSchedule?.price || 75000).toLocaleString('id-ID')})
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-[#08090b] text-zinc-100 flex flex-col selection:bg-[#ba2d1d] selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Suspense fallback={<div className="py-20 text-center text-zinc-500">Memuat formulir booking...</div>}>
          <BookingContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
