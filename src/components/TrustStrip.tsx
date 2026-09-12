import React from 'react';
import { ShieldCheck, Sparkles, HeartPulse, Stethoscope } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const trustItems = [
    {
      icon: Stethoscope,
      title: 'Peer-Reviewed Science',
      caption: 'Every article and clinical protocol reviewed by board-certified DVM specialists.',
    },
    {
      icon: ShieldCheck,
      title: 'Zero Commercial Bias',
      caption: 'Independent, research-backed guidance without affiliate influence or undisclosed sponsorships.',
    },
    {
      icon: Sparkles,
      title: 'Nutritional Science',
      caption: 'Evidence-based caloric and macro-nutrient calculations grounded in veterinary internal medicine.',
    },
    {
      icon: HeartPulse,
      title: 'Clinical Symptom Triage',
      caption: 'Evidence-based decision trees for detecting urgent emergencies vs watchful home monitoring.',
    },
  ];

  return (
    <section id="trust-indicators-strip" className="w-full py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {trustItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              id={`trust-item-${index}`}
              className="bg-[#FFFFFF] border border-[#E8E0D3] rounded-[22px] p-5 shadow-[0px_2px_8px_rgba(74,53,37,0.04)] flex items-start gap-4 transition-all duration-200 hover:shadow-[0px_6px_20px_-4px_rgba(49,91,43,0.08)]"
            >
              <div className="w-12 h-12 shrink-0 rounded-full bg-[#718C5C]/20 text-[#24451F] flex items-center justify-center">
                <Icon className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[14px] font-bold text-[#24451F] leading-tight tracking-[0.02em]">
                  {item.title}
                </h4>
                <p className="text-[13px] text-[#4A3525]/80 leading-relaxed">
                  {item.caption}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
