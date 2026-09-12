import React, { useState } from 'react';
import { DogProfile, PreventiveRecord } from '../types';
import { 
  ShieldCheck, 
  Calendar, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Printer, 
  FileText,
  Building,
  User,
  X
} from 'lucide-react';

interface PreventiveCareViewProps {
  activeDog: DogProfile;
  preventives: PreventiveRecord[];
  onAddPreventive: (record: PreventiveRecord) => void;
}

export const PreventiveCareView: React.FC<PreventiveCareViewProps> = ({
  activeDog,
  preventives,
  onAddPreventive,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PreventiveRecord['category']>('core-vaccine');
  const [administeredDate, setAdministeredDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');
  const [veterinarian, setVeterinarian] = useState('Dr. Sarah Chen DVM');
  const [clinicName, setClinicName] = useState(activeDog.primaryVetClinic);
  const [lotNumber, setLotNumber] = useState('');
  const [notes, setNotes] = useState('');

  const dogPreventives = preventives.filter((p) => p.dogId === activeDog.id);

  const filteredRecords = dogPreventives.filter((p) => {
    if (filterCategory === 'all') return true;
    return p.category === filterCategory;
  });

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: PreventiveRecord = {
      id: `prev-${Date.now()}`,
      dogId: activeDog.id,
      title: title.trim() || 'Vaccine / Health Event',
      category: category,
      administeredDate: administeredDate,
      dueDate: dueDate || administeredDate,
      status: 'up-to-date',
      veterinarian: veterinarian.trim() || 'Attending DVM',
      clinicName: clinicName.trim() || activeDog.primaryVetClinic,
      lotNumber: lotNumber.trim() || undefined,
      notes: notes.trim() || undefined,
    };
    onAddPreventive(newRecord);
    setIsLogModalOpen(false);
    setTitle('');
    setNotes('');
  };

  const handlePrintPassport = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* Passport Header Banner */}
      <div className="bg-[#FFFFFF] border border-[#E8E0D3] rounded-[28px] p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={activeDog.avatarUrl}
              alt={activeDog.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover border-2 border-[#315B2B]"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1c1c16]">
                  {activeDog.name}’s Canine Health Passport
                </h1>
                <span className="text-[11px] bg-[#ceecb4] text-[#24451F] font-extrabold px-2.5 py-0.5 rounded-full">
                  Verified
                </span>
              </div>
              <p className="text-[13px] text-[#4A3525]/80 mt-1">
                {activeDog.breed} • {activeDog.ageYears} yrs • {activeDog.weightKg} kg • Microchip #{activeDog.microchipId || '985141004829103'}
              </p>
              <p className="text-[12px] text-[#718C5C] font-semibold mt-0.5">
                Primary Veterinary Home: {activeDog.primaryVetClinic}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="print-health-passport-btn"
              onClick={handlePrintPassport}
              className="h-11 px-4 rounded-full border border-[#E8E0D3] text-[#4A3525] hover:bg-[#FAF6EC] text-[13px] font-bold flex items-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4 text-[#315B2B]" />
              <span>Print Certificate</span>
            </button>

            <button
              id="add-health-record-btn"
              onClick={() => setIsLogModalOpen(true)}
              className="h-11 px-5 rounded-full bg-[#315B2B] hover:bg-[#24451F] text-white text-[13px] font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Log Booster or Lab</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Health Records' },
          { id: 'core-vaccine', label: 'Core Vaccines' },
          { id: 'parasite-prevention', label: 'Parasite Protection' },
          { id: 'lifestyle-vaccine', label: 'Lifestyle Vaccines' },
          { id: 'wellness-exam', label: 'Annual Blood Chemistry' },
        ].map((cat) => (
          <button
            key={cat.id}
            id={`filter-record-${cat.id}`}
            onClick={() => setFilterCategory(cat.id)}
            className={`h-9 px-4 rounded-full text-[13px] font-bold whitespace-nowrap transition-all ${
              filterCategory === cat.id
                ? 'bg-[#315B2B] text-white'
                : 'bg-white border border-[#E8E0D3] text-[#4A3525] hover:bg-[#FAF6EC]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Records Timeline / Cards */}
      <div className="space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E8E0D3] p-10 text-center text-[#4A3525]/60 space-y-2">
            <FileText className="w-12 h-12 mx-auto text-[#C2C9BC]" />
            <h3 className="font-serif text-lg font-bold text-[#1c1c16]">No records in this category</h3>
            <p className="text-[13px]">Click "Log Booster or Lab" above to record a new veterinary event.</p>
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div
              key={record.id}
              id={`record-card-${record.id}`}
              className="bg-[#FFFFFF] border border-[#E8E0D3] rounded-[22px] p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-[#315B2B]/40"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                    record.status === 'up-to-date'
                      ? 'bg-[#ceecb4]/40 text-[#24451F]'
                      : record.status === 'due-soon'
                      ? 'bg-[#F4B51B]/20 text-[#4A3525]'
                      : 'bg-[#ffdad6] text-[#93000a]'
                  }`}
                >
                  <ShieldCheck className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-[#1c1c16]">
                      {record.title}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        record.status === 'up-to-date'
                          ? 'bg-[#ceecb4] text-[#24451F]'
                          : record.status === 'due-soon'
                          ? 'bg-[#F4B51B] text-[#24451F]'
                          : 'bg-[#ba1a1a] text-white'
                      }`}
                    >
                      {record.status === 'up-to-date'
                        ? 'Immunity Protected'
                        : record.status === 'due-soon'
                        ? 'Booster Due Soon'
                        : 'Overdue'}
                    </span>
                  </div>

                  <p className="text-[12px] text-[#718C5C] font-medium flex items-center gap-3">
                    <span>Administered: {record.administeredDate}</span>
                    <span>•</span>
                    <span className="font-bold text-[#24451F]">Expires / Due: {record.dueDate}</span>
                  </p>

                  <p className="text-[12px] text-[#4A3525]/80">
                    Clinic: {record.clinicName} • Certified by {record.veterinarian}
                    {record.lotNumber && ` (Lot #${record.lotNumber})`}
                  </p>

                  {record.notes && (
                    <p className="text-[13px] text-[#4A3525] bg-[#FAF6EC] p-2.5 rounded-xl border border-[#E8E0D3]/60 mt-2">
                      {record.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add New Record Modal */}
      {isLogModalOpen && (
        <div
          id="log-record-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setIsLogModalOpen(false)}
        >
          <div
            id="log-record-modal-dialog"
            className="relative bg-[#FFFFFF] border border-[#E8E0D3] rounded-[28px] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsLogModalOpen(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#FAF6EC] hover:bg-[#F1E7D4] text-[#4A3525] flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h2 className="font-serif text-2xl font-bold text-[#1c1c16]">
                Log Veterinary Event for {activeDog.name}
              </h2>
              <p className="text-[13px] text-[#4A3525]/80 mt-1">
                Record core boosters, parasite chews, or laboratory chemistry panels.
              </p>
            </div>

            <form onSubmit={handleCreateRecord} className="space-y-4">
              <div>
                <label className="block text-[12px] font-bold text-[#24451F] mb-1">
                  Procedure or Vaccine Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Leptospirosis 4-Way Booster"
                  className="w-full h-11 px-3.5 rounded-xl border border-[#E8E0D3] bg-white text-[#4A3525] text-[13px] focus:outline-none focus:border-[#315B2B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#24451F] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full h-11 px-3 rounded-xl border border-[#E8E0D3] bg-white text-[#4A3525] text-[13px] focus:border-[#315B2B]"
                  >
                    <option value="core-vaccine">Core Vaccine (DHPP / Rabies)</option>
                    <option value="lifestyle-vaccine">Lifestyle (Bordetella / Lyme)</option>
                    <option value="parasite-prevention">Parasite Prevention</option>
                    <option value="wellness-exam">Annual Exam / Bloodwork</option>
                    <option value="dental">Dental Prophylaxis</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#24451F] mb-1">
                    Administered Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={administeredDate}
                    onChange={(e) => setAdministeredDate(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-[#E8E0D3] bg-white text-[#4A3525] text-[13px] focus:border-[#315B2B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#24451F] mb-1">
                    Next Due / Expiration Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-[#E8E0D3] bg-white text-[#4A3525] text-[13px] focus:border-[#315B2B]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#24451F] mb-1">
                    Vaccine Lot # (Optional)
                  </label>
                  <input
                    type="text"
                    value={lotNumber}
                    onChange={(e) => setLotNumber(e.target.value)}
                    placeholder="e.g. DEF-8910"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E8E0D3] bg-white text-[#4A3525] text-[13px] focus:border-[#315B2B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold text-[#24451F] mb-1">
                    Veterinarian Name
                  </label>
                  <input
                    type="text"
                    value={veterinarian}
                    onChange={(e) => setVeterinarian(e.target.value)}
                    placeholder="e.g. Dr. Sarah Chen DVM"
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E8E0D3] bg-white text-[#4A3525] text-[13px] focus:border-[#315B2B]"
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#24451F] mb-1">
                    Clinic Name
                  </label>
                  <input
                    type="text"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-[#E8E0D3] bg-white text-[#4A3525] text-[13px] focus:border-[#315B2B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#24451F] mb-1">
                  Clinical Notes / Titer Results
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Subcutaneous administration, no adverse reactions, robust antibody titer..."
                  className="w-full p-3 rounded-xl border border-[#E8E0D3] bg-white text-[#4A3525] text-[13px] focus:border-[#315B2B]"
                ></textarea>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="h-11 px-5 rounded-full border border-[#E8E0D3] text-[#4A3525] font-semibold text-[13px] hover:bg-[#FAF6EC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 px-5 rounded-full bg-[#315B2B] hover:bg-[#24451F] text-white font-bold text-[13px] shadow-sm transition-all"
                >
                  Save to Health Passport
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
