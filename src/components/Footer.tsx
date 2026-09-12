import React, { useState } from 'react';
import { Heart, PhoneCall, ShieldAlert, CheckCircle, Mail } from 'lucide-react';

export const Footer: React.FC<{ 
  onNavigate: (tab: string) => void;
  onOpenAdmin?: () => void;
}> = ({ onNavigate, onOpenAdmin }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#24451F] text-[#FAF6EC] pt-14 pb-10 border-t border-[#315B2B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Emergency Hotline Alert Box */}
        <div className="bg-[#1a3317] border border-[#315B2B] rounded-2xl p-5 mb-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#D97A42]/20 text-[#D97A42] flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-[15px] font-bold text-white leading-tight">
                24/7 Animal Poison Control Hotline
              </h4>
              <p className="text-[13px] text-white/75 mt-0.5">
                If your dog has ingested chocolate, grapes, xylitol, rodenticide, or toxic plants, call immediately.
              </p>
            </div>
          </div>
          <a
            href="tel:8884264435"
            id="emergency-poison-phone-cta"
            className="shrink-0 h-11 px-6 rounded-full bg-[#D97A42] hover:bg-[#c06834] text-white text-[13px] font-bold flex items-center gap-2 shadow-md transition-all"
          >
            <PhoneCall className="w-4 h-4" />
            (888) 426-4435 (ASPCA)
          </a>
        </div>

        {/* 4-Column Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#315B2B] text-white flex items-center justify-center">
                <Heart className="w-5 h-5 fill-[#F4B51B] text-[#F4B51B]" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Canine Vitality & Care Hub
              </span>
            </div>
            <p className="text-[14px] text-white/80 leading-relaxed max-w-sm">
              Bridging the clinical rigor of modern veterinary science with the tactile warmth and devotion of dedicated dog companionship. Formulated without compromise.
            </p>
            <div className="text-[12px] text-white/60">
              <p>Email: <span className="text-[#F4B51B]">doghealthtip@gmail.com</span></p>
              <p>Clinical Board: DVM DACVIM, DACVN, CCRT Certified</p>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div className="space-y-3">
            <h4 className="text-[13px] font-bold tracking-wider uppercase text-[#ceecb4]">
              Clinical Navigation
            </h4>
            <ul className="space-y-2 text-[14px] text-white/80">
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-[#F4B51B] transition-colors">
                  Clinical Research Blog
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('triage')} className="hover:text-[#F4B51B] transition-colors">
                  Digital Symptom Triage
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('nutrition')} className="hover:text-[#F4B51B] transition-colors">
                  Caloric & Dosing Engine
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-[#F4B51B] transition-colors">
                  Canine Care Hub
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Clinical Topics */}
          <div className="space-y-3">
            <h4 className="text-[13px] font-bold tracking-wider uppercase text-[#ceecb4]">
              Clinical Topics
            </h4>
            <ul className="space-y-2 text-[14px] text-white/80">
              <li>Joint & Musculoskeletal Integrity</li>
              <li>Gut Microbiome & Digestion</li>
              <li>Evidence-Based Canine Nutrition</li>
              <li>Cognitive & Behavioral Health</li>
              <li>Preventive Longevity Medicine</li>
            </ul>
          </div>

          {/* Col 5: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-[13px] font-bold tracking-wider uppercase text-[#ceecb4]">
              Canine Longevity Digest
            </h4>
            <p className="text-[13px] text-white/80">
              Bi-weekly veterinary monographs on nutrition, longevity research, and recall alerts.
            </p>
            {subscribed ? (
              <div className="p-3 bg-[#315B2B] rounded-xl text-[12px] flex items-center gap-2 text-white">
                <CheckCircle className="w-4 h-4 text-[#F4B51B]" />
                <span>Subscribed to Veterinary Digest!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="doghealthtip@gmail.com"
                    className="w-full h-11 px-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-[13px] focus:outline-none focus:border-[#F4B51B]"
                  />
                </div>
                <button
                  type="submit"
                  id="footer-subscribe-btn"
                  className="w-full h-10 rounded-full bg-[#F4B51B] hover:bg-[#e0a210] text-[#24451F] font-bold text-[13px] shadow transition-all"
                >
                  Join Longevity Circle
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Legal & Medical Disclaimer */}
        <div className="pt-8 border-t border-white/10 space-y-3 text-[12px] text-white/60">
          <p className="leading-relaxed">
            <strong className="text-white/80">Veterinary Medical Disclaimer:</strong> The clinical guidelines, caloric calculators, triage recommendations, and formulations published on this platform are intended solely for general preventive wellness and educational guidance. They do not constitute the practice of veterinary medicine or establish a doctor-patient relationship. In acute emergencies or sudden physiological decline, transport your companion to an accredited 24-hour veterinary emergency center immediately.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2">
            <div className="flex items-center gap-3">
              <p>© {new Date().getFullYear()} Canine Vitality & Care Hub. All rights reserved.</p>
              <span className="text-white/30">•</span>
              <button
                type="button"
                id="footer-admin-link"
                onClick={onOpenAdmin}
                className="text-white/35 hover:text-white/80 transition-colors text-[11px] font-normal cursor-pointer"
                title="Staff Portal"
              >
                Admin
              </button>
            </div>
            <p>Designed with clinical precision & holistic canine empathy.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
