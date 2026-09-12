import React, { useState } from 'react';
import { DogProfile, BodyConditionScore } from '../types';
import { X, Plus, ShieldCheck, Heart, User } from 'lucide-react';

interface CompanionModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeDog: DogProfile;
  allDogs: DogProfile[];
  onSelectDog: (dogId: string) => void;
  onAddDog: (newDog: DogProfile) => void;
  onUpdateDog: (updatedDog: DogProfile) => void;
}

export const CompanionModal: React.FC<CompanionModalProps> = ({
  isOpen,
  onClose,
  activeDog,
  allDogs,
  onSelectDog,
  onAddDog,
  onUpdateDog,
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [weightKg, setWeightKg] = useState<number>(25);
  const [ageYears, setAgeYears] = useState<number>(3);
  const [lifeStage, setLifeStage] = useState<'puppy' | 'adult' | 'senior'>('adult');
  const [bcsScore, setBcsScore] = useState<BodyConditionScore>(5);
  const [allergies, setAllergies] = useState('');
  const [primaryVetClinic, setPrimaryVetClinic] = useState('');

  if (!isOpen) return null;

  const handleStartAdd = () => {
    setName('');
    setBreed('');
    setWeightKg(20);
    setAgeYears(2);
    setLifeStage('adult');
    setBcsScore(5);
    setAllergies('');
    setPrimaryVetClinic('General Animal Care Center');
    setIsAddingNew(true);
    setIsEditing(false);
  };

  const handleStartEdit = (dog: DogProfile) => {
    setName(dog.name);
    setBreed(dog.breed);
    setWeightKg(dog.weightKg);
    setAgeYears(dog.ageYears);
    setLifeStage(dog.lifeStage);
    setBcsScore(dog.bcsScore);
    setAllergies(dog.allergies.join(', '));
    setPrimaryVetClinic(dog.primaryVetClinic);
    setIsEditing(true);
    setIsAddingNew(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAllergies = allergies
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (isAddingNew) {
      const newDog: DogProfile = {
        id: `dog-${Date.now()}`,
        name: name.trim() || 'Companion',
        breed: breed.trim() || 'Mixed Breed',
        ageYears: Number(ageYears) || 2,
        ageMonths: 0,
        weightKg: Number(weightKg) || 15,
        idealWeightKg: Number(weightKg) || 15,
        bcsScore: bcsScore,
        lifeStage: lifeStage,
        isNeutered: true,
        activityLevel: 'moderate',
        allergies: parsedAllergies,
        dietaryRestrictions: [],
        avatarUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=400&q=80',
        vitalityScore: 92,
        primaryVetClinic: primaryVetClinic || 'Local Veterinary Hospital',
      };
      onAddDog(newDog);
      onSelectDog(newDog.id);
      setIsAddingNew(false);
      onClose();
    } else if (isEditing) {
      const updatedDog: DogProfile = {
        ...activeDog,
        name: name.trim() || activeDog.name,
        breed: breed.trim() || activeDog.breed,
        weightKg: Number(weightKg) || activeDog.weightKg,
        ageYears: Number(ageYears) || activeDog.ageYears,
        lifeStage: lifeStage,
        bcsScore: bcsScore,
        allergies: parsedAllergies,
        primaryVetClinic: primaryVetClinic || activeDog.primaryVetClinic,
      };
      onUpdateDog(updatedDog);
      setIsEditing(false);
    }
  };

  return (
    <div
      id="companion-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        id="companion-modal-dialog"
        className="relative bg-[#FFFFFF] border border-[#E8E0D3] rounded-[28px] max-w-xl w-full p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-companion-modal-btn"
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#FAF6EC] hover:bg-[#F1E7D4] text-[#4A3525] flex items-center justify-center transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="font-serif text-2xl font-bold text-[#1c1c16]">
            {isAddingNew ? 'Add Canine Companion' : isEditing ? `Edit ${activeDog.name}’s Profile` : 'Companion Profiles'}
          </h2>
          <p className="text-[13px] text-[#4A3525]/80 mt-1">
            Clinical dosing, caloric calculations, and vaccine alerts are tailored per dog profile.
          </p>
        </div>

        {/* List View */}
        {!isAddingNew && !isEditing && (
          <div className="space-y-4">
            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {allDogs.map((dog) => {
                const isActive = dog.id === activeDog.id;
                return (
                  <div
                    key={dog.id}
                    id={`companion-entry-${dog.id}`}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                      isActive
                        ? 'border-[#315B2B] bg-[#ceecb4]/15 shadow-sm'
                        : 'border-[#E8E0D3] hover:border-[#315B2B]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={dog.avatarUrl}
                        alt={dog.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-full object-cover border border-[#E8E0D3]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-[16px] text-[#1c1c16]">{dog.name}</h4>
                          {isActive && (
                            <span className="text-[10px] bg-[#315B2B] text-white font-bold px-2 py-0.5 rounded-full">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[12px] text-[#4A3525]/80">
                          {dog.breed} • {dog.weightKg} kg • {dog.ageYears} yrs • BCS {dog.bcsScore}/9
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isActive && (
                        <button
                          id={`select-companion-${dog.id}`}
                          onClick={() => onSelectDog(dog.id)}
                          className="px-3 py-1.5 rounded-full bg-[#315B2B] text-white text-[12px] font-bold hover:bg-[#24451F] transition-colors"
                        >
                          Select
                        </button>
                      )}
                      <button
                        id={`edit-companion-${dog.id}`}
                        onClick={() => handleStartEdit(dog)}
                        className="px-3 py-1.5 rounded-full border border-[#E8E0D3] text-[#4A3525] text-[12px] font-semibold hover:bg-[#FAF6EC] transition-colors"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              id="add-new-companion-cta"
              onClick={handleStartAdd}
              className="w-full h-12 rounded-full border-2 border-dashed border-[#315B2B]/50 hover:border-[#315B2B] text-[#315B2B] font-bold text-[14px] flex items-center justify-center gap-2 transition-all hover:bg-[#ceecb4]/10"
            >
              <Plus className="w-4 h-4" />
              Add Another Canine Companion
            </button>
          </div>
        )}

        {/* Add/Edit Form */}
        {(isAddingNew || isEditing) && (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[12px] font-bold text-[#24451F] mb-1">Companion Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jasper"
                  className="w-full h-12 px-4 rounded-xl border border-[#E8E0D3] bg-white text-[#4A3525] text-[14px] focus:outline-none focus:border-[#315B2B] focus:ring-3 focus:ring-[#315B2B]/15"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#24451F] mb-1">Breed *</label>
                <input
                  type="text"
                  required
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder="e.g. Labrador Retriever"
                  className="w-full h-12 px-4 rounded-xl border border-[#E8E0D3] bg-white text-[#4A3525] text-[14px] focus:outline-none focus:border-[#315B2B] focus:ring-3 focus:ring-[#315B2B]/15"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[12px] font-bold text-[#24451F] mb-1">Weight (kg) *</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value))}
                  className="w-full h-12 px-4 rounded-xl border border-[#E8E0D3] bg-white text-[#4A3525] text-[14px] focus:outline-none focus:border-[#315B2B] focus:ring-3 focus:ring-[#315B2B]/15"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#24451F] mb-1">Age (Years) *</label>
                <input
                  type="number"
                  required
                  value={ageYears}
                  onChange={(e) => setAgeYears(parseInt(e.target.value))}
                  className="w-full h-12 px-4 rounded-xl border border-[#E8E0D3] bg-white text-[#4A3525] text-[14px] focus:outline-none focus:border-[#315B2B] focus:ring-3 focus:ring-[#315B2B]/15"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#24451F] mb-1">Life Stage</label>
                <select
                  value={lifeStage}
                  onChange={(e) => setLifeStage(e.target.value as any)}
                  className="w-full h-12 px-3 rounded-xl border border-[#E8E0D3] bg-white text-[#4A3525] text-[14px] focus:outline-none focus:border-[#315B2B]"
                >
                  <option value="puppy">Puppy</option>
                  <option value="adult">Adult</option>
                  <option value="senior">Senior</option>
                </select>
              </div>
            </div>

            {/* Body Condition Score (1-9) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[12px] font-bold text-[#24451F]">
                  Body Condition Score (BCS 1-9)
                </label>
                <span className="text-[12px] font-bold text-[#315B2B]">
                  {bcsScore}/9 ({bcsScore <= 3 ? 'Underweight' : bcsScore <= 5 ? 'Ideal' : bcsScore <= 7 ? 'Overweight' : 'Obese'})
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="9"
                value={bcsScore}
                onChange={(e) => setBcsScore(parseInt(e.target.value) as BodyConditionScore)}
                className="w-full accent-[#315B2B] h-2 bg-[#FAF6EC] rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#24451F] mb-1">Known Allergies / Sensitivities</label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g. Chicken meal, Dairy (comma separated)"
                className="w-full h-12 px-4 rounded-xl border border-[#E8E0D3] bg-white text-[#4A3525] text-[14px] focus:outline-none focus:border-[#315B2B]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#24451F] mb-1">Primary Veterinary Clinic</label>
              <input
                type="text"
                value={primaryVetClinic}
                onChange={(e) => setPrimaryVetClinic(e.target.value)}
                placeholder="e.g. Oakridge Canine Specialty Clinic"
                className="w-full h-12 px-4 rounded-xl border border-[#E8E0D3] bg-white text-[#4A3525] text-[14px] focus:outline-none focus:border-[#315B2B]"
              />
            </div>

            <div className="flex items-center gap-3 pt-3">
              <button
                type="button"
                id="cancel-companion-edit-btn"
                onClick={() => {
                  setIsAddingNew(false);
                  setIsEditing(false);
                }}
                className="h-12 px-6 rounded-full border border-[#E8E0D3] text-[#4A3525] font-semibold text-[14px] hover:bg-[#FAF6EC]"
              >
                Back
              </button>
              <button
                type="submit"
                id="save-companion-submit-btn"
                className="flex-1 h-12 px-6 rounded-full bg-[#315B2B] hover:bg-[#24451F] text-white font-bold text-[14px] shadow-md transition-all"
              >
                {isAddingNew ? 'Register Companion' : 'Update Profile'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
