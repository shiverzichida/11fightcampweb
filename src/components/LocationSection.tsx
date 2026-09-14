'use client';

import React from 'react';
import { GYM_INFO } from '@/lib/data';
import { MapPin, Clock, Phone, Navigation, Shield, Award, Sparkles } from 'lucide-react';

export default function LocationSection() {
  return (
    <section id="location" className="py-20 bg-[#090a0c] border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Location Info */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-950/50 border border-rose-800/40 text-rose-400 text-xs font-semibold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              Sasana & Fasilitas Kami
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              LOKASI STRATEGIS DI <br />
              <span className="text-gradient-red">KOTA PONTIANAK</span>
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              11 Fight Camp berlokasi di pusat kota Pontianak, mudah dijangkau dengan area parkir yang luas, sirkulasi udara optimal, serta perlengkapan standar kompetisi bela diri.
            </p>

            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Alamat Lengkap</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">{GYM_INFO.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-zinc-800">
                <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Jam Operasional Sasana</h4>
                  {GYM_INFO.openingHours.map((h, i) => (
                    <div key={i} className="text-xs text-zinc-400 flex justify-between gap-4">
                      <span className="font-semibold text-zinc-300">{h.days}:</span>
                      <span>
                        Pagi {h.morning} | Sore {h.evening}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-zinc-800">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Telepon / WhatsApp</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">{GYM_INFO.phoneFormatted}</p>
                </div>
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-2">
                <Shield className="w-4 h-4 text-rose-500" />
                Matras & Ring Standar
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-500" />
                Sewa Gloves & Handwrap
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                Shower & Loker Bersih
              </div>
              <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" />
                Heavy Bags & Speed Bag
              </div>
            </div>

            <div className="pt-2">
              <a
                href={GYM_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs border border-zinc-700 transition-colors"
              >
                <Navigation className="w-4 h-4 text-rose-500" />
                Buka di Google Maps
              </a>
            </div>
          </div>

          {/* Map Preview Embed */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-2xl relative h-[420px]">
              <iframe
                title="11 Fight Camp Location"
                src="https://maps.google.com/maps?q=Jl.+Dr.+Rubini+No.11,+Akcaya,+Kec.+Pontianak+Sel.,+Kota+Pontianak,+Kalimantan+Barat+78113&t=&z=15&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 filter invert contrast-125 opacity-80 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-zinc-800 flex items-center justify-between pointer-events-none">
                <span className="text-xs font-bold text-white">Jl. Dr. Rubini No. 11, Pontianak</span>
                <span className="text-[10px] text-zinc-400">Kalimantan Barat</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
