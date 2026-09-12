import React from 'react';
import { 
  DogProfile, 
  EditorialArticle, 
  DailyWellnessTask
} from '../types';
import { TrustStrip } from './TrustStrip';
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Stethoscope, 
  ChevronRight, 
  Calendar, 
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Award
} from 'lucide-react';

interface DashboardViewProps {
  activeDog: DogProfile;
  articles: EditorialArticle[];
  dailyTasks: DailyWellnessTask[];
  onToggleTask: (taskId: string) => void;
  onNavigate: (tab: string) => void;
  onReadArticle: (article: EditorialArticle) => void;
  onOpenCompanionModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  activeDog,
  articles,
  dailyTasks,
  onToggleTask,
  onNavigate,
  onReadArticle,
  onOpenCompanionModal,
}) => {
  const completedTasksCount = dailyTasks.filter((t) => t.completed).length;
  const progressPercent = Math.round((completedTasksCount / dailyTasks.length) * 100);

  return (
    <div className="space-y-12 pb-16">
      {/* Editorial Hero Section */}
      <section id="dashboard-hero-section" className="relative pt-4 sm:pt-6">
        <div className="bg-gradient-to-br from-[#FAF6EC] via-[#F1E7D4]/40 to-[#e8ded0]/30 border border-[#E8E0D3] rounded-[32px] p-6 sm:p-10 lg:p-12 relative overflow-hidden shadow-[0px_4px_20px_rgba(74,53,37,0.03)]">
          {/* Decorative subtle background accents */}
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-[#ceecb4]/20 blur-3xl pointer-events-none"></div>
          <div className="absolute right-10 bottom-0 w-64 h-64 rounded-full bg-[#F4B51B]/10 blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ceecb4]/40 border border-[#718C5C]/30 text-[#24451F] text-[12px] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#315B2B]"></span>
                <span>Canine Vitality Protocol Active • {activeDog.name}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1c1c16] leading-[1.15] tracking-tight">
                Veterinary precision meets holistic canine vitality.
              </h1>

              <p className="text-[16px] sm:text-[17px] text-[#4A3525] leading-relaxed max-w-xl">
                Scientific nutrition, weight-calibrated bio-actives, and digital clinical triage designed to add active, pain-free years to your companion's life.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  id="hero-triage-cta-btn"
                  onClick={() => onNavigate('triage')}
                  className="h-12 px-7 rounded-full bg-[#315B2B] hover:bg-[#24451F] text-white text-[14px] font-bold shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2"
                >
                  <Stethoscope className="w-4 h-4 text-[#F4B51B]" />
                  <span>Start Health Triage</span>
                </button>

                <button
                  id="hero-nutrition-cta-btn"
                  onClick={() => onNavigate('nutrition')}
                  className="h-12 px-6 rounded-full border-1.5 border-[#315B2B] hover:bg-[#315B2B]/5 text-[#315B2B] text-[14px] font-bold transition-all flex items-center gap-2"
                >
                  <span>Caloric & Dosing Tool</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Card: Companion Snapshot Card */}
            <div className="lg:col-span-5">
              <div className="bg-[#FFFFFF] border border-[#E8E0D3] rounded-[26px] p-6 shadow-[0px_8px_24px_-4px_rgba(49,91,43,0.08)] space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeDog.avatarUrl}
                      alt={activeDog.name}
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#ceecb4]"
                    />
                    <div>
                      <h3 className="font-serif text-xl font-bold text-[#1c1c16]">
                        {activeDog.name}
                      </h3>
                      <p className="text-[13px] text-[#718C5C] font-medium">
                        {activeDog.breed} • {activeDog.ageYears} yrs
                      </p>
                    </div>
                  </div>
                  <button
                    id="manage-active-dog-btn"
                    onClick={onOpenCompanionModal}
                    className="text-[12px] font-bold text-[#315B2B] hover:underline"
                  >
                    Manage
                  </button>
                </div>

                {/* Vitality Score Gauge */}
                <div className="bg-[#FAF6EC] rounded-2xl p-4 border border-[#E8E0D3]/80 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#718C5C]">
                      Canine Vitality Index
                    </span>
                    <p className="text-[13px] font-semibold text-[#1c1c16]">
                      Optimal Metabolic Status
                    </p>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-[#24451F]">
                      {activeDog.vitalityScore}
                    </span>
                    <span className="text-[13px] font-bold text-[#718C5C]">/100</span>
                  </div>
                </div>

                {/* Vitals Grid */}
                <div className="grid grid-cols-3 gap-2.5 text-center text-[12px]">
                  <div className="bg-[#FAF6EC] p-2.5 rounded-xl border border-[#E8E0D3]/60">
                    <span className="text-[#4A3525]/70 block text-[11px]">Weight</span>
                    <span className="font-bold text-[#1c1c16] text-[13px]">{activeDog.weightKg} kg</span>
                  </div>
                  <div className="bg-[#FAF6EC] p-2.5 rounded-xl border border-[#E8E0D3]/60">
                    <span className="text-[#4A3525]/70 block text-[11px]">BCS Index</span>
                    <span className="font-bold text-[#315B2B] text-[13px]">{activeDog.bcsScore}/9 Ideal</span>
                  </div>
                  <div className="bg-[#FAF6EC] p-2.5 rounded-xl border border-[#E8E0D3]/60">
                    <span className="text-[#4A3525]/70 block text-[11px]">Life Stage</span>
                    <span className="font-bold text-[#1c1c16] capitalize text-[13px]">{activeDog.lifeStage}</span>
                  </div>
                </div>

                {/* Next Milestone Notice */}
                <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#F4B51B]/15 border border-[#F4B51B]/30 text-[12px] text-[#4A3525]">
                  <Calendar className="w-4 h-4 text-[#F4B51B] shrink-0" />
                  <span>
                    Heartworm chew due in <strong>3 days</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4-Column Trust Indicators Strip */}
      <TrustStrip />

      {/* Today's Wellness Protocol Section */}
      <section id="daily-wellness-protocol" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1c16]">
              Today's Care Protocol for {activeDog.name}
            </h2>
            <p className="text-[14px] text-[#4A3525]/80">
              Evidence-based routine tracking for joint health, digestion, and systemic vitality.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-bold text-[#315B2B]">
              {completedTasksCount} of {dailyTasks.length} Completed ({progressPercent}%)
            </span>
            <div className="w-24 h-2.5 bg-[#E8E0D3] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#315B2B] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {dailyTasks.map((task) => (
            <div
              key={task.id}
              id={`daily-task-${task.id}`}
              onClick={() => onToggleTask(task.id)}
              className={`p-4 rounded-[20px] border transition-all cursor-pointer flex items-start gap-3.5 select-none ${
                task.completed
                  ? 'bg-[#FFFFFF]/60 border-[#ceecb4] opacity-80'
                  : 'bg-[#FFFFFF] border-[#E8E0D3] hover:border-[#315B2B] shadow-sm'
              }`}
            >
              {/* Checkbox */}
              <div
                className={`w-5 h-5 rounded mt-0.5 shrink-0 flex items-center justify-center transition-colors ${
                  task.completed
                    ? 'bg-[#315B2B] text-white'
                    : 'border-2 border-[#718C5C] hover:border-[#315B2B]'
                }`}
              >
                {task.completed && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#F1E7D4] text-[#4A3525]">
                    {task.timeSlot}
                  </span>
                  <span className="text-[11px] text-[#718C5C] font-semibold capitalize">
                    {task.category}
                  </span>
                </div>
                <h4 className={`text-[14px] font-semibold leading-snug ${task.completed ? 'line-through text-[#4A3525]/60' : 'text-[#1c1c16]'}`}>
                  {task.title}
                </h4>
                {task.notes && (
                  <p className="text-[12px] text-[#4A3525]/70 mt-1">
                    {task.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Clinical Symptom Triage Banner */}
      <section id="triage-callout-banner">
        <div className="bg-[#315B2B] rounded-[28px] p-6 sm:p-8 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full bg-[#F4B51B] text-[#24451F]">
              <Sparkles className="w-3.5 h-3.5" />
              Digital Clinical Assistant
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold leading-tight">
              Notice something unusual with {activeDog.name}?
            </h3>
            <p className="text-[14px] text-white/85 leading-relaxed">
              Our 60-second triage protocol assesses symptom severity, screens for acute emergency red-flags, and provides structured clinical notes for your vet.
            </p>
          </div>

          <button
            id="launch-triage-banner-btn"
            onClick={() => onNavigate('triage')}
            className="shrink-0 h-12 px-7 rounded-full bg-[#F4B51B] hover:bg-[#e0a210] text-[#24451F] font-bold text-[14px] shadow-lg transition-all flex items-center gap-2"
          >
            <Stethoscope className="w-4 h-4" />
            <span>Launch Symptom Triage</span>
          </button>
        </div>
      </section>

      {/* Veterinary Editorial & Research Spotlights */}
      <section id="editorial-monographs-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#718C5C]">
              Evidence-Based Veterinary Care
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1c16] mt-1">
              Clinical Monographs & Nutrition Research
            </h2>
            <p className="text-[14px] text-[#4A3525]/80 mt-1">
              Authored by board-certified veterinary nutritionists, internal medicine fellows, and rehabilitation therapists.
            </p>
          </div>

          <button
            id="explore-all-articles-btn"
            onClick={() => onNavigate('blog')}
            className="h-10 px-4 rounded-full border border-[#E8E0D3] bg-white text-[#315B2B] hover:bg-[#FAF6EC] text-[13px] font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0 self-start sm:self-auto"
          >
            <span>Explore All Blog Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div
              key={article.id}
              id={`article-card-${article.id}`}
              onClick={() => onReadArticle(article)}
              className="group bg-[#FFFFFF] border border-[#E8E0D3] rounded-[24px] overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-[#F1E7D4]">
                <img
                  src={article.heroImage}
                  alt={article.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-bold">
                    {article.category}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-[#718C5C] font-semibold">
                    <Award className="w-3.5 h-3.5 text-[#315B2B]" />
                    <span>{article.evidenceGrade}</span>
                    <span>•</span>
                    <span>{article.readTimeMinutes} min read</span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#1c1c16] group-hover:text-[#315B2B] transition-colors leading-snug line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-[13px] text-[#4A3525]/80 line-clamp-2 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8E0D3]/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={article.vetAvatar}
                      alt={article.authorVet}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-[#E8E0D3]"
                    />
                    <div className="text-left">
                      <span className="text-[12px] font-bold text-[#1c1c16] block leading-none">
                        {article.authorVet}
                      </span>
                      <span className="text-[10px] text-[#4A3525]/70 leading-none">
                        {article.vetCredentials.split('(')[0]}
                      </span>
                    </div>
                  </div>

                  <span className="text-[12px] font-bold text-[#315B2B] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Monograph <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
