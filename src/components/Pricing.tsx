'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MEMBERSHIP_PLANS, GYM_INFO } from '@/lib/data';
import { MembershipPlan } from '@/lib/types';
import { saveNewMember } from '@/lib/storage';
import {
  Check,
  Flame,
  MessageSquare,
  ArrowRight,
  Sparkles,
  XCircle,
  CreditCard,
  Building2,
  Copy,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Clock,
} from 'lucide-react';

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [step, setStep] = useState<'form' | 'instructions'>('form');

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'cash' | 'qris' | 'edc'>('transfer');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Success Result State
  const [registeredMemberCode, setRegisteredMemberCode] = useState('');
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  const handleOpenRegister = (plan: MembershipPlan) => {
    setSelectedPlan(plan);
    setStep('form');
    setShowRegisterModal(true);
  };

  const handleCopy = (text: string, bankName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(bankName);
    setTimeout(() => setCopiedBank(null), 2500);
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan || !fullName.trim() || !phone.trim()) return;

    setIsSubmitting(true);
    try {
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
        name: fullName,
        phone,
        email: email || undefined,
        planId: selectedPlan.id,
        planTitle: selectedPlan.title,
        price: selectedPlan.price,
        paymentMethod,
        paymentStatus: 'pending',
        durationDays,
        totalSessions,
        notes: notes || undefined,
      });

      setRegisteredMemberCode(newMember.memberCode);
      setStep('instructions');
    } catch (err) {
      console.error('Registration error:', err);
      alert('Terjadi kendala saat pendaftaran. Silakan hubungi admin via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const waProofUrl = selectedPlan
    ? `https://wa.me/${GYM_INFO.phone.replace('+', '')}?text=${encodeURIComponent(
        `Halo Admin 11th Universe MMA, saya sudah mendaftar membership paket [${selectedPlan.title}] via website dengan ID Registrasi [${registeredMemberCode}]. Nama: ${fullName}. Berikut saya lampirkan bukti pembayarannya untuk dikonfirmasi.`
      )}`
    : `https://wa.me/${GYM_INFO.phone.replace('+', '')}`;

  return (
    <section id="pricing" className="py-20 bg-carbon border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ba2d1d]/20 border border-[#ba2d1d]/40 text-[#d63725] text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
            Investasi Kebugaran & Bela Diri
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            PAKET & <span className="text-gradient-red">BIAYA MEMBER</span>
          </h2>
          <p className="mt-3 text-zinc-400 text-base">
            Tanpa biaya registrasi tersembunyi. Pilih paket sesuai kebutuhan dan rutinitas latihan Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {MEMBERSHIP_PLANS.map((plan) => {
            const isPopular = plan.isPopular;
            const waPlanUrl = `https://wa.me/${GYM_INFO.phone.replace('+', '')}?text=${encodeURIComponent(
              `Halo Admin 11th Universe MMA, saya ingin tanya info membership paket [${plan.title} - Rp ${plan.price.toLocaleString(
                'id-ID'
              )}].`
            )}`;

            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
                  isPopular
                    ? 'bg-gradient-to-b from-zinc-900 to-black card-fire lg:-translate-y-2.5 z-10'
                    : 'bg-zinc-900/80 border border-zinc-800 card-fire-hover hover:border-zinc-700'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full btn-fire text-white font-black text-[11px] uppercase tracking-wider">
                    {plan.badge}
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-black text-white mt-1">{plan.title}</h3>
                  <p className="text-xs text-zinc-400 mt-1 min-h-[36px] leading-relaxed font-medium">
                    {plan.subtitle}
                  </p>

                  <div className="my-6 pb-6 border-b border-zinc-800">
                    <span className="text-2xl sm:text-3xl font-black text-white">
                      Rp {plan.price.toLocaleString('id-ID')}
                    </span>
                    <span className="text-xs text-zinc-400 block mt-1 font-semibold">/ {plan.period}</span>
                  </div>

                  <ul className="space-y-3 text-xs text-zinc-300">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[#ba2d1d] shrink-0 mt-0.5" />
                        <span className="leading-snug">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8 mt-6 space-y-2.5">
                  {plan.id === 'drop-in' ? (
                    <Link
                      href="/booking"
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl btn-fire text-white font-black text-xs transition-all active:scale-95"
                    >
                      Booking Sesi Drop-in
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <>
                      <button
                        onClick={() => handleOpenRegister(plan)}
                        className={`w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-xs transition-all active:scale-95 ${
                          isPopular
                            ? 'btn-fire text-white hover:scale-[1.02]'
                            : 'bg-[#ba2d1d] hover:bg-[#ba2d1d]/90 text-white'
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5" />
                        Daftar Paket Ini
                      </button>

                      <a
                        href={waPlanUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-lg text-zinc-400 hover:text-zinc-200 text-[11px] font-semibold transition-colors"
                      >
                        <MessageSquare className="w-3 h-3 text-emerald-400" />
                        Tanya Admin via WA
                      </a>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL REGISTRASI MEMBERSHIP */}
      {showRegisterModal && selectedPlan && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#ea580c]" />
                <h3 className="text-lg font-black text-white uppercase">
                  {step === 'form' ? 'Formulir Pendaftaran Member' : 'Instruksi Pembayaran'}
                </h3>
              </div>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* STEP 1: FORM PENDAFTARAN */}
            {step === 'form' ? (
              <form onSubmit={handleSubmitRegistration} className="space-y-4">
                {/* Plan Summary Banner */}
                <div className="p-4 rounded-2xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                      Paket Dipilih:
                    </span>
                    <h4 className="text-base font-black text-white mt-0.5">{selectedPlan.title}</h4>
                    <span className="text-xs text-zinc-400">{selectedPlan.period}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black text-amber-400">
                      Rp {selectedPlan.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Alexander Pratama"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs focus:outline-none focus:border-[#ba2d1d]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                      No. WhatsApp (Aktif) *
                    </label>
                    <input
                      type="tel"
                      placeholder="08123456789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs focus:outline-none focus:border-[#ba2d1d]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                      Email (Opsional)
                    </label>
                    <input
                      type="email"
                      placeholder="member@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs focus:outline-none focus:border-[#ba2d1d]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Metode Pembayaran *
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs focus:outline-none focus:border-[#ba2d1d]"
                  >
                    <option value="transfer">Bank Transfer (BCA / Mandiri / BRI)</option>
                    <option value="qris">QRIS (Scan Langsung)</option>
                    <option value="cash">Bayar Tunai di Kasir Sasana</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase mb-1">
                    Catatan Khusus (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Rencana mulai latihan hari Senin depan"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-zinc-700 text-white text-xs focus:outline-none focus:border-[#ba2d1d]"
                  />
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl btn-fire text-white font-black text-xs transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    {isSubmitting ? (
                      'Memproses...'
                    ) : (
                      <>
                        Lanjut ke Pembayaran & Rekening
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-zinc-500 text-center mt-2">
                    🔒 Data Anda aman. Status pendaftaran akan langsung tercatat di sistem admin 11 Fight Camp.
                  </p>
                </div>
              </form>
            ) : (
              /* STEP 2: INSTRUKSI PEMBAYARAN */
              <div className="space-y-4 animate-in fade-in">
                {/* Status Notice */}
                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                      Status: Menunggu Pembayaran & Konfirmasi
                    </span>
                    <p className="text-[11px] text-zinc-300 mt-0.5 leading-relaxed">
                      Pendaftaran Anda telah tercatat dengan ID:{' '}
                      <strong className="text-amber-400 font-mono text-xs">{registeredMemberCode}</strong>.
                      Silakan lakukan pembayaran sesuai rincian berikut:
                    </p>
                  </div>
                </div>

                {/* Tagihan Nominal */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 text-center space-y-1">
                  <span className="text-xs text-zinc-400 font-semibold uppercase">Total Tagihan Transfer</span>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    Rp {selectedPlan.price.toLocaleString('id-ID')}
                  </div>
                  <span className="text-[11px] text-zinc-500">Paket: {selectedPlan.title}</span>
                </div>

                {/* Detail Rekening Sasana */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                    Pilihan Rekening Resmi Sasana:
                  </span>

                  {/* Bank BCA */}
                  <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-950/80 border border-blue-800 flex items-center justify-center text-blue-400 font-black text-xs">
                        BCA
                      </div>
                      <div>
                        <div className="text-xs font-mono font-bold text-white">812-482-4111</div>
                        <div className="text-[10px] text-zinc-400">a.n. 11TH UNIVERSE MMA</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy('8124824111', 'BCA')}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-bold flex items-center gap-1 transition-colors"
                    >
                      {copiedBank === 'BCA' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Tersalin
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Salin
                        </>
                      )}
                    </button>
                  </div>

                  {/* Bank Mandiri */}
                  <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-950/80 border border-amber-800 flex items-center justify-center text-amber-400 font-black text-[10px]">
                        MANDIRI
                      </div>
                      <div>
                        <div className="text-xs font-mono font-bold text-white">146-00-1122334-5</div>
                        <div className="text-[10px] text-zinc-400">a.n. 11TH UNIVERSE MMA</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleCopy('1460011223345', 'MANDIRI')}
                      className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-bold flex items-center gap-1 transition-colors"
                    >
                      {copiedBank === 'MANDIRI' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          Tersalin
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Salin
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 space-y-2">
                  <a
                    href={waProofUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Kirim Bukti Transfer ke WhatsApp Admin
                  </a>

                  <button
                    onClick={() => setShowRegisterModal(false)}
                    className="w-full py-2.5 rounded-xl bg-zinc-800 text-zinc-300 hover:text-white font-bold text-xs transition-colors"
                  >
                    Tutup & Selesai
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

