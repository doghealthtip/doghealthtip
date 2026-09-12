import React from 'react';
import { EditorialArticle } from '../types';
import { X, BookOpen, Award, CheckCircle2, Calendar, Clock } from 'lucide-react';

interface ArticleModalProps {
  article: EditorialArticle | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div
      id="article-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="article-modal-dialog"
        className="relative bg-[#FFFFFF] border border-[#E8E0D3] rounded-[28px] max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          id="close-article-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#FAF6EC] hover:bg-[#F1E7D4] text-[#4A3525] flex items-center justify-center transition-colors"
          aria-label="Close article"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category & Evidence Grade */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-[12px] font-bold uppercase tracking-wider text-[#718C5C]">
            {article.category}
          </span>
          <span className="text-[#E8E0D3]">•</span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#ceecb4]/40 text-[#24451F] text-[11px] font-bold">
            <Award className="w-3 h-3 text-[#315B2B]" />
            {article.evidenceGrade}
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#1c1c16] leading-tight mb-4">
          {article.title}
        </h1>

        {/* Author Bio Strip */}
        <div className="flex items-center gap-3.5 py-4 border-y border-[#E8E0D3] mb-6">
          <img
            src={article.vetAvatar}
            alt={article.authorVet}
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-full object-cover border border-[#E8E0D3]"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold text-[#1c1c16]">
                {article.authorVet}
              </span>
              <span className="text-[11px] bg-[#315B2B] text-white px-2 py-0.5 rounded-full font-semibold">
                Vet Author
              </span>
            </div>
            <p className="text-[12px] text-[#4A3525]/80">
              {article.vetCredentials}
            </p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-4 text-[12px] text-[#4A3525]/60">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {article.publishDate}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readTimeMinutes} min read
            </span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6 bg-[#F1E7D4]">
          <img
            src={article.heroImage}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Clinical Takeaways Box */}
        <div className="bg-[#FAF6EC] border border-[#E8E0D3] rounded-2xl p-5 mb-8">
          <h3 className="text-[14px] font-bold text-[#24451F] uppercase tracking-wider mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#315B2B]" />
            Key Clinical Takeaways for Dog Parents
          </h3>
          <ul className="space-y-2">
            {article.keyTakeaways.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-[14px] text-[#4A3525]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#315B2B] mt-2 shrink-0"></span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Body Sections */}
        <div className="space-y-6 text-[#4A3525] text-[15px] leading-relaxed">
          {article.sections.map((section, idx) => (
            <div key={idx} className="space-y-3">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1c1c16]">
                {section.heading}
              </h3>
              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx}>{p}</p>
              ))}
            </div>
          ))}
        </div>

        {/* Clinical Disclaimer */}
        <div className="mt-8 pt-6 border-t border-[#E8E0D3] text-[12px] text-[#4A3525]/70 italic">
          Disclaimer: This educational monograph is peer-reviewed by veterinary medical professionals for educational purposes and does not replace individualized diagnosis by your attending veterinarian.
        </div>
      </div>
    </div>
  );
};
