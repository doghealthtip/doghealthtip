import React, { useState } from 'react';
import { 
  DogProfile, 
  ToxicFoodItem, 
  SupplementDoseRule, 
  BodyConditionScore 
} from '../types';
import { TOXIC_FOOD_DATABASE, SUPPLEMENT_RULES } from '../data/mockData';
import { 
  Calculator, 
  Scale, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Droplet, 
  Info,
  ShieldCheck,
  Filter
} from 'lucide-react';

interface NutritionCalculatorViewProps {
  activeDog: DogProfile;
}

export const NutritionCalculatorView: React.FC<NutritionCalculatorViewProps> = ({
  activeDog,
}) => {
  // Caloric Calculator State initialized from activeDog
  const [weight, setWeight] = useState<number>(activeDog.weightKg);
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [lifeStage, setLifeStage] = useState<'puppy' | 'adult' | 'senior'>(activeDog.lifeStage);
  const [isNeutered, setIsNeutered] = useState<boolean>(activeDog.isNeutered);
  const [activity, setActivity] = useState<'sedentary' | 'moderate' | 'active' | 'working'>('moderate');
  const [bcs, setBcs] = useState<BodyConditionScore>(activeDog.bcsScore);

  // Toxic Food Search & Filter
  const [foodSearch, setFoodSearch] = useState('');
  const [foodCategory, setFoodCategory] = useState<string>('all');

  // Convert weight to kg for standard formula
  const weightInKg = unit === 'kg' ? weight : weight * 0.453592;

  // Resting Energy Requirement (RER) = 70 * (weight_kg ^ 0.75)
  const rer = Math.round(70 * Math.pow(Math.max(1, weightInKg), 0.75));

  // Multiplier Factor
  let multiplier = 1.6;
  if (lifeStage === 'puppy') multiplier = 2.0;
  else if (lifeStage === 'senior') multiplier = 1.4;
  else if (!isNeutered) multiplier = 1.8;

  if (activity === 'sedentary') multiplier -= 0.2;
  else if (activity === 'active') multiplier += 0.3;
  else if (activity === 'working') multiplier += 0.8;

  // BCS adjustment
  if (bcs >= 7) multiplier -= 0.3; // Weight loss protocol
  else if (bcs <= 3) multiplier += 0.2; // Gain protocol

  const mer = Math.round(rer * multiplier);
  const dailyWaterMl = Math.round(weightInKg * 55); // Standard 50-60 ml per kg

  // Filter Toxic Food DB
  const filteredFoods = TOXIC_FOOD_DATABASE.filter((food) => {
    const matchesSearch = food.name.toLowerCase().includes(foodSearch.toLowerCase()) ||
      food.description.toLowerCase().includes(foodSearch.toLowerCase());
    const matchesCat = foodCategory === 'all' || food.category === foodCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-16">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ceecb4]/40 text-[#24451F] text-[11px] font-bold">
          <Calculator className="w-3.5 h-3.5 text-[#315B2B]" />
          NRC & WSAVA Veterinary Standards
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1c1c16]">
          Precision Nutritional & Dosing Engine
        </h1>
        <p className="text-[14px] text-[#4A3525]/80">
          Metabolically calibrated calorie targets, clinical supplement dosing matrices, and instant human food safety screening.
        </p>
      </div>

      {/* Part 1: Caloric & Energy Requirement Calculator */}
      <section id="caloric-calculator-card" className="bg-[#FFFFFF] border border-[#E8E0D3] rounded-[28px] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#E8E0D3]/80 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#ceecb4]/30 text-[#24451F] flex items-center justify-center">
              <Flame className="w-5 h-5 text-[#315B2B]" />
            </div>
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1c1c16]">
                Canine Caloric Target (RER & MER)
              </h2>
              <p className="text-[12px] text-[#718C5C]">
                Calculated for {activeDog.name} using WSAVA Nutritional Assessment Guidelines
              </p>
            </div>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center bg-[#FAF6EC] p-1 rounded-full border border-[#E8E0D3]">
            <button
              onClick={() => setUnit('kg')}
              className={`px-3 py-1 rounded-full text-[12px] font-bold transition-all ${
                unit === 'kg' ? 'bg-[#315B2B] text-white' : 'text-[#4A3525]'
              }`}
            >
              Kilograms (kg)
            </button>
            <button
              onClick={() => setUnit('lbs')}
              className={`px-3 py-1 rounded-full text-[12px] font-bold transition-all ${
                unit === 'lbs' ? 'bg-[#315B2B] text-white' : 'text-[#4A3525]'
              }`}
            >
              Pounds (lbs)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-7 space-y-5">
            {/* Weight Input */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[13px] font-bold text-[#24451F]">
                  Companion Body Weight ({unit})
                </label>
                <span className="text-[13px] font-extrabold text-[#315B2B]">
                  {weight} {unit}
                </span>
              </div>
              <input
                type="range"
                min={unit === 'kg' ? 2 : 4}
                max={unit === 'kg' ? 70 : 155}
                step={unit === 'kg' ? 0.5 : 1}
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value))}
                className="w-full accent-[#315B2B] h-2.5 bg-[#FAF6EC] rounded-lg cursor-pointer"
              />
            </div>

            {/* Life Stage & Neutered Status */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-bold text-[#24451F] mb-1">Life Stage</label>
                <select
                  value={lifeStage}
                  onChange={(e) => setLifeStage(e.target.value as any)}
                  className="w-full h-11 px-3 rounded-xl border border-[#E8E0D3] bg-white text-[#4A3525] text-[13px] focus:border-[#315B2B]"
                >
                  <option value="puppy">Puppy (Growth Phase)</option>
                  <option value="adult">Adult (1 - 7 years)</option>
                  <option value="senior">Senior (&gt; 7 years)</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#24451F] mb-1">Reproductive Status</label>
                <select
                  value={isNeutered ? 'neutered' : 'intact'}
                  onChange={(e) => setIsNeutered(e.target.value === 'neutered')}
                  className="w-full h-11 px-3 rounded-xl border border-[#E8E0D3] bg-white text-[#4A3525] text-[13px] focus:border-[#315B2B]"
                >
                  <option value="neutered">Spayed / Neutered</option>
                  <option value="intact">Intact</option>
                </select>
              </div>
            </div>

            {/* Activity Level */}
            <div>
              <label className="block text-[12px] font-bold text-[#24451F] mb-1">Daily Activity Cadence</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'sedentary', label: 'Couch Relaxer', desc: '<30m walks' },
                  { id: 'moderate', label: 'Moderate Active', desc: '1-2 hrs stroll' },
                  { id: 'active', label: 'Agile Runner', desc: 'Trail & play' },
                  { id: 'working', label: 'Working / Sport', desc: 'Intense work' },
                ].map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setActivity(act.id as any)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      activity === act.id
                        ? 'border-[#315B2B] bg-[#ceecb4]/20 font-bold'
                        : 'border-[#E8E0D3] hover:border-[#315B2B]/40 bg-white'
                    }`}
                  >
                    <span className="text-[12px] text-[#1c1c16] block">{act.label}</span>
                    <span className="text-[10px] text-[#4A3525]/70 block">{act.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Body Condition Score Slider (1-9) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[12px] font-bold text-[#24451F]">
                  Body Condition Score (BCS 1-9)
                </label>
                <span className={`text-[12px] font-bold ${bcs >= 4 && bcs <= 5 ? 'text-[#315B2B]' : 'text-[#D97A42]'}`}>
                  Score {bcs}/9: {bcs <= 3 ? 'Thin (Increase Food)' : bcs <= 5 ? 'Ideal Proportions' : bcs <= 7 ? 'Overweight (Calorie Deficit)' : 'Clinically Obese'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="9"
                value={bcs}
                onChange={(e) => setBcs(parseInt(e.target.value) as BodyConditionScore)}
                className="w-full accent-[#315B2B] h-2 bg-[#FAF6EC] rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-[#4A3525]/70 mt-1">
                Ideal (4-5): Ribs palpable without excess fat covering; distinct abdominal tuck when viewed from above.
              </p>
            </div>
          </div>

          {/* Results Output Column */}
          <div className="lg:col-span-5 bg-[#FAF6EC] rounded-[24px] p-6 border border-[#E8E0D3] flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#718C5C]">
                Daily Metabolic Energy Target
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-4xl font-extrabold text-[#24451F]">
                  {mer}
                </span>
                <span className="text-lg font-bold text-[#718C5C]">kcal / day</span>
              </div>
              <p className="text-[12px] text-[#4A3525]/80 mt-1">
                Resting Energy Requirement (RER): <strong>{rer} kcal</strong>
              </p>
            </div>

            {/* Meal Split & Hydration Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-xl border border-[#E8E0D3]/80">
                <span className="text-[11px] text-[#718C5C] font-semibold block">Morning Meal</span>
                <span className="text-[16px] font-bold text-[#1c1c16]">{Math.round(mer * 0.5)} kcal</span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-[#E8E0D3]/80">
                <span className="text-[11px] text-[#718C5C] font-semibold block">Evening Meal</span>
                <span className="text-[16px] font-bold text-[#1c1c16]">{Math.round(mer * 0.5)} kcal</span>
              </div>
              <div className="col-span-2 bg-white p-3 rounded-xl border border-[#E8E0D3]/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplet className="w-4 h-4 text-[#315B2B]" />
                  <div>
                    <span className="text-[11px] text-[#718C5C] font-semibold block">Fresh Water Requirement</span>
                    <span className="text-[14px] font-bold text-[#1c1c16]">~{dailyWaterMl} ml / day</span>
                  </div>
                </div>
                <span className="text-[11px] text-[#4A3525]/70">55ml/kg baseline</span>
              </div>
            </div>

            {/* Nutritional Guidance Alert */}
            <div className="p-3.5 rounded-xl bg-white border border-[#ceecb4] text-[12px] text-[#24451F] leading-relaxed">
              <strong className="block mb-0.5">Clinical Note:</strong>
              Treats should never exceed 10% of daily caloric intake ({Math.round(mer * 0.1)} kcal). Always adjust baseline kibble or fresh food volume when adding supplements like salmon oil.
            </div>
          </div>
        </div>
      </section>

      {/* Part 2: Supplement Safe Dosing Matrix */}
      <section id="supplement-dosing-matrix" className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#315B2B]" />
            <h2 className="font-serif text-2xl font-bold text-[#1c1c16]">
              Clinical Supplement Dosing Matrix (For {weightInKg.toFixed(1)} kg)
            </h2>
          </div>
          <p className="text-[13px] text-[#4A3525]/80 mt-1">
            Calculated active therapeutic ranges tailored to your companion's exact weight.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUPPLEMENT_RULES.map((rule) => {
            const minDose = Math.round(rule.dosePerKgMin * weightInKg);
            const maxDose = Math.round(rule.dosePerKgMax * weightInKg);

            return (
              <div
                key={rule.id}
                id={`supp-rule-${rule.id}`}
                className="bg-[#FFFFFF] border border-[#E8E0D3] rounded-[22px] p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-serif text-lg font-bold text-[#1c1c16]">
                    {rule.name}
                  </h3>
                  <span className="text-[11px] bg-[#ceecb4]/40 text-[#24451F] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                    Active Dosing
                  </span>
                </div>

                <div className="bg-[#FAF6EC] p-3 rounded-xl border border-[#E8E0D3]/60">
                  <span className="text-[11px] text-[#718C5C] font-semibold block">
                    Calculated Daily Target:
                  </span>
                  <span className="text-xl font-extrabold text-[#24451F]">
                    {minDose} - {maxDose} {rule.unit}
                  </span>
                  <span className="text-[11px] text-[#4A3525]/60 block mt-0.5">
                    Formula: {rule.standardDoseFormula}
                  </span>
                </div>

                <div className="space-y-1.5 text-[12px]">
                  <p className="text-[#4A3525]/80">
                    <strong>Indication:</strong> {rule.primaryIndication}
                  </p>
                  <p className="text-[#315B2B] bg-[#ceecb4]/20 p-2 rounded-lg leading-relaxed">
                    <strong>Veterinary Pearl:</strong> {rule.clinicalPearls}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Part 3: Human Food Safety & Toxicity Checker */}
      <section id="human-food-safety-checker" className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#1c1c16]">
              Canine Food Safety & Toxicity Index
            </h2>
            <p className="text-[13px] text-[#4A3525]/80">
              Instant verification before offering human pantry items or fruits.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#718C5C] absolute left-3.5 top-3.5" />
            <input
              type="text"
              id="food-safety-search-input"
              value={foodSearch}
              onChange={(e) => setFoodSearch(e.target.value)}
              placeholder="Search food (e.g. grapes, peanut butter)..."
              className="w-full h-11 pl-10 pr-4 rounded-full border border-[#E8E0D3] bg-white text-[13px] text-[#4A3525] focus:outline-none focus:border-[#315B2B]"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['all', 'fruits', 'vegetables', 'pantry', 'proteins'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFoodCategory(cat)}
              className={`h-8 px-3.5 rounded-full text-[12px] font-bold capitalize whitespace-nowrap transition-all ${
                foodCategory === cat
                  ? 'bg-[#315B2B] text-white'
                  : 'bg-white border border-[#E8E0D3] text-[#4A3525] hover:bg-[#FAF6EC]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Food Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFoods.map((item) => (
            <div
              key={item.id}
              id={`food-card-${item.id}`}
              className={`p-5 rounded-[22px] border transition-all flex flex-col justify-between space-y-3 ${
                item.status === 'toxic'
                  ? 'bg-white border-[#ffdad6] shadow-sm hover:border-[#ba1a1a]'
                  : item.status === 'caution'
                  ? 'bg-white border-[#fce3b8] shadow-sm hover:border-[#F4B51B]'
                  : 'bg-white border-[#ceecb4] shadow-sm hover:border-[#315B2B]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <h4 className="font-serif text-lg font-bold text-[#1c1c16]">
                    {item.name}
                  </h4>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${
                      item.status === 'toxic'
                        ? 'bg-[#ba1a1a] text-white'
                        : item.status === 'caution'
                        ? 'bg-[#F4B51B] text-[#24451F]'
                        : 'bg-[#315B2B] text-white'
                    }`}
                  >
                    {item.riskLevel}
                  </span>
                </div>

                <p className="text-[13px] text-[#4A3525] leading-relaxed">
                  {item.description}
                </p>

                {item.toxicComponent && (
                  <p className="text-[11px] text-[#D97A42] font-semibold mt-2">
                    Toxin: {item.toxicComponent}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-[#E8E0D3]/60 text-[12px] text-[#24451F]">
                <strong className="block text-[11px] uppercase tracking-wider text-[#718C5C]">
                  Action / Recommendation:
                </strong>
                <p className="mt-0.5 leading-snug">{item.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
