export type LifeStage = 'puppy' | 'adult' | 'senior';
export type BodyConditionScore = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9; // 4-5 is ideal

export interface DogProfile {
  id: string;
  name: string;
  breed: string;
  ageYears: number;
  ageMonths: number;
  weightKg: number;
  idealWeightKg: number;
  bcsScore: BodyConditionScore;
  lifeStage: LifeStage;
  isNeutered: boolean;
  activityLevel: 'low' | 'moderate' | 'high' | 'working';
  allergies: string[];
  dietaryRestrictions: string[];
  avatarUrl: string;
  vitalityScore: number; // 0-100
  microchipId?: string;
  primaryVetClinic: string;
}

export type ProductCategory = 
  | 'all'
  | 'joint-mobility' 
  | 'gut-digestion' 
  | 'calm-cognitive' 
  | 'coat-dermatology' 
  | 'dental-longevity';

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: 'veterinarian-approved' | 'best-seller' | 'dietary-caution';
  badgeLabel?: string;
  sizeWeight: string;
  servingsCount: string;
  summary: string;
  description: string;
  keyIngredients: { name: string; amount: string; purpose: string }[];
  guaranteedAnalysis: { label: string; value: string }[];
  dosageGuide: { weightRange: string; dose: string }[];
  veterinarianNotes: string;
  inStock: boolean;
}

export interface EditorialArticle {
  id: string;
  title: string;
  slug: string;
  category: string;
  tags?: string[];
  readTimeMinutes: number;
  authorVet: string;
  vetCredentials: string;
  vetAvatar: string;
  publishDate: string;
  summary: string;
  heroImage: string;
  heroImageAlt?: string;
  keyTakeaways: string[];
  sections: { heading: string; paragraphs: string[] }[];
  contentHtml?: string;
  evidenceGrade: string;
  status?: 'published' | 'draft';
  seo?: {
    seoTitle: string;
    metaDescription: string;
    focusKeyword: string;
    canonicalUrl?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface ToxicFoodItem {
  id: string;
  name: string;
  category: 'fruits' | 'vegetables' | 'pantry' | 'proteins' | 'beverages';
  status: 'toxic' | 'caution' | 'safe';
  riskLevel: 'Emergency' | 'Moderate' | 'Safe & Nutritious';
  description: string;
  toxicComponent?: string;
  toxicDoseEstimate?: string;
  symptoms?: string[];
  recommendation: string;
}

export interface SupplementDoseRule {
  id: string;
  name: string;
  primaryIndication: string;
  standardDoseFormula: string; // e.g., "15 - 20 mg per kg daily"
  unit: string;
  dosePerKgMin: number;
  dosePerKgMax: number;
  vetCaution: string;
  clinicalPearls: string;
}

export interface PreventiveRecord {
  id: string;
  dogId: string;
  title: string;
  category: 'core-vaccine' | 'lifestyle-vaccine' | 'parasite-prevention' | 'wellness-exam' | 'dental';
  administeredDate: string;
  dueDate: string;
  status: 'up-to-date' | 'due-soon' | 'overdue';
  veterinarian: string;
  clinicName: string;
  lotNumber?: string;
  notes?: string;
}

export interface DailyWellnessTask {
  id: string;
  dogId: string;
  title: string;
  timeSlot: 'Morning' | 'Afternoon' | 'Evening';
  category: 'nutrition' | 'mobility' | 'hygiene' | 'vitality';
  completed: boolean;
  notes?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  frequency: 'one-time' | 'every-4-weeks' | 'every-8-weeks';
}

export type TriageUrgency = 'emergency' | 'veterinary-soon' | 'home-monitoring';

export interface TriageResult {
  urgency: TriageUrgency;
  title: string;
  headline: string;
  summary: string;
  immediateActions: string[];
  whatToAvoid: string[];
  blandDietRecipe?: string;
  questionsForVet: string[];
  redFlagWarning?: string;
}
