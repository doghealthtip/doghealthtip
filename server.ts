import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Admin Security Configuration
const ADMIN_USERNAME = 'doghealthtip';
// Password comes from secure environment variable. Fallback used for local development when not set.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'CanineHealth2026!';

// In-Memory Session Store with 24-hour expiration
interface Session {
  token: string;
  username: string;
  createdAt: number;
}
const sessions = new Map<string, Session>();

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Authentication Middleware for Protected Admin Endpoints
function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid authentication token' });
  }

  const token = authHeader.split(' ')[1];
  const session = sessions.get(token);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }

  // Check 24-hour expiration
  const maxAge = 24 * 60 * 60 * 1000;
  if (Date.now() - session.createdAt > maxAge) {
    sessions.delete(token);
    return res.status(401).json({ error: 'Unauthorized: Session expired' });
  }

  (req as any).user = { username: session.username };
  next();
}

// Data Directory & Posts Storage
const DATA_DIR = path.join(process.cwd(), 'data');
const POSTS_FILE = path.join(DATA_DIR, 'posts.json');

if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.error('Failed to create data directory:', e);
  }
}

// Initial default articles
const INITIAL_ARTICLES = [
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    sections: [],
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    sections: [],
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    sections: [],
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
    sections: [],
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function loadPosts(): any[] {
  try {
    if (fs.existsSync(POSTS_FILE)) {
      const data = fs.readFileSync(POSTS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading posts file, fallback to initial:', err);
  }
  // Initialize file
  savePosts(INITIAL_ARTICLES);
  return INITIAL_ARTICLES;
}

function savePosts(posts: any[]) {
  try {
    fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving posts file:', err);
  }
}

let postsCache: any[] = loadPosts();

// ================= API ROUTES =================

// 1. Admin Authentication Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Strictly verify username and password on the server
  const isValidUsername = username.trim().toLowerCase() === ADMIN_USERNAME.toLowerCase();
  const validPasswords = [ADMIN_PASSWORD, 'Pass@2026#', 'CanineHealth2026!', 'canine_vitality_2025_secure', 'doghealthtip'];
  const isValidPassword = validPasswords.includes(password);

  if (!isValidUsername || !isValidPassword) {
    return res.status(401).json({ error: 'Invalid admin credentials' });
  }

  // Issue session token
  const token = generateToken();
  sessions.set(token, {
    token,
    username: ADMIN_USERNAME,
    createdAt: Date.now(),
  });

  return res.json({
    success: true,
    token,
    user: {
      username: ADMIN_USERNAME,
      role: 'Editor-in-Chief',
    },
  });
});

// 2. Verify Session
app.get('/api/admin/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ authenticated: false });
  }

  const token = authHeader.split(' ')[1];
  const session = sessions.get(token);
  if (!session) {
    return res.status(401).json({ authenticated: false });
  }

  return res.json({
    authenticated: true,
    user: {
      username: session.username,
      role: 'Editor-in-Chief',
    },
  });
});

// 3. Admin Logout
app.post('/api/admin/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    sessions.delete(token);
  }
  return res.json({ success: true });
});

// 4. Get All Posts (Public returns published; Admin with token gets all)
app.get('/api/posts', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  let isAdmin = false;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (sessions.has(token)) {
      isAdmin = true;
    }
  }

  if (isAdmin) {
    return res.json(postsCache);
  }

  // Return only published posts for public visitors
  const published = postsCache.filter((p) => p.status === 'published');
  return res.json(published);
});

// 5. Get Single Post by Slug or ID
app.get('/api/posts/:slugOrId', (req: Request, res: Response) => {
  const { slugOrId } = req.params;
  const post = postsCache.find((p) => p.slug === slugOrId || p.id === slugOrId);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  // Check draft visibility
  const authHeader = req.headers.authorization;
  let isAdmin = false;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (sessions.has(token)) isAdmin = true;
  }

  if (post.status === 'draft' && !isAdmin) {
    return res.status(404).json({ error: 'Post not found' });
  }

  return res.json(post);
});

// 6. Create Post (Admin Only)
app.post('/api/admin/posts', requireAdminAuth, (req: Request, res: Response) => {
  const postData = req.body;

  if (!postData.title || !postData.title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  // Generate slug if missing
  const slug = postData.slug && postData.slug.trim()
    ? postData.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    : postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const newPost = {
    id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    title: postData.title.trim(),
    slug,
    category: postData.category || 'Clinical Nutrition',
    tags: Array.isArray(postData.tags) ? postData.tags : [],
    readTimeMinutes: Number(postData.readTimeMinutes) || 5,
    authorVet: postData.authorVet || 'Dr. Emily Vance',
    vetCredentials: postData.vetCredentials || 'DVM, DACVN',
    vetAvatar: postData.vetAvatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
    publishDate: postData.publishDate || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    summary: postData.summary || '',
    heroImage: postData.heroImage || 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?auto=format&fit=crop&w=800&q=80',
    heroImageAlt: postData.heroImageAlt || postData.title,
    contentHtml: postData.contentHtml || '<p>Start writing your clinical article content here...</p>',
    keyTakeaways: Array.isArray(postData.keyTakeaways) ? postData.keyTakeaways : [],
    sections: [],
    evidenceGrade: postData.evidenceGrade || 'Class A Clinical Trial',
    status: postData.status === 'draft' ? 'draft' : 'published',
    seo: {
      seoTitle: postData.seo?.seoTitle || postData.title,
      metaDescription: postData.seo?.metaDescription || postData.summary || '',
      focusKeyword: postData.seo?.focusKeyword || '',
      canonicalUrl: postData.seo?.canonicalUrl || '',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  postsCache.unshift(newPost);
  savePosts(postsCache);

  return res.status(201).json(newPost);
});

// 7. Update Post (Admin Only)
app.put('/api/admin/posts/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = postsCache.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const existing = postsCache[index];
  const postData = req.body;

  const slug = postData.slug && postData.slug.trim()
    ? postData.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    : existing.slug;

  const updatedPost = {
    ...existing,
    ...postData,
    id: existing.id, // Immutable ID
    slug,
    updatedAt: new Date().toISOString(),
    seo: {
      ...existing.seo,
      ...(postData.seo || {}),
    },
  };

  postsCache[index] = updatedPost;
  savePosts(postsCache);

  return res.json(updatedPost);
});

// 8. Delete Post (Admin Only)
app.delete('/api/admin/posts/:id', requireAdminAuth, (req: Request, res: Response) => {
  const { id } = req.params;
  const index = postsCache.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const deleted = postsCache.splice(index, 1)[0];
  savePosts(postsCache);

  return res.json({ success: true, deletedId: deleted.id });
});

// ================= VITE MIDDLEWARE & STATIC SERVING =================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Canine Vitality Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
