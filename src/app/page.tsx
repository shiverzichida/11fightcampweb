import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Programs from '@/components/Programs';
import ScheduleSection from '@/components/ScheduleSection';
import Trainers from '@/components/Trainers';
import Pricing from '@/components/Pricing';
import LocationSection from '@/components/LocationSection';
import Footer from '@/components/Footer';
import { TESTIMONIALS, GYM_INFO } from '@/lib/data';
import { Star, Quote, ArrowRight, Calendar, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#090a0c] text-zinc-100 flex flex-col selection:bg-rose-600 selection:text-white">
      <Navbar />

      <Hero />

      <Programs />

      <ScheduleSection />

      <Trainers />

      <Pricing />

      {/* Testimonials Section */}
      <section className="py-20 bg-[#090a0c] border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              KATA <span className="text-gradient-red">MEMBER KAMI</span>
            </h2>
            <p className="mt-2 text-zinc-400 text-sm">
              Pengalaman nyata member dan atlet yang berlatih di 11 Fight Camp Pontianak.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between space-y-4 hover:border-zinc-700 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-300 italic leading-relaxed">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.name}</h4>
                    <p className="text-[11px] text-zinc-500">{t.role}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-950/70 text-rose-400 border border-rose-900/40">
                    {t.classTag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Direct CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-[#ba2d1d]/30 via-zinc-950 to-zinc-950 border-b border-zinc-800 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            SIAP MULAI TRANSFORMASI FISIK & MENTAL ANDA?
          </h2>
          <p className="text-sm sm:text-base text-zinc-300 max-w-2xl mx-auto">
            Booking sesi perdana Anda hari ini. Sarung tinju dan peralatan dasar dipinjamkan gratis untuk pemula yang baru pertama kali datang!
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/booking"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl btn-fire text-white font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-xl"
            >
              <Calendar className="w-4 h-4" />
              BOOKING KELAS SEKARANG
            </Link>
            <a
              href={`https://wa.me/${GYM_INFO.phone.replace('+', '')}?text=${encodeURIComponent(
                'Halo 11 Fight Camp, saya ingin tanya informasi trial atau coba kelas beladiri.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-bold text-sm border border-zinc-700 transition-all"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              Tanya Admin via WhatsApp
            </a>
          </div>
        </div>
      </section>

      <LocationSection />

      <Footer />
    </main>
  );
}
