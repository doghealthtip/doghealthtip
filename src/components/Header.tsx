import React, { useState } from 'react';
import { DogProfile } from '../types';
import { 
  Heart, 
  Menu, 
  X, 
  Activity, 
  Stethoscope, 
  Calculator, 
  BookOpen, 
  ChevronDown,
  PhoneCall
} from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  activeDog: DogProfile;
  allDogs: DogProfile[];
  onSelectDog: (dogId: string) => void;
  onOpenCompanionModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  activeDog,
  allDogs,
  onSelectDog,
  onOpenCompanionModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dogDropdownOpen, setDogDropdownOpen] = useState(false);

  const navItems = [
    { id: 'blog', label: 'Clinical Blog', icon: BookOpen },
    { id: 'dashboard', label: 'Care Hub', icon: Activity },
    { id: 'triage', label: 'Symptom Triage', icon: Stethoscope },
    { id: 'nutrition', label: 'Nutrition & Dosing', icon: Calculator },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF6EC]/95 backdrop-blur-md border-b border-[#E8E0D3]">
      {/* Top Clinical & Hotline Strip */}
      <div className="bg-[#24451F] text-[#FAF6EC] text-[12px] font-medium py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-[#F4B51B] animate-pulse"></span>
            <span>Veterinary Clinical Guidance & Evidence-Based Canine Health</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] sm:text-[12px]">
            <a 
              href="tel:8884264435" 
              className="flex items-center gap-1.5 text-[#F4B51B] hover:underline"
              title="ASPCA Poison Control Hotline (24/7)"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Poison Hotline: (888) 426-4435</span>
            </a>
            <span className="hidden sm:inline text-white/40">|</span>
            <span className="hidden sm:inline text-white/80">Dr. On-Call Hours: 8am - 10pm EST</span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              id="header-logo-btn"
              onClick={() => setCurrentTab('blog')}
              className="flex items-center gap-3 text-left group transition-transform focus:outline-none"
            >
              <div className="w-11 h-11 rounded-full bg-[#315B2B] text-white flex items-center justify-center shadow-md group-hover:bg-[#24451F] transition-colors">
                <Heart className="w-6 h-6 fill-[#F4B51B] text-[#F4B51B]" />
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#1c1c16] block leading-none">
                  Canine Vitality
                </span>
                <span className="text-[11px] font-semibold tracking-wider text-[#718C5C] uppercase block mt-0.5">
                  & Care Hub • Clinical Journal
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[14px] font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#315B2B] text-white shadow-sm'
                      : 'text-[#4A3525] hover:bg-[#F1E7D4] hover:text-[#24451F]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#F4B51B]' : 'text-[#718C5C]'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Hub: Dog Profile Switcher */}
          <div className="flex items-center gap-3">
            {/* Active Dog Pill Switcher */}
            <div className="relative">
              <button
                id="active-dog-selector-btn"
                onClick={() => setDogDropdownOpen(!dogDropdownOpen)}
                className="flex items-center gap-2.5 bg-[#FFFFFF] border border-[#E8E0D3] hover:border-[#315B2B] rounded-full p-1.5 pr-3 shadow-[0px_2px_8px_rgba(74,53,37,0.04)] transition-all"
              >
                <img
                  src={activeDog.avatarUrl}
                  alt={activeDog.name}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-[#E8E0D3]"
                />
                <div className="text-left hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-[#1c1c16] leading-none">
                      {activeDog.name}
                    </span>
                    <span className="text-[10px] bg-[#ceecb4] text-[#24451F] font-bold px-1.5 py-0.5 rounded-full">
                      {activeDog.vitalityScore}%
                    </span>
                  </div>
                  <span className="text-[11px] text-[#718C5C] font-medium leading-none block mt-0.5">
                    {activeDog.breed}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#4A3525] opacity-60 ml-0.5" />
              </button>

              {/* Dog Switcher Dropdown */}
              {dogDropdownOpen && (
                <div 
                  id="dog-selector-dropdown"
                  className="absolute right-0 mt-2 w-72 bg-[#FFFFFF] border border-[#E8E0D3] rounded-2xl shadow-xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-3 py-2 border-b border-[#E8E0D3]/60 mb-2">
                    <p className="text-[11px] uppercase tracking-wider font-bold text-[#718C5C]">
                      Companion Profiles
                    </p>
                  </div>
                  <div className="space-y-1">
                    {allDogs.map((dog) => (
                      <button
                        key={dog.id}
                        id={`switch-to-dog-${dog.id}`}
                        onClick={() => {
                          onSelectDog(dog.id);
                          setDogDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${
                          dog.id === activeDog.id
                            ? 'bg-[#FAF6EC] border border-[#315B2B]/40'
                            : 'hover:bg-[#F1E7D4]/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={dog.avatarUrl}
                            alt={dog.name}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-full object-cover border border-[#E8E0D3]"
                          />
                          <div className="text-left">
                            <p className="text-[13px] font-bold text-[#1c1c16] leading-tight">
                              {dog.name}
                            </p>
                            <p className="text-[11px] text-[#4A3525]/70">
                              {dog.breed} • {dog.weightKg} kg
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-bold text-[#315B2B]">
                            {dog.vitalityScore} pts
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-2 pt-2 border-t border-[#E8E0D3]/60">
                    <button
                      id="manage-companions-btn"
                      onClick={() => {
                        setDogDropdownOpen(false);
                        onOpenCompanionModal();
                      }}
                      className="w-full py-2 px-3 text-center text-[12px] font-bold text-[#315B2B] hover:bg-[#FAF6EC] rounded-xl transition-colors"
                    >
                      + Manage or Add New Companion
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Navigation Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-11 h-11 rounded-full bg-[#FFFFFF] border border-[#E8E0D3] flex items-center justify-center text-[#1c1c16]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div 
          id="mobile-navigation-drawer"
          className="lg:hidden bg-[#FFFFFF] border-b border-[#E8E0D3] px-4 py-4 space-y-2 shadow-lg"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-semibold text-left transition-colors ${
                  isActive
                    ? 'bg-[#315B2B] text-white'
                    : 'text-[#4A3525] hover:bg-[#F1E7D4]'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#F4B51B]' : 'text-[#718C5C]'}`} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
