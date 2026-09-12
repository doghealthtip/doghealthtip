import React, { useState } from 'react';
import { DogProfile, TriageResult, TriageUrgency } from '../types';
import { 
  Stethoscope, 
  AlertTriangle, 
  CheckCircle2, 
  PhoneCall, 
  Copy, 
  Check, 
  RotateCcw, 
  ShieldAlert, 
  ArrowRight, 
  ChevronDown,
  Info,
  HeartCrack
} from 'lucide-react';

interface SymptomTriageViewProps {
  activeDog: DogProfile;
  allDogs: DogProfile[];
  onSelectDog: (dogId: string) => void;
}

interface SymptomCluster {
  id: string;
  name: string;
  icon: string;
  description: string;
  subSymptoms: string[];
}

export const SymptomTriageView: React.FC<SymptomTriageViewProps> = ({
  activeDog,
  allDogs,
  onSelectDog,
}) => {
  const [selectedCluster, setSelectedCluster] = useState<string>('gi');
  const [duration, setDuration] = useState<string>('less-than-24h');
  const [appetite, setAppetite] = useState<string>('reduced');
  const [gumColor, setGumColor] = useState<string>('pink');
  const [energyLevel, setEnergyLevel] = useState<string>('quiet');
  const [subSymptomsSelected, setSubSymptomsSelected] = useState<string[]>(['Loose stool / diarrhea']);
  const [redFlags, setRedFlags] = useState<{ [key: string]: boolean }>({
    distendedAbdomen: false,
    toxicIngestion: false,
    collapse: false,
    respiratoryDistress: false,
    seizures: false,
  });

  const [triageReport, setTriageReport] = useState<TriageResult | null>(null);
  const [copied, setCopied] = useState(false);

  const symptomClusters: SymptomCluster[] = [
    {
      id: 'gi',
      name: 'Digestive & Stool',
      icon: '🌿',
      description: 'Vomiting, diarrhea, eating grass, bile expulsion, flatulence.',
      subSymptoms: [
        'Loose stool / diarrhea',
        'Single vomiting episode',
        'Repeated vomiting (>2 times)',
        'Decreased appetite / skipping dinner',
        'Licking lips / audible stomach gurgling',
        'Eating grass compulsively',
      ],
    },
    {
      id: 'mobility',
      name: 'Mobility & Joints',
      icon: '🐾',
      description: 'Limping, stiffness after sleep, hesitation jumping, favoring paw.',
      subSymptoms: [
        'Stiffness rising after recumbency',
        'Mild limp / favoring one leg',
        'Inability to bear any weight on limb',
        'Reluctance on stairs or car jumping',
        'Licking carpal / wrist joint repetitively',
      ],
    },
    {
      id: 'derma',
      name: 'Skin, Ears & Itch',
      icon: '✨',
      description: 'Paw chewing, head shaking, ear odor, red belly rash, hot spots.',
      subSymptoms: [
        'Frequent head shaking / ear flap flapping',
        'Dark wax or yeast odor in ear canal',
        'Intense paw licking / reddish saliva staining',
        'Acute localized moist hot spot',
        'Flea dirt or scratching flanks',
      ],
    },
    {
      id: 'respiratory',
      name: 'Respiratory & Energy',
      icon: '🫁',
      description: 'Dry hacking cough, heavy panting at rest, lethargy, exercise intolerance.',
      subSymptoms: [
        'Dry, honking or hacking cough',
        'Rapid panting while resting in cool room',
        'Unusual reluctance to walk',
        'Nasal discharge (clear or colored)',
      ],
    },
  ];

  const handleToggleSubSymptom = (sym: string) => {
    if (subSymptomsSelected.includes(sym)) {
      setSubSymptomsSelected(subSymptomsSelected.filter((s) => s !== sym));
    } else {
      setSubSymptomsSelected([...subSymptomsSelected, sym]);
    }
  };

  const handleRunTriage = (e: React.FormEvent) => {
    e.preventDefault();

    // Check critical red flags first
    const hasCriticalRedFlag = 
      redFlags.distendedAbdomen || 
      redFlags.toxicIngestion || 
      redFlags.collapse || 
      redFlags.respiratoryDistress || 
      redFlags.seizures ||
      gumColor === 'pale' ||
      gumColor === 'brick';

    if (hasCriticalRedFlag) {
      setTriageReport({
        urgency: 'emergency',
        title: 'Immediate Veterinary Emergency',
        headline: 'Potential Critical Physiologic Hazard Detected',
        summary: `Based on the reported red-flag indicators for ${activeDog.name} (${activeDog.weightKg}kg ${activeDog.breed}), emergency veterinary evaluation is advised immediately. Do NOT delay or wait overnight.`,
        immediateActions: [
          'Locate the nearest open 24-hour veterinary emergency facility immediately.',
          'If potential toxin or poison ingestion occurred, bring packaging or take a photo of the substance.',
          'Keep your dog warm, calm, and minimize physical movement during car transport.',
          'Do NOT administer human medications (such as Tylenol, Ibuprofen, or Pepto-Bismol) which are toxic to dogs.',
        ],
        whatToAvoid: [
          'Do NOT attempt to induce vomiting at home with hydrogen peroxide unless specifically directed by a toxicologist or DVM.',
          'Do NOT force-feed water or food to a nauseous, seizing, or recumbent dog.',
        ],
        questionsForVet: [
          'What stabilization protocols will be initiated upon arrival?',
          'Is diagnostic abdominal radiography or emergency blood lactate testing indicated?',
        ],
        redFlagWarning: 'Critical signs such as distended tight abdomen, pale mucous membranes, or sudden weakness require immediate clinical stabilization.',
      });
      return;
    }

    // Check moderate urgency
    const isModerate = 
      duration === 'more-than-3days' || 
      appetite === 'none' || 
      subSymptomsSelected.includes('Inability to bear any weight on limb') ||
      subSymptomsSelected.includes('Repeated vomiting (>2 times)');

    if (isModerate) {
      setTriageReport({
        urgency: 'veterinary-soon',
        title: 'Schedule Veterinary Visit (Within 24 - 48 Hours)',
        headline: 'Persistent Symptom Requiring Clinical Diagnostic Workup',
        summary: `${activeDog.name}'s symptoms are exhibiting persistence or elevated discomfort. While not an immediate life-threatening emergency, diagnostic workup (fecal exam, orthopaedic palpation, or ear cytology) is warranted within 1-2 days.`,
        immediateActions: [
          'Call your regular vet clinic to schedule an exam within 24-48 hours.',
          'Collect a fresh fecal sample if gastrointestinal symptoms are present.',
          'Withhold rich commercial treats and novel proteins for the next 24 hours.',
          'Monitor body temperature and resting respiratory rate (normal canine resting rate is 15-30 breaths per minute).',
        ],
        whatToAvoid: [
          'Avoid vigorous exercise, agility jumps, or off-leash running until examined.',
          'Avoid abrupt food changes or fatty table scraps.',
        ],
        blandDietRecipe: 'If permitted by your vet: 2 parts boiled white rice (or cooked pumpkin) to 1 part boiled skinless lean turkey or white chicken for 48 hours.',
        questionsForVet: [
          'Would fecal pathogen PCR or cytology be beneficial today?',
          'Should we perform baseline blood chemistry or targeted joint radiographs?',
        ],
      });
      return;
    }

    // Mild / Home Supportive Monitoring
    setTriageReport({
      urgency: 'home-monitoring',
      title: 'Supportive Home Monitoring Protocol',
      headline: 'Mild Transient Signs — Supportive Care & Vigilance',
      summary: `Symptoms appear mild, recent, and non-emergent for ${activeDog.name}. Often related to minor dietary indiscretion, excitement, or transient muscle soreness. Follow supportive measures and monitor closely for 24 hours.`,
      immediateActions: [
        'Offer small amounts of fresh lukewarm water or plain bone broth to maintain hydration.',
        'Consider rehydrated organic pumpkin powder or spore probiotics to stabilize colonic moisture.',
        'Allow comfortable rest in a quiet, draft-free resting zone.',
        'Keep a written log of stool consistency and activity levels.',
      ],
      whatToAvoid: [
        'Do not feed fatty bones, rawhides, or heavy table scraps.',
        'Do not force strenuous walks if joint stiffness is suspected.',
      ],
      blandDietRecipe: 'Gentle Bland Diet: 1 tablespoon of 100% pure canned pumpkin mixed with a small portion of plain boiled white rice and shredded lean boiled poultry, divided into 3 small meals.',
      questionsForVet: [
        'If symptoms do not resolve within 48 hours, what is the best timing for a physical exam?',
      ],
    });
  };

  const handleCopyNotes = () => {
    if (!triageReport) return;
    const notes = `CANINE VITALITY CLINICAL TRIAGE REPORT
Patient: ${activeDog.name} (${activeDog.breed}, ${activeDog.ageYears} yrs, ${activeDog.weightKg} kg)
Primary Category: ${selectedCluster}
Reported Symptoms: ${subSymptomsSelected.join(', ')}
Duration: ${duration}
Gum Color: ${gumColor}
Appetite: ${appetite}
Energy Level: ${energyLevel}
Triage Assessment: ${triageReport.title} (${triageReport.urgency.toUpperCase()})
Key Clinical Summary: ${triageReport.summary}
Date Generated: ${new Date().toLocaleDateString()}`;

    navigator.clipboard.writeText(notes);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-16">
      {/* Header & Dog Context */}
      <div className="bg-[#FFFFFF] border border-[#E8E0D3] rounded-[28px] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8E0D3]/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ceecb4]/40 text-[#24451F] text-[11px] font-bold mb-2">
              <Stethoscope className="w-3.5 h-3.5 text-[#315B2B]" />
              Veterinary Algorithm • Clinical Guidance
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1c16]">
              Canine Symptom Triage Tool
            </h1>
            <p className="text-[14px] text-[#4A3525]/80 mt-1">
              Step-by-step guidance to evaluate symptom urgency, detect critical red-flags, and create clinical handoff notes.
            </p>
          </div>

          {/* Active Companion Selector */}
          <div className="flex items-center gap-3 bg-[#FAF6EC] p-2.5 pr-4 rounded-2xl border border-[#E8E0D3]">
            <img
              src={activeDog.avatarUrl}
              alt={activeDog.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-[#E8E0D3]"
            />
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#718C5C] block">
                Evaluating Patient
              </span>
              <span className="text-[14px] font-bold text-[#1c1c16]">
                {activeDog.name} ({activeDog.weightKg} kg)
              </span>
            </div>
          </div>
        </div>

        {/* Triage Form or Report */}
        {!triageReport ? (
          <form onSubmit={handleRunTriage} className="space-y-8 pt-6">
            {/* Step 1: Select Symptom Cluster */}
            <div className="space-y-3">
              <label className="block text-[14px] font-bold text-[#24451F]">
                1. Select Primary Symptom Category
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {symptomClusters.map((cluster) => {
                  const isSelected = selectedCluster === cluster.id;
                  return (
                    <button
                      type="button"
                      key={cluster.id}
                      id={`cluster-btn-${cluster.id}`}
                      onClick={() => {
                        setSelectedCluster(cluster.id);
                        setSubSymptomsSelected([]);
                      }}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-[#315B2B] bg-[#ceecb4]/20 shadow-sm'
                          : 'border-[#E8E0D3] hover:border-[#315B2B]/40 bg-white'
                      }`}
                    >
                      <span className="text-2xl mb-1 block">{cluster.icon}</span>
                      <h4 className="text-[14px] font-bold text-[#1c1c16]">{cluster.name}</h4>
                      <p className="text-[12px] text-[#4A3525]/70 mt-1 line-clamp-2">
                        {cluster.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Specific Symptoms in Cluster */}
            <div className="space-y-3">
              <label className="block text-[14px] font-bold text-[#24451F]">
                2. Check All Specific Symptoms Observed in {activeDog.name}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {symptomClusters
                  .find((c) => c.id === selectedCluster)
                  ?.subSymptoms.map((sym, idx) => {
                    const isChecked = subSymptomsSelected.includes(sym);
                    return (
                      <div
                        key={idx}
                        id={`sub-sym-${idx}`}
                        onClick={() => handleToggleSubSymptom(sym)}
                        className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer select-none transition-all ${
                          isChecked
                            ? 'border-[#315B2B] bg-[#ceecb4]/15 font-semibold text-[#1c1c16]'
                            : 'border-[#E8E0D3] bg-white text-[#4A3525] hover:bg-[#FAF6EC]'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-[#315B2B] text-white'
                              : 'border-2 border-[#718C5C]'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-[13px]">{sym}</span>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Step 3: Vitals & Progression Parameters */}
            <div className="space-y-4 pt-4 border-t border-[#E8E0D3]">
              <h3 className="text-[14px] font-bold text-[#24451F]">
                3. Onset & Vital Parameters
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-[13px]">
                {/* Duration */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1c1c16] block">Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full h-12 px-3 rounded-xl border border-[#E8E0D3] bg-white text-[#4A3525] focus:border-[#315B2B]"
                  >
                    <option value="less-than-12h">&lt; 12 Hours (Acute)</option>
                    <option value="less-than-24h">12 to 24 Hours</option>
                    <option value="1-to-2days">1 to 2 Days</option>
                    <option value="more-than-3days">&gt; 3 Days (Persistent)</option>
                  </select>
                </div>

                {/* Gum Color */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1c1c16] block">Gum Color</label>
                  <select
                    value={gumColor}
                    onChange={(e) => setGumColor(e.target.value)}
                    className="w-full h-12 px-3 rounded-xl border border-[#E8E0D3] bg-white text-[#4A3525] focus:border-[#315B2B]"
                  >
                    <option value="pink">Healthy Pink & Moist</option>
                    <option value="pale">Pale / White (Warning)</option>
                    <option value="brick">Bright Brick Red</option>
                    <option value="yellow">Yellowish / Jaundiced</option>
                  </select>
                </div>

                {/* Appetite */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1c1c16] block">Appetite State</label>
                  <select
                    value={appetite}
                    onChange={(e) => setAppetite(e.target.value)}
                    className="w-full h-12 px-3 rounded-xl border border-[#E8E0D3] bg-white text-[#4A3525] focus:border-[#315B2B]"
                  >
                    <option value="normal">Eating Normally</option>
                    <option value="reduced">Reluctant / Leaves food</option>
                    <option value="none">Refusing All Food (&gt;24h)</option>
                  </select>
                </div>

                {/* Energy */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-[#1c1c16] block">Demeanor / Energy</label>
                  <select
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(e.target.value)}
                    className="w-full h-12 px-3 rounded-xl border border-[#E8E0D3] bg-white text-[#4A3525] focus:border-[#315B2B]"
                  >
                    <option value="normal">Normal / Active</option>
                    <option value="quiet">Quiet / Sleeping More</option>
                    <option value="lethargic">Severely Lethargic</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 4: Red Flag Critical Screener */}
            <div className="bg-[#FAF6EC] border border-[#E8E0D3] rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2 text-[#D97A42]">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <h4 className="text-[14px] font-bold text-[#24451F]">
                  4. Red-Flag Emergency Screener (Check any that apply)
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'distendedAbdomen', label: 'Distended, rigid abdomen or unproductive dry heaving (bloat/GDV risk)' },
                  { key: 'toxicIngestion', label: 'Known ingestion of grapes, chocolate, xylitol, rodent poison, or human medicine' },
                  { key: 'collapse', label: 'Sudden collapse, dragging hind legs, or inability to stand' },
                  { key: 'respiratoryDistress', label: 'Heavy labored breathing, choking sounds, or blue/gray tongue' },
                  { key: 'seizures', label: 'Uncontrolled muscle twitching, tremors, or active seizures' },
                ].map((item) => (
                  <label
                    key={item.key}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      redFlags[item.key]
                        ? 'border-[#D97A42] bg-[#D97A42]/10 font-semibold'
                        : 'border-[#E8E0D3] bg-white'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={redFlags[item.key]}
                      onChange={(e) => setRedFlags({ ...redFlags, [item.key]: e.target.checked })}
                      className="mt-1 w-4 h-4 accent-[#D97A42] rounded"
                    />
                    <span className="text-[12px] text-[#4A3525] leading-snug">
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Action Submit */}
            <div className="pt-2">
              <button
                type="submit"
                id="generate-triage-report-btn"
                className="w-full h-14 rounded-full bg-[#315B2B] hover:bg-[#24451F] text-white font-bold text-[16px] shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                <Stethoscope className="w-5 h-5 text-[#F4B51B]" />
                <span>Evaluate Symptoms & Generate Triage Protocol</span>
              </button>
            </div>
          </form>
        ) : (
          /* Report Screen */
          <div className="space-y-8 pt-6 animate-in fade-in duration-200">
            {/* Urgency Badge & Headline */}
            <div
              className={`p-6 rounded-[24px] border ${
                triageReport.urgency === 'emergency'
                  ? 'bg-[#ffdad6]/40 border-[#ba1a1a] text-[#93000a]'
                  : triageReport.urgency === 'veterinary-soon'
                  ? 'bg-[#F4B51B]/15 border-[#F4B51B] text-[#4A3525]'
                  : 'bg-[#ceecb4]/30 border-[#315B2B] text-[#24451F]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[12px] font-extrabold uppercase tracking-wider ${
                    triageReport.urgency === 'emergency'
                      ? 'bg-[#ba1a1a] text-white'
                      : triageReport.urgency === 'veterinary-soon'
                      ? 'bg-[#F4B51B] text-[#24451F]'
                      : 'bg-[#315B2B] text-white'
                  }`}
                >
                  <AlertTriangle className="w-4 h-4" />
                  {triageReport.title}
                </span>

                <span className="text-[12px] font-semibold opacity-80">
                  Patient: {activeDog.name} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-2">
                {triageReport.headline}
              </h2>

              <p className="text-[15px] mt-2 leading-relaxed">
                {triageReport.summary}
              </p>

              {/* Emergency Hotline Button if Emergency */}
              {triageReport.urgency === 'emergency' && (
                <div className="mt-4 pt-4 border-t border-[#ba1a1a]/20 flex flex-wrap items-center gap-3">
                  <a
                    href="tel:8884264435"
                    className="h-11 px-6 rounded-full bg-[#ba1a1a] text-white font-bold text-[13px] flex items-center gap-2 shadow-md hover:bg-[#93000a] transition-colors"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Call ASPCA Emergency Hotline: (888) 426-4435
                  </a>
                  <span className="text-[12px] font-bold">
                    Primary Clinic on file: {activeDog.primaryVetClinic}
                  </span>
                </div>
              )}
            </div>

            {/* Immediate Care Measures */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* What to do */}
              <div className="bg-[#FFFFFF] border border-[#E8E0D3] rounded-2xl p-5 space-y-3">
                <h4 className="text-[14px] font-bold text-[#24451F] uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#315B2B]" />
                  Recommended Immediate Steps
                </h4>
                <ul className="space-y-2">
                  {triageReport.immediateActions.map((act, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13px] text-[#4A3525]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#315B2B] mt-2 shrink-0"></span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What to avoid */}
              <div className="bg-[#FFFFFF] border border-[#E8E0D3] rounded-2xl p-5 space-y-3">
                <h4 className="text-[14px] font-bold text-[#D97A42] uppercase tracking-wider flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#D97A42]" />
                  What to Strictly Avoid
                </h4>
                <ul className="space-y-2">
                  {triageReport.whatToAvoid.map((av, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-[13px] text-[#4A3525]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#D97A42] mt-2 shrink-0"></span>
                      <span>{av}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bland Diet Recipe if available */}
            {triageReport.blandDietRecipe && (
              <div className="p-5 rounded-2xl bg-[#FAF6EC] border border-[#E8E0D3] space-y-2">
                <h4 className="text-[13px] font-bold text-[#24451F] uppercase tracking-wider flex items-center gap-2">
                  <Info className="w-4 h-4 text-[#718C5C]" />
                  Veterinary Bland Diet Formula
                </h4>
                <p className="text-[14px] text-[#4A3525]">
                  {triageReport.blandDietRecipe}
                </p>
              </div>
            )}

            {/* Action Bar: Copy notes & re-evaluate */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E8E0D3]">
              <button
                id="reset-triage-btn"
                onClick={() => setTriageReport(null)}
                className="h-11 px-5 rounded-full border border-[#E8E0D3] text-[#4A3525] font-semibold text-[13px] hover:bg-[#FAF6EC] flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Re-Evaluate or Change Symptoms</span>
              </button>

              <button
                id="copy-clinical-notes-btn"
                onClick={handleCopyNotes}
                className="h-11 px-6 rounded-full bg-[#315B2B] hover:bg-[#24451F] text-white font-bold text-[13px] shadow-sm flex items-center gap-2 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-[#F4B51B]" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Clinical Notes for Vet'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
