import {
  DogProfile,
  Product,
  EditorialArticle,
  ToxicFoodItem,
  SupplementDoseRule,
  PreventiveRecord,
  DailyWellnessTask,
} from '../types';

export const INITIAL_DOGS: DogProfile[] = [
  {
    id: 'dog-1',
    name: 'Barnaby',
    breed: 'Golden Retriever',
    ageYears: 4,
    ageMonths: 3,
    weightKg: 31.5,
    idealWeightKg: 31.0,
    bcsScore: 5,
    lifeStage: 'adult',
    isNeutered: true,
    activityLevel: 'high',
    allergies: ['Chicken meal (mild pruritus)'],
    dietaryRestrictions: ['Prefers single-source novel fish protein'],
    avatarUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80',
    vitalityScore: 94,
    microchipId: '985141004829103',
    primaryVetClinic: 'Oakridge Canine Specialty & Integrative Health',
  },
  {
    id: 'dog-2',
    name: 'Luna',
    breed: 'French Bulldog',
    ageYears: 2,
    ageMonths: 8,
    weightKg: 11.8,
    idealWeightKg: 11.2,
    bcsScore: 6,
    lifeStage: 'adult',
    isNeutered: true,
    activityLevel: 'moderate',
    allergies: ['Dust mites', 'Dairy protein'],
    dietaryRestrictions: ['Sensitive digestive tract', 'Requires slow feeder'],
    avatarUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80',
    vitalityScore: 88,
    microchipId: '985141004992110',
    primaryVetClinic: 'Metropolitan Brachycephalic Care Hospital',
  },
  {
    id: 'dog-3',
    name: 'Jasper',
    breed: 'German Shepherd Dog',
    ageYears: 9,
    ageMonths: 1,
    weightKg: 37.2,
    idealWeightKg: 36.5,
    bcsScore: 5,
    lifeStage: 'senior',
    isNeutered: true,
    activityLevel: 'moderate',
    allergies: [],
    dietaryRestrictions: ['Joint mobility supportive diet', 'Controlled sodium'],
    avatarUrl: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=400&q=80',
    vitalityScore: 82,
    microchipId: '985141003118492',
    primaryVetClinic: 'Cascade Veterinary Specialty & Oncology',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'prod-salmon-oil',
    title: 'Wild Alaskan Sockeye Salmon Oil',
    subtitle: 'Cold-pressed bioactive EPA & DHA for joint synovial fluid and dermal barrier resilience.',
    category: 'joint-mobility',
    price: 38.0,
    originalPrice: 44.0,
    rating: 4.9,
    reviewCount: 342,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    badge: 'veterinarian-approved',
    badgeLabel: 'Veterinarian Formulated',
    sizeWeight: '500 ml / 16.9 fl oz',
    servingsCount: '60 daily pumps for 30kg dog',
    summary: 'Sustainably harvested wild salmon oil rich in bio-available long-chain omega-3 fatty acids to suppress systemic canine inflammation.',
    description: 'Our veterinary-grade Sockeye Salmon Oil delivers unmatched molecular purity with verified peroxide values below international veterinary thresholds. Ideal for dogs showing early signs of stiffness or dull coats.',
    keyIngredients: [
      { name: 'Pure Alaskan Salmon Oil', amount: '4,600 mg/tsp', purpose: 'Bio-available fatty acid substrate' },
      { name: 'EPA (Eicosapentaenoic Acid)', amount: '425 mg', purpose: 'Inhibits inflammatory prostaglandins' },
      { name: 'DHA (Docosahexaenoic Acid)', amount: '465 mg', purpose: 'Supports neural and retinal membranes' },
      { name: 'Natural d-Alpha Tocopherol', amount: '15 IU', purpose: 'Non-GMO Vitamin E antioxidant protection' },
    ],
    guaranteedAnalysis: [
      { label: 'Crude Fat (Min)', value: '99.5%' },
      { label: 'Moisture (Max)', value: '0.4%' },
      { label: 'Total Omega-3 (Min)', value: '29.0%' },
      { label: 'Total Omega-6 (Min)', value: '2.5%' },
    ],
    dosageGuide: [
      { weightRange: 'Under 10 kg', dose: '1 pump (2 ml) daily' },
      { weightRange: '10 - 25 kg', dose: '2 pumps (4 ml) daily' },
      { weightRange: '25 - 40 kg', dose: '3 pumps (6 ml) daily' },
      { weightRange: 'Over 40 kg', dose: '4 pumps (8 ml) daily' },
    ],
    veterinarianNotes: 'Dr. Sarah Chen DVM: "We routinely prescribe this exact EPA:DHA ratio to canine orthopaedic patients. Visible improvement in stair ascension within 21 days."',
    inStock: true,
  },
  {
    id: 'prod-colostrum-gut',
    title: 'Bio-Fermented Bovine Colostrum & Probiotics',
    subtitle: 'Immunoglobulin G (IgG) and 10 billion CFU spore strains to rebuild leaky canine gut linings.',
    category: 'gut-digestion',
    price: 42.5,
    originalPrice: 48.0,
    rating: 4.8,
    reviewCount: 219,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    badge: 'best-seller',
    badgeLabel: 'Top Gut Protocol',
    sizeWeight: '180g Powder',
    servingsCount: '90 scoops',
    summary: 'First-milking pasture-fed bovine colostrum paired with Bacillus coagulans for tight junction repair.',
    description: 'Addresses soft stools, seasonal paw licking, and post-antibiotic dysbiosis by re-establishing mucosal immunoglobulin barriers.',
    keyIngredients: [
      { name: 'Pure Bovine Colostrum (25% IgG)', amount: '1,200 mg', purpose: 'Mucosal wall repair & passive immunity' },
      { name: 'Bacillus coagulans & clausii', amount: '10 Billion CFU', purpose: 'Spore-forming survival through stomach acid' },
      { name: 'L-Glutamine', amount: '350 mg', purpose: 'Primary fuel for intestinal enterocytes' },
      { name: 'Organic Marshmallow Root', amount: '200 mg', purpose: 'Soothes inflamed gastrointestinal lining' },
    ],
    guaranteedAnalysis: [
      { label: 'Crude Protein (Min)', value: '45.0%' },
      { label: 'Crude Fat (Min)', value: '18.0%' },
      { label: 'Crude Fiber (Max)', value: '2.0%' },
      { label: 'Moisture (Max)', value: '5.0%' },
    ],
    dosageGuide: [
      { weightRange: 'Under 10 kg', dose: '0.5 scoop mixed with lukewarm meal' },
      { weightRange: '10 - 25 kg', dose: '1 level scoop daily' },
      { weightRange: '25 - 40 kg', dose: '1.5 scoops daily' },
      { weightRange: 'Over 40 kg', dose: '2 scoops daily' },
    ],
    veterinarianNotes: 'Dr. Emily Vance DVM DACVN: "Crucial for dogs suffering from idiopathic intermittent diarrhea or chronic histaminic ear flare-ups."',
    inStock: true,
  },
  {
    id: 'prod-mobility-curcumin',
    title: 'Curcumin-Phospholipid Mobility Morsels',
    subtitle: 'Clinically calibrated Longvida® curcumin, green lipped mussel, and hyaluronic acid.',
    category: 'joint-mobility',
    price: 49.0,
    rating: 5.0,
    reviewCount: 418,
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=600&q=80',
    badge: 'veterinarian-approved',
    badgeLabel: 'Orthopaedic Clinical Choice',
    sizeWeight: '120 Soft Chews',
    servingsCount: '60-120 days supply',
    summary: 'Cold-pressed soft chews optimizing chondrocyte repair and joint fluid viscosity without NSAID side-effects.',
    description: 'Formulated with lipid-bound curcumin that crosses the blood-synovial barrier up to 65x more effectively than generic turmeric powder.',
    keyIngredients: [
      { name: 'Longvida® Optimized Curcumin', amount: '250 mg', purpose: 'Blocks inflammatory cytokines NF-κB' },
      { name: 'New Zealand Green Lipped Mussel', amount: '500 mg', purpose: 'Source of ETA glycosaminoglycans' },
      { name: 'Low Molecular Weight Hyaluronic Acid', amount: '40 mg', purpose: 'Viscous synovial lubrication' },
      { name: 'Glucosamine HCl (Regenasure)', amount: '600 mg', purpose: 'Cartilage matrix building block' },
    ],
    guaranteedAnalysis: [
      { label: 'Glucosamine HCl (Min)', value: '600 mg/chew' },
      { label: 'Chondroitin Sulfate (Min)', value: '300 mg/chew' },
      { label: 'MSM (Min)', value: '400 mg/chew' },
    ],
    dosageGuide: [
      { weightRange: 'Under 10 kg', dose: '1 chew every other day' },
      { weightRange: '10 - 25 kg', dose: '1 chew daily' },
      { weightRange: '25 - 40 kg', dose: '2 chews daily' },
      { weightRange: 'Over 40 kg', dose: '3 chews daily (split morning/evening)' },
    ],
    veterinarianNotes: 'Dr. Marcus Thorne DVM: "The gold standard for athletic sporting dogs and aging seniors showing morning joint stiffness."',
    inStock: true,
  },
  {
    id: 'prod-pumpkin-prebiotic',
    title: 'Organic Heirloom Pumpkin & Prebiotic Fibre',
    subtitle: 'Freeze-dried soluble prebiotic puree for instant stool firmness and gentle transit balancing.',
    category: 'gut-digestion',
    price: 24.0,
    rating: 4.7,
    reviewCount: 156,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
    badge: 'dietary-caution',
    badgeLabel: 'Acute Triage Safe',
    sizeWeight: '250g Granules',
    servingsCount: '50 servings',
    summary: 'Single-ingredient organic pumpkin flesh and seed with chicory inulin. Restores normal colonic moisture retention.',
    description: 'Rapidly normalizes both acute loose stool and sluggish transit. Simply rehydrate with warm bone broth or sprinkle directly.',
    keyIngredients: [
      { name: 'Organic Pure Heirloom Pumpkin', amount: '85%', purpose: 'Soluble pectin and insoluble dietary fiber' },
      { name: 'Organic Chicory Inulin Prebiotic', amount: '10%', purpose: 'Feeds butyrate-producing commensal bacteria' },
      { name: 'Organic Ginger Root', amount: '5%', purpose: 'Relieves gastric gas and nausea discomfort' },
    ],
    guaranteedAnalysis: [
      { label: 'Crude Fiber (Min)', value: '14.0%' },
      { label: 'Crude Protein (Min)', value: '8.5%' },
      { label: 'Potassium (Min)', value: '1.2%' },
    ],
    dosageGuide: [
      { weightRange: 'Under 10 kg', dose: '1 teaspoon rehydrated with water' },
      { weightRange: '10 - 25 kg', dose: '1 tablespoon rehydrated' },
      { weightRange: '25 - 40 kg', dose: '2 tablespoons rehydrated' },
      { weightRange: 'Over 40 kg', dose: '3 tablespoons rehydrated' },
    ],
    veterinarianNotes: 'Essential for every canine first-aid pantry during sudden dietary indiscretions or transition phases.',
    inStock: true,
  },
  {
    id: 'prod-calm-cognitive',
    title: 'Neuro-Calm & L-Theanine Serenity Chews',
    subtitle: 'Botanical neuro-modulator with Suntheanine®, Ashwagandha KSM-66, and GABA.',
    category: 'calm-cognitive',
    price: 36.0,
    rating: 4.8,
    reviewCount: 189,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80',
    badge: 'veterinarian-approved',
    badgeLabel: 'Behaviorist Approved',
    sizeWeight: '90 Chews',
    servingsCount: '45-90 days',
    summary: 'Reduces cortisol spikes during thunderstorms, veterinary visits, separation stress, and nighttime cognitive pacing.',
    description: 'Non-sedating cognitive balance formula designed to calm alpha brain waves without dulling motor coordination or appetite.',
    keyIngredients: [
      { name: 'Suntheanine® Pure L-Theanine', amount: '150 mg', purpose: 'Elevates calming serotonin and dopamine' },
      { name: 'Ashwagandha KSM-66® Extract', amount: '125 mg', purpose: 'Standardized adaptogen blunts ACTH surge' },
      { name: 'PharmaGABA®', amount: '50 mg', purpose: 'Central nervous system inhibitory transmitter' },
      { name: 'Organic Chamomile & Passionflower', amount: '100 mg', purpose: 'Smooth muscle relaxation' },
    ],
    guaranteedAnalysis: [
      { label: 'Moisture (Max)', value: '12.0%' },
      { label: 'Crude Fat (Min)', value: '14.0%' },
    ],
    dosageGuide: [
      { weightRange: 'Under 10 kg', dose: '1 chew 45 minutes prior to stressful event' },
      { weightRange: '10 - 25 kg', dose: '2 chews daily or as needed' },
      { weightRange: '25 - 40 kg', dose: '3 chews daily' },
      { weightRange: 'Over 40 kg', dose: '4 chews daily' },
    ],
    veterinarianNotes: 'Dr. Sarah Chen DVM: "Unlike synthetic sedatives, dogs remain responsive, curious, and comfortable in their bodies."',
    inStock: true,
  },
  {
    id: 'prod-dental-enzymatic',
    title: 'Bioactive Enzymatic Dental Water Elixir',
    subtitle: 'Dual-action glucose oxidase and zinc gluconate to eliminate tartar biofilm in water bowls.',
    category: 'dental-longevity',
    price: 29.5,
    rating: 4.9,
    reviewCount: 304,
    image: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=600&q=80',
    badge: 'best-seller',
    badgeLabel: 'Longevity Essential',
    sizeWeight: '473 ml Bottle',
    servingsCount: '95 bowl additions',
    summary: 'Tasteless, odorless liquid additive targeting periodontal pathogens linked to systemic canine renal stress.',
    description: 'Formulated with veterinary enzymes that break down plaque matrix before it calcifies into rock-hard calculus.',
    keyIngredients: [
      { name: 'Glucose Oxidase & Lactoperoxidase', amount: '450 U', purpose: 'Catalyzes natural antimicrobial hydrogen peroxide' },
      { name: 'Zinc Gluconate', amount: '0.8%', purpose: 'Neutralizes volatile sulfur compounds (bad breath)' },
      { name: 'Organic Green Tea EGCG', amount: '0.5%', purpose: 'Gingival tissue antioxidant' },
    ],
    guaranteedAnalysis: [
      { label: 'Enzymatic Activity', value: '450 units/ml' },
      { label: 'pH Balanced', value: '6.8 - 7.2' },
    ],
    dosageGuide: [
      { weightRange: 'All sizes', dose: '1 teaspoon (5 ml) per 500 ml fresh drinking water daily' },
    ],
    veterinarianNotes: 'Over 80% of dogs over age three suffer from periodontal disease. Daily enzymatic inhibition preserves systemic longevity.',
    inStock: true,
  },
];

export const EDITORIAL_ARTICLES: EditorialArticle[] = [
  {
    id: 'art-1',
    title: 'Navigating Grain-Free vs Ancient Grains: The Cardiomyopathy Dilemma',
    slug: 'grain-free-vs-ancient-grains-canine-cardiomyopathy',
    category: 'Canine Nutrition',
    tags: ['Cardiology', 'Dietary Fiber', 'Taurine', 'Ancient Grains'],
    readTimeMinutes: 7,
    authorVet: 'Dr. Emily Vance',
    vetCredentials: 'DVM, DACVN (Board Certified Veterinary Nutritionist)',
    vetAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
    publishDate: 'September 2026',
    summary: 'A critical, science-first analysis of legume pulse fractions, taurine synthesis in golden retrievers, and why ancient whole grains offer superior metabolic resilience.',
    heroImage: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80',
    heroImageAlt: 'Healthy golden retriever eating balanced veterinary nutrition',
    status: 'published',
    seo: {
      seoTitle: 'Grain-Free Dog Food & DCM: Ancient Grains Veterinary Guide',
      metaDescription: 'Explore the peer-reviewed science behind legume pulses, taurine synthesis, and safe ancient whole grains for canine heart health.',
      focusKeyword: 'grain-free dog food DCM',
    },
    keyTakeaways: [
      'High concentrations of peas, lentils, and potatoes may disrupt dietary amino acid bioavailability.',
      'Sorghum, millet, quinoa, and pearled barley deliver low-glycemic beta-glucans without anti-nutritional lectins.',
      'Regular cardiac auscultation and annual plasma/whole blood taurine assays are advised for predisposed breeds.',
    ],
    sections: [
      {
        heading: 'The Rise of Pulse-Dense Formulations',
        paragraphs: [
          'Over the past decade, pet food marketing popularized grain-free recipes by substituting carbohydrate-dense cereals with legume pulses: yellow peas, lentils, and chickpeas. While palatable, extensive clinical research initiated by veterinary cardiologists noted a disturbing rise in secondary Dilated Cardiomyopathy (DCM).',
          'The issue is rarely an absolute absence of grain, but rather the heavy extrusion fraction of concentrated pulse proteins, which interfere with bile acid excretion and endogenous taurine synthesis from cysteine and methionine.',
        ],
      },
      {
        heading: 'Ancient Grains: The Evidence-Based Alternative',
        paragraphs: [
          'Modern clinical consensus favors well-cooked whole grains like sprouted oats, millet, and pearled barley. These provide fermentable prebiotics that nourish colonocytes into producing short-chain fatty acids (SCFAs) like acetate, propionate, and butyrate.',
        ],
      },
      {
        heading: 'Clinical Recommendations for Pet Parents',
        paragraphs: [
          'When evaluating canine dry diets, inspect the first seven ingredients. Avoid formulations where split pulses (e.g., pea protein, pea flour, lentil fiber) occupy more than two spots in the ingredient deck.',
        ],
      },
    ],
    contentHtml: `
<h2>The Rise of Pulse-Dense Formulations</h2>
<p>Over the past decade, pet food marketing popularized grain-free recipes by substituting carbohydrate-dense cereals with legume pulses: yellow peas, lentils, and chickpeas. While palatable, extensive clinical research initiated by veterinary cardiologists noted a disturbing rise in secondary Dilated Cardiomyopathy (DCM).</p>
<p>The issue is rarely an absolute absence of grain, but rather the heavy extrusion fraction of concentrated pulse proteins, which interfere with bile acid excretion and endogenous taurine synthesis from cysteine and methionine.</p>

<h3>Pathophysiology of Secondary Nutritional DCM</h3>
<p>In predisposed breeds including Golden Retrievers, American Cocker Spaniels, and Doberman Pinschers, prolonged consumption of pulse-heavy recipes depletes circulating myocardial taurine reserves. The resulting loss of cardiomyocyte contractility leads to ventricular dilation.</p>
<p>For additional dietary balancing support, use our interactive <a href="#nutrition" class="internal-link font-bold text-[#315B2B] underline">Caloric & Nutritional Calculator</a> to evaluate daily caloric targets.</p>

<h2>Ancient Grains: The Evidence-Based Alternative</h2>
<p>Modern clinical consensus favors well-cooked ancient whole grains like sprouted oats, sorghum, millet, and pearled barley. Unlike refined corn or wheat gluten fractions, ancient grains deliver rich concentrations of beta-glucans, magnesium, and prebiotic polyphenols.</p>
<p>Refer to official <a href="https://wsava.org/global-guidelines/global-nutrition-guidelines/" target="_blank" rel="nofollow noopener noreferrer" class="external-link font-bold text-[#315B2B] underline">WSAVA Global Nutrition Guidelines</a> for peer-reviewed manufacturer evaluation standards.</p>

<h3>Fermentable Prebiotics and Colonocyte Health</h3>
<p>These intact cereals provide fermentable prebiotics that nourish colonocytes into producing short-chain fatty acids (SCFAs) like acetate, propionate, and butyrate. These metabolic byproducts lower intestinal pH, inhibiting pathogenic Clostridium overgrowth while reinforcing the mucosal immune shield.</p>

<h2>Clinical Action Plan for Pet Parents</h2>
<p>When selecting a commercial diet or formulating a balanced home-cooked ration under veterinary supervision, follow these evidence-based tenets:</p>
<ul>
  <li>Inspect the ingredient deck: Avoid recipes where split pulses occupy more than two of the primary five slots.</li>
  <li>Request manufacturer taurine testing: High-integrity brands routinely verify both whole blood and plasma taurine concentrations in long-term feeding trials.</li>
  <li>Schedule annual cardiac auscultation during routine wellness exams to detect early systolic murmurs or arrhythmias.</li>
</ul>
    `,
    evidenceGrade: 'Class A Clinical Trial',
  },
  {
    id: 'art-2',
    title: 'Early Detection of Canine Osteoarthritis: Subtle Gait & Behavioral Flags',
    slug: 'early-detection-canine-osteoarthritis-gait-flags',
    category: 'Mobility & Orthopaedics',
    tags: ['Joints', 'Rehabilitation', 'Pain Management', 'Senior Dogs'],
    readTimeMinutes: 6,
    authorVet: 'Dr. Marcus Thorne',
    vetCredentials: 'DVM, CVA, CCRT (Canine Rehabilitation Specialist)',
    vetAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
    publishDate: 'August 2026',
    summary: 'Dogs rarely vocalize chronic joint pain. Learn how hesitation at car doors, bunny-hopping on turf, and altered sleeping postures reveal sub-clinical cartilage degradation.',
    heroImage: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=800&q=80',
    heroImageAlt: 'Canine joint physical exam by veterinarian specialist',
    status: 'published',
    seo: {
      seoTitle: 'Early Canine Osteoarthritis Symptoms: Veterinary Detection Guide',
      metaDescription: 'Learn subtle behavioral markers and gait flags that indicate canine osteoarthritis long before visible lameness develops.',
      focusKeyword: 'canine osteoarthritis symptoms',
    },
    keyTakeaways: [
      'Canine evolutionary instinct masks musculoskeletal vulnerability until cartilage loss exceeds 40%.',
      'Look for subtle bilateral stiffness within the first 90 seconds of waking from recumbency.',
      'Multi-modal intervention combining EPA/DHA fatty acids with low-impact hydrotherapy yields the highest preservation.',
    ],
    sections: [
      {
        heading: 'The Silent Erosion of Articular Cartilage',
        paragraphs: [
          'Because dogs are pack animals wired to conceal weakness, osteoarthritis progresses silently for years. By the time a limp is obvious to the naked eye, significant osteophyte remodeling and synovitis have already occurred.',
          'Early markers include avoiding hardwood floors, licking the carpal joints, or subtle changes in how their claws click unevenly against tile.',
        ],
      },
    ],
    contentHtml: `
<h2>The Silent Erosion of Articular Cartilage</h2>
<p>Because dogs are pack animals evolutionarily hardwired to conceal physical vulnerability, canine osteoarthritis progresses silently for years. By the time a limp is obvious to the casual observer, significant osteophyte remodeling, subchondral sclerosis, and synovial inflammation have already taken hold.</p>
<p>Veterinary rehabilitation specialists emphasize proactive palpation and visual kinetic analysis long before radiographic changes emerge.</p>

<h3>Biochemical Mechanisms of Synovial Breakdown</h3>
<p>Osteoarthritis is not merely mechanical 'wear and tear'. It is an enzymatically active inflammatory process governed by matrix metalloproteinases (MMPs) and inflammatory cytokines (IL-1β, TNF-α). These enzymes degrade the chondroitin-keratan aggrecan matrix responsible for cartilage elasticity.</p>

<h2>Subtle Behavioral Indicators at Home</h2>
<p>Watch closely for these micro-behavioral changes during daily household routines:</p>
<ul>
  <li>Hesitation before hopping into vehicles or ascending stairways that previously posed no resistance.</li>
  <li>Pacing or repositioning repeatedly before curling into recumbency on their orthopedic bed.</li>
  <li>Licking or grooming anterior carpal (wrist) joints or hocks, often mistaken for seasonal allergy licking.</li>
  <li>Claw wear discrepancy: Noticeable asymmetry in how claws click against hardwood or laminate flooring.</li>
</ul>

<h3>Morning Waking Kinetic Assessment</h3>
<p>Observe your companion during the first 90 seconds after standing up in the morning. Bilateral pelvic stiffness that improves after 5 to 10 walking paces is the hallmark indicator of early synovial fluid viscosity depletion.</p>
<p>If you suspect active joint discomfort, perform an instant triage check with our <a href="#triage" class="internal-link font-bold text-[#315B2B] underline">Digital Symptom Triage</a> to receive veterinary guidance.</p>

<h2>Evidence-Based Multi-Modal Intervention</h2>
<p>Early intervention yields significantly better long-term comfort compared to late-stage crisis management:</p>
<ul>
  <li>High-dose marine Omega-3 fatty acids delivering at least 100 mg combined EPA + DHA per kilogram of body weight.</li>
  <li>Low-impact underwater treadmill hydrotherapy to strengthen periarticular musculature without joint concussive force.</li>
  <li>Environmental modifications: Non-slip runner rugs across smooth hardwood corridors.</li>
</ul>
    `,
    evidenceGrade: 'Systematic Review',
  },
  {
    id: 'art-3',
    title: 'The Canine Microbiome Axis: How Gut Dysbiosis Triggers Atopic Dermatitis',
    slug: 'canine-microbiome-axis-gut-dysbiosis-atopic-dermatitis',
    category: 'Immunology & Dermatology',
    tags: ['Microbiome', 'Allergies', 'Skin Health', 'Probiotics'],
    readTimeMinutes: 8,
    authorVet: 'Dr. Sarah Chen',
    vetCredentials: 'DVM, DACVIM (Internal Medicine Fellow)',
    vetAvatar: 'https://images.unsplash.com/photo-1594824813725-d72b20464c23?auto=format&fit=crop&w=200&q=80',
    publishDate: 'August 2026',
    summary: 'Why recurrent yeast otitis (ear infections) and red interdigital paw pads often originate from mucosal permeability rather than external grass pollen alone.',
    heroImage: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    heroImageAlt: 'Veterinarian examining canine dermatological health and coat',
    status: 'published',
    seo: {
      seoTitle: 'Canine Microbiome & Dog Skin Allergies: Gut-Skin Axis Guide',
      metaDescription: 'Discover how gut dysbiosis triggers atopic dermatitis, itchy paws, and ear yeast in dogs, with proven nutritional recovery steps.',
      focusKeyword: 'dog gut microbiome skin allergies',
    },
    keyTakeaways: [
      'Over 70% of canine adaptive immune cells reside in the Gut-Associated Lymphoid Tissue (GALT).',
      'Microbial dysbiosis permits endotoxins (LPS) into systemic circulation, manifesting as cutaneous inflammation.',
      'Targeted spore probiotics paired with bovine colostrum can down-regulate IL-31 itch cytokines without immunosuppressive drugs.',
    ],
    sections: [
      {
        heading: 'The Gut-Skin Biological Axis',
        paragraphs: [
          'When the canine intestinal epithelial tight junctions loosen, partially digested food proteins and gram-negative lipopolysaccharides cross into mesenteric lymph nodes. The systemic mast cell degranulation that follows causes intense pruritus in the thinnest skin areas: ear canals, groin, and paw webs.',
        ],
      },
    ],
    contentHtml: `
<h2>The Gut-Skin Biological Axis</h2>
<p>When canine intestinal epithelial tight junctions loosen due to antibiotic exposure, processed diets, or chronic stress, partially digested food antigens and lipopolysaccharide (LPS) endotoxins leak into mesenteric lymphatics. This phenomenon—often termed mucosal hyperpermeability or 'leaky gut'—triggers immediate systemic mast cell degranulation.</p>
<p>The clinical result is intense pruritus concentrated in the most sensitive, vascular epidermal regions: the external auditory ear canals, interdigital paw webbing, and ventral groin.</p>

<h3>The Role of GALT in Cutaneous Homeostasis</h3>
<p>Because over 70% of canine adaptive immune cells reside within the Gut-Associated Lymphoid Tissue (GALT), cutaneous health is a direct mirror of microfloral balance. An overgrowth of pathogenic Proteobacteria relative to beneficial Bifidobacteria shifts mucosal cytokine production toward high-pruritus interleukins like IL-31.</p>

<h2>Diagnostic Clues: Allergy vs Dysbiosis</h2>
<p>Traditional veterinary approaches frequently treat skin flare-ups as purely environmental allergies with topical steroids or Apoquel. Consider investigating the microbiome when your companion displays:</p>
<ul>
  <li>Chronic yeast otitis (brown, sweet-smelling ear discharge) recurring within 30 days of completing topical ear ointment.</li>
  <li>Saliva-stained rusty fur between paw pads caused by incessant licking and chewing.</li>
  <li>Intermittent loose morning stool followed by soft, unformed evening bowel movements.</li>
</ul>

<h2>Clinical Nutritional Restoration Protocol</h2>
<p>Repairing the canine intestinal barrier requires a systematic, phased nutritional intervention:</p>
<ol>
  <li><strong>Soil-Based Spore Organisms:</strong> Bacillus coagulans and Bacillus subtilis survive stomach acid to re-seed the distal colon.</li>
  <li><strong>Immunoglobulin Therapy:</strong> Standardized bovine colostrum delivers secretory IgA (sIgA) to neutralize endotoxins before they cross epithelial tight junctions.</li>
  <li><strong>Prebiotic Inulin & Pectin:</strong> Feeds commensal Faecalibacterium prausnitzii to produce anti-inflammatory butyrate.</li>
</ol>
    `,
    evidenceGrade: 'Veterinary Consensus',
  },
  {
    id: 'art-4',
    title: 'Canine Longevity & Cellular Senescence: The Science of Healthy Canine Aging',
    slug: 'canine-longevity-cellular-senescence-healthy-aging',
    category: 'Longevity & Geriatrics',
    tags: ['Longevity', 'Geriatrics', 'Autophagy', 'Cellular Health'],
    readTimeMinutes: 7,
    authorVet: 'Dr. Elena Rostova',
    vetCredentials: 'DVM, PhD (Comparative Gerontology)',
    vetAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
    publishDate: 'July 2026',
    summary: 'How mitochondrial oxidative stress and telomere attrition impact canine lifespan, and why caloric restriction coupled with targeted polyphenols delays biological age.',
    heroImage: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80',
    heroImageAlt: 'Vibrant senior canine walking outdoors with healthy energy',
    status: 'published',
    seo: {
      seoTitle: 'Canine Longevity & Anti-Aging: Cellular Health Guide',
      metaDescription: 'Discover veterinary breakthroughs in canine longevity: cellular autophagy, caloric modulation, and anti-senescence protocols.',
      focusKeyword: 'canine longevity healthy aging',
    },
    keyTakeaways: [
      'Maintaining a lean Body Condition Score (BCS 4.5/9) extends canine median lifespan by an average of 1.8 years.',
      'Spermidine and resveratrol activate SIRT1 longevity pathways in senior canines.',
      'Cognitive enrichment combined with gentle daily sniff-walks preserves hippocampal neurogenesis.',
    ],
    sections: [
      {
        heading: 'Caloric Modulation and Life Extension',
        paragraphs: [
          'The landmark 14-year Labrador Retriever life span study proved that a 25% reduction in caloric intake not only delayed chronic disease onset, but prolonged vibrant lifespan by nearly two full years.',
        ],
      },
    ],
    contentHtml: `
<h2>Caloric Modulation and Canine Life Extension</h2>
<p>The landmark 14-year Purina Labrador Retriever life span study proved conclusively that a 25% reduction in daily caloric intake from puppyhood extended median lifespan by an astounding 1.8 years—the human equivalent of nearly 12 healthy years. Moreover, onset of chronic conditions including osteoarthritis, neoplasia, and hepatic lipidosis was delayed by an average of three full years.</p>

<h3>Body Condition Score (BCS) Target</h3>
<p>Veterinary gerontologists recommend maintaining canines at an ideal BCS of 4.5 out of 9: ribs easily palpable with minimal overlying fat, an evident abdominal tuck from profile, and a distinct waistline when viewed from above.</p>

<h2>Cellular Autophagy & Dietary Senolytics</h2>
<p>As canines age, damaged cells enter a state of irreversible growth arrest known as senescence. These 'zombie cells' secrete a toxic cocktail of inflammatory chemokines termed the Senescence-Associated Secretory Phenotype (SASP), which damages neighboring healthy tissue.</p>

<h3>Nutritional Activators of Autophagy</h3>
<p>Cellular housekeeping (autophagy) can be stimulated through targeted nutritional bioactives:</p>
<ul>
  <li><strong>Fisetin & Quercetin:</strong> Potent flavonoids that selectively clear senescent endothelial and immune cells.</li>
  <li><strong>Resveratrol & Pterostilbene:</strong> Sirtuin-1 (SIRT1) activators that enhance mitochondrial biogenesis and ATP synthesis.</li>
  <li><strong>Omega-3 Docosahexaenoic Acid (DHA):</strong> Preserves synaptic plasticity in the aging canine frontal cortex.</li>
</ul>

<h2>Cognitive Enrichment & Neuroprotection</h2>
<p>Maintaining neuroplasticity is just as vital as physical conditioning. Implementing daily 20-minute slow 'sniff-walks' (olfactory foraging) activates the canine piriform cortex, reducing cortisol while stimulating dopamine release.</p>
    `,
    evidenceGrade: 'Class A Clinical Trial',
  },
  {
    id: 'art-5',
    title: 'Hydration Dynamics & Renal Health: Critical Biomarkers for Early Detection',
    slug: 'hydration-dynamics-canine-renal-health-biomarkers',
    category: 'Preventive & Nephrology',
    tags: ['Kidney Health', 'Diagnostics', 'Hydration', 'Preventive Care'],
    readTimeMinutes: 5,
    authorVet: 'Dr. Aris Thorne',
    vetCredentials: 'DVM, Board-Certified Veterinary Clinical Pathologist',
    vetAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
    publishDate: 'June 2026',
    summary: 'Evaluating SDMA (Symmetric Dimethylarginine), urine specific gravity (USG), and the daily 55ml/kg water requirement to protect canine renal function.',
    heroImage: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=800&q=80',
    heroImageAlt: 'Clean fresh water bowl and happy healthy dog drinking',
    status: 'published',
    seo: {
      seoTitle: 'Canine Kidney Health & SDMA Biomarkers: Early Detection Guide',
      metaDescription: 'Learn how SDMA testing and proactive hydration preserve canine renal nephrons years before traditional BUN/Creatinine elevation.',
      focusKeyword: 'canine renal health SDMA testing',
    },
    keyTakeaways: [
      'SDMA biomarkers detect canine kidney compromise when only 25-40% of nephron function is lost, compared to BUN/Creatinine which require 75% loss.',
      'A normal canine requires 50 to 60 ml of clean water per kilogram of body weight every 24 hours.',
      'Adding lukewarm bone broth or hydrating dry kibble reduces postprandial renal filtration strain.',
    ],
    sections: [
      {
        heading: 'The Importance of Proactive Renal Screening',
        paragraphs: [
          'Canine chronic kidney disease often goes unnoticed until late stages because traditional creatinine markers do not elevate until 75% of renal capacity is already destroyed.',
        ],
      },
    ],
    contentHtml: `
<h2>The Importance of Proactive Renal Screening</h2>
<p>Canine chronic kidney disease (CKD) often progresses silently for years because traditional serum biomarkers—Blood Urea Nitrogen (BUN) and Creatinine—do not elevate above reference ranges until approximately 75% of functional renal nephron capacity has already been irreversibly compromised.</p>

<h3>The Breakthrough of SDMA Biomarkers</h3>
<p>Symmetric Dimethylarginine (SDMA) is a methylated arginine amino acid produced by nucleated cells and excreted almost exclusively via glomerular filtration. Crucially, SDMA elevates when as little as 25% to 40% of renal function is lost, providing veterinarians and pet owners a therapeutic window of months or years to intervene with protective renal protocols.</p>

<h2>Daily Canine Water Requirements</h2>
<p>A healthy canine requires between <strong>50 and 60 milliliters of clean water per kilogram of body weight</strong> every 24 hours. For a 25 kg Labrador, that equates to approximately 1.3 to 1.5 liters daily.</p>
<p>Dogs on exclusively dry kibble diets (which contain less than 10% moisture) frequently operate in a state of mild, chronic sub-clinical dehydration. Over years, this concentrates glomerular filtration pressures, accelerating tubular wear.</p>

<h2>Three Actionable Hydration Enhancements</h2>
<ul>
  <li><strong>Hydrate Dry Kibble:</strong> Always add equal parts warm water or low-sodium, allium-free bone broth to dry food 10 minutes prior to serving.</li>
  <li><strong>Circulating Water Fountains:</strong> Running water naturally entices canine instinct, increasing voluntary fluid intake by up to 35%.</li>
  <li><strong>Annual USG Testing:</strong> Request routine Urine Specific Gravity testing (USG > 1.030 indicates healthy concentrating ability).</li>
</ul>
    `,
    evidenceGrade: 'Veterinary Consensus',
  },
];

export const TOXIC_FOOD_DATABASE: ToxicFoodItem[] = [
  {
    id: 'tf-grapes',
    name: 'Grapes & Raisins',
    category: 'fruits',
    status: 'toxic',
    riskLevel: 'Emergency',
    description: 'Extremely dangerous. Causes idiosyncratic, irreversible acute kidney injury (renal failure). Even a single grape can be lethal to susceptible dogs.',
    toxicComponent: 'Tartaric acid & potassium bitartrate',
    toxicDoseEstimate: 'Any ingested quantity is considered toxic',
    symptoms: ['Vomiting within hours', 'Lethargy', 'Anorexia', 'Cessation of urine output (anuria)', 'Abdominal pain'],
    recommendation: 'EMERGENCY: Seek veterinary decontamination (induced emesis within 2 hours and IV fluid diuresis) immediately.',
  },
  {
    id: 'tf-chocolate',
    name: 'Dark Chocolate & Cocoa Powder',
    category: 'pantry',
    status: 'toxic',
    riskLevel: 'Emergency',
    description: 'Methylxanthine toxicity. Dark baking chocolate and cocoa powder contain lethal concentrations of theobromine which dogs metabolize 10x slower than humans.',
    toxicComponent: 'Theobromine & Caffeine',
    toxicDoseEstimate: 'Dark: > 1.5 g/kg body weight; Milk: > 15 g/kg',
    symptoms: ['Severe tachycardia', 'Panting', 'Hyperactivity', 'Muscle tremors', 'Seizures', 'Cardiac arrhythmias'],
    recommendation: 'EMERGENCY: Call emergency clinic or ASPCA Poison Control immediately. Do not delay.',
  },
  {
    id: 'tf-xylitol',
    name: 'Xylitol (Birch Sugar / Wood Sugar)',
    category: 'pantry',
    status: 'toxic',
    riskLevel: 'Emergency',
    description: 'Found in sugar-free peanut butters, baked goods, gums, and toothpastes. Triggers massive, catastrophic insulin release within 30 minutes.',
    toxicComponent: 'Xylitol / Birch sugar polyol',
    toxicDoseEstimate: '> 0.1 g/kg (hypoglycemia), > 0.5 g/kg (acute hepatic necrosis)',
    symptoms: ['Sudden collapse', 'Profound weakness / ataxia', 'Seizures from hypoglycemia', 'Liver failure jaundice'],
    recommendation: 'CRITICAL EMERGENCY: Give maple syrup/honey on gums if conscious, rush immediately to nearest veterinary emergency hospital.',
  },
  {
    id: 'tf-onions',
    name: 'Onions, Garlic & Leeks (Allium Family)',
    category: 'vegetables',
    status: 'toxic',
    riskLevel: 'Emergency',
    description: 'Causes oxidative hemolysis and Heinz body hemolytic anemia. Garlic powder is particularly potent (5x more concentrated than fresh cloves).',
    toxicComponent: 'N-propyl disulfide & thiosulfates',
    toxicDoseEstimate: '> 5g/kg of fresh allium or > 0.5g/kg garlic powder',
    symptoms: ['Pale or jaundiced mucous membranes', 'Dark reddish/brown urine', 'Rapid breathing', 'Weakness', 'Exercise intolerance'],
    recommendation: 'Contact vet promptly. Anemia symptoms can develop 3 to 5 days post-ingestion as red blood cells degrade.',
  },
  {
    id: 'tf-macadamia',
    name: 'Macadamia Nuts',
    category: 'pantry',
    status: 'toxic',
    riskLevel: 'Emergency',
    description: 'Induces severe neurological paresis, hindlimb weakness, hyperthermia, and tremors in dogs within 12 hours.',
    toxicComponent: 'Unknown toxin affecting motor neuron transmission',
    toxicDoseEstimate: '> 2.4 g/kg body weight',
    symptoms: ['Hind leg paralysis / inability to stand', 'High fever', 'Vomiting', 'Joint stiffness'],
    recommendation: 'Requires veterinary examination and supportive fluid care. Full recovery usually occurs within 48 hours under observation.',
  },
  {
    id: 'tf-avocado',
    name: 'Avocado (Pit & Skin)',
    category: 'fruits',
    status: 'caution',
    riskLevel: 'Moderate',
    description: 'The large wooden pit presents an acute surgical foreign-body obstruction hazard. Skin and leaves contain persin.',
    toxicComponent: 'Persin toxin (in bark/skin) & physical obstruction hazard of pit',
    recommendation: 'Small amounts of ripe green flesh are technically non-toxic, but the pit is a life-threatening intestinal blockage danger. Avoid entirely.',
  },
  {
    id: 'tf-blueberries',
    name: 'Wild Blueberries',
    category: 'fruits',
    status: 'safe',
    riskLevel: 'Safe & Nutritious',
    description: 'Superfood for dogs. Rich in anthocyanins, quercetin, fiber, and vitamins C & K. Excellent low-calorie cognitive reward.',
    recommendation: 'Safe and highly recommended! Feed fresh or frozen (approx. 5-10 berries daily for medium dogs).',
  },
  {
    id: 'tf-pumpkin',
    name: 'Pure Cooked / Canned Pumpkin',
    category: 'vegetables',
    status: 'safe',
    riskLevel: 'Safe & Nutritious',
    description: 'Excellent soluble fiber that binds excess water in diarrhea and draws water into dry stool during constipation.',
    recommendation: 'Safe! Use 100% pure pumpkin puree (never canned spiced pumpkin pie mix which contains toxic spices and sugar).',
  },
  {
    id: 'tf-bone-broth',
    name: 'Pure Simmered Bone Broth',
    category: 'proteins',
    status: 'safe',
    riskLevel: 'Safe & Nutritious',
    description: 'Packed with collagen, glucosamine, chondroitin, and hydration electrolytes. Outstanding appetite booster during convalescence.',
    recommendation: 'Safe and excellent! Must be made WITHOUT onions, garlic, or excess sodium. Serve lukewarm over regular meals.',
  },
  {
    id: 'tf-carrots',
    name: 'Crunchy Raw or Steamed Carrots',
    category: 'vegetables',
    status: 'safe',
    riskLevel: 'Safe & Nutritious',
    description: 'Rich in beta-carotene (Vitamin A precursor), potassium, and natural fiber. Raw chilled carrots provide mechanical plaque scraping.',
    recommendation: 'Safe and great dental enrichment chew. Cut into bite-sized segments for small breeds to prevent gulping.',
  },
  {
    id: 'tf-peanut-butter',
    name: 'Plain 100% Peanut Butter (Xylitol-Free)',
    category: 'pantry',
    status: 'safe',
    riskLevel: 'Safe & Nutritious',
    description: 'Wholesome protein, healthy fats, niacin, and vitamins B and E. Perfect for pill administration.',
    recommendation: 'Safe IF strictly single-ingredient roasted peanuts. ALWAYS verify ingredient label contains ZERO xylitol or artificial sweeteners.',
  },
  {
    id: 'tf-salmon',
    name: 'Cooked Boneless Salmon',
    category: 'proteins',
    status: 'safe',
    riskLevel: 'Safe & Nutritious',
    description: 'High in bioavailable omega-3 fatty acids and highly digestible lean protein for coat luster.',
    recommendation: 'Safe only when thoroughly cooked! Never feed raw Pacific salmon due to lethal Nanophyetus salmincola parasite risk.',
  },
];

export const SUPPLEMENT_RULES: SupplementDoseRule[] = [
  {
    id: 'supp-omega3',
    name: 'Omega-3 (EPA + DHA)',
    primaryIndication: 'Osteoarthritis, renal protection, cardiac wellness, atopic dermatitis',
    standardDoseFormula: '75 to 100 mg of combined EPA+DHA per kg body weight',
    unit: 'mg combined EPA/DHA',
    dosePerKgMin: 75,
    dosePerKgMax: 100,
    vetCaution: 'High doses can prolong clotting times. Discontinue 7 days before scheduled canine surgical procedures.',
    clinicalPearls: 'Must measure active EPA+DHA milligrams, not gross weight of generic fish oil pill. Sourced from small wild pelagic fish to avoid heavy metals.',
  },
  {
    id: 'supp-glucosamine',
    name: 'Glucosamine Hydrochloride',
    primaryIndication: 'Articular cartilage hydration, glycosaminoglycan synthesis',
    standardDoseFormula: '15 to 20 mg per kg body weight daily',
    unit: 'mg Glucosamine HCl',
    dosePerKgMin: 15,
    dosePerKgMax: 20,
    vetCaution: 'Safe profile; mild transient flatulence possible in dogs unaccustomed to shellfish derivatives.',
    clinicalPearls: 'Synergizes dramatically when paired with Chondroitin Sulfate (approx. 10-15 mg/kg) and MSM.',
  },
  {
    id: 'supp-colostrum',
    name: 'Bovine Colostrum (Standardized 20%+ IgG)',
    primaryIndication: 'Leaky gut syndrome, food sensitivities, seasonal environmental allergies',
    standardDoseFormula: '30 to 45 mg per kg body weight daily on empty stomach',
    unit: 'mg pure Colostrum',
    dosePerKgMin: 30,
    dosePerKgMax: 45,
    vetCaution: 'Contraindicated only in confirmed, severe bovine dairy anaphylaxis.',
    clinicalPearls: 'Best absorbed when administered 20 minutes prior to morning meal or dissolved into bone broth.',
  },
  {
    id: 'supp-milk-thistle',
    name: 'Milk Thistle (Silymarin)',
    primaryIndication: 'Hepatic support, elevated ALT/ALP enzymes, post-medication detox',
    standardDoseFormula: '10 to 15 mg Silymarin per kg body weight daily',
    unit: 'mg Silymarin',
    dosePerKgMin: 10,
    dosePerKgMax: 15,
    vetCaution: 'Do not use as indefinite long-term preventative; best cycled in 30-day therapeutic windows.',
    clinicalPearls: 'Potent hepatoprotective antioxidant that stabilizes canine liver cell membranes against toxins.',
  },
  {
    id: 'supp-probiotics',
    name: 'Multi-Strain Spore Probiotics',
    primaryIndication: 'Post-antibiotic microbiome recovery, acute stress colitis, stool consistency',
    standardDoseFormula: '2 to 5 Billion CFU per 10 kg body weight',
    unit: 'Billion CFU',
    dosePerKgMin: 0.25,
    dosePerKgMax: 0.5,
    vetCaution: 'Introduce gradually over 5 days to avoid temporary transient gas.',
    clinicalPearls: 'Soil-based spore organisms (Bacillus coagulans) survive canine gastric pH (1.5) intact to colonize the cecum.',
  },
];

export const INITIAL_PREVENTIVES: PreventiveRecord[] = [
  {
    id: 'prev-1',
    dogId: 'dog-1',
    title: 'Rabies 3-Year Core Booster',
    category: 'core-vaccine',
    administeredDate: '2025-04-10',
    dueDate: '2028-04-10',
    status: 'up-to-date',
    veterinarian: 'Dr. Sarah Chen DVM',
    clinicName: 'Oakridge Canine Specialty & Integrative Health',
    lotNumber: 'DEF-90281-R',
    notes: 'Administered right hindlimb subcutaneous. No immediate or delayed adverse reactions noted.',
  },
  {
    id: 'prev-2',
    dogId: 'dog-1',
    title: 'DHPP (Distemper, Adenovirus, Parvovirus, Parainfluenza)',
    category: 'core-vaccine',
    administeredDate: '2024-05-18',
    dueDate: '2027-05-18',
    status: 'up-to-date',
    veterinarian: 'Dr. Sarah Chen DVM',
    clinicName: 'Oakridge Canine Specialty & Integrative Health',
    lotNumber: 'DHPP-84912',
    notes: 'Titer assay showed robust protective neutralising antibody titers.',
  },
  {
    id: 'prev-3',
    dogId: 'dog-1',
    title: 'Heartworm & Intestinal Parasite Chew (Simparica Trio)',
    category: 'parasite-prevention',
    administeredDate: '2026-08-15',
    dueDate: '2026-09-15',
    status: 'due-soon',
    veterinarian: 'Oakridge Pharmacy',
    clinicName: 'Oakridge Canine Specialty',
    notes: 'Monthly oral chew given with breakfast. Blood antigen test negative on June 2026.',
  },
  {
    id: 'prev-4',
    dogId: 'dog-1',
    title: 'Bordetella Bronchiseptica (Kennel Cough Oral)',
    category: 'lifestyle-vaccine',
    administeredDate: '2025-10-02',
    dueDate: '2026-10-02',
    status: 'due-soon',
    veterinarian: 'Dr. Sarah Chen DVM',
    clinicName: 'Oakridge Canine Specialty & Integrative Health',
    notes: 'Required for agility training facility and boarding admission.',
  },
  {
    id: 'prev-5',
    dogId: 'dog-1',
    title: 'Comprehensive Annual Senior Wellness & Blood Chemistry Panel',
    category: 'wellness-exam',
    administeredDate: '2025-11-12',
    dueDate: '2026-11-12',
    status: 'up-to-date',
    veterinarian: 'Dr. Sarah Chen DVM',
    clinicName: 'Oakridge Canine Specialty & Integrative Health',
    notes: 'Complete Blood Count (CBC), Chem 17, and SDMA renal biomarker were all within optimal physiologic reference ranges.',
  },
];

export const INITIAL_DAILY_TASKS: DailyWellnessTask[] = [
  {
    id: 'task-1',
    dogId: 'dog-1',
    title: 'Administer 3 pumps Wild Alaskan Salmon Oil with breakfast',
    timeSlot: 'Morning',
    category: 'nutrition',
    completed: true,
    notes: 'Pumped over salmon kibble with warm bone broth',
  },
  {
    id: 'task-2',
    dogId: 'dog-1',
    title: 'Joint mobility warm-up: 40-minute brisk trail stroll',
    timeSlot: 'Morning',
    category: 'mobility',
    completed: true,
    notes: 'Good stride length, no gait hitching observed',
  },
  {
    id: 'task-3',
    dogId: 'dog-1',
    title: 'Enzymatic dental water refill in fresh porcelain bowl',
    timeSlot: 'Afternoon',
    category: 'hygiene',
    completed: false,
    notes: '1 tsp added to 500ml fresh filtered water',
  },
  {
    id: 'task-4',
    dogId: 'dog-1',
    title: 'Digestive colostrum & spore probiotic evening sprinkle',
    timeSlot: 'Evening',
    category: 'nutrition',
    completed: false,
    notes: 'Give with dinner meal',
  },
  {
    id: 'task-5',
    dogId: 'dog-1',
    title: 'Ear canal check & gentle paw balm massage',
    timeSlot: 'Evening',
    category: 'vitality',
    completed: false,
    notes: 'Check interdigital webbing for fox-tails or redness',
  },
];
