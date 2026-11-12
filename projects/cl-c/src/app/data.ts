// Ludhiana Hospital — content model. Doctor profiles, timings and prices are SAMPLE data for the preview.
export const H = {
  name: 'Ludhiana Hospital',
  short: 'LH',
  tagline: 'Care that feels like family',
  emergency: '1800-000-0000',
  phone: '+91 00000 00000',
  whatsapp: '+91 00000 00000',
  email: 'care@ludhianahospital.example',
  address: 'Ludhiana, Punjab, India',
};

const U = (id: string, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;
const L = (n: string, sm = false) => `img/${n}${sm ? '-sm' : ''}.webp`;
export const IMG = {
  hero: L('lh-hero-1'), hero2: L('lh-hero-2'), hero3: L('lh-hero-3'), building: L('lh-hero-3'),
  care: L('lh-hero-2'), nurse: L('lh-mother-child', true), lab: L('lh-lab'), surgery: L('lh-ortho'), family: L('lh-family', true),
  icu: L('lh-neuro'), check: L('lh-health-check'), cardiac: L('lh-cardiac'),
  docs: [1, 2, 3, 4, 5, 6, 7, 8].map(i => `img/lh-doc-${i}.webp`),
};

export interface Speciality { slug: string; name: string; icon: string; blurb: string; treatments: string[]; coe?: boolean; }
export const SPECIALITIES: Speciality[] = [
  { slug: 'cardiology', name: 'Cardiology & Heart Surgery', icon: '❤', coe: true, blurb: 'Interventional cardiology, cath lab, bypass and valve surgery with a 24×7 chest-pain pathway.', treatments: ['Angiography & angioplasty', 'Pacemaker implantation', 'Bypass surgery (CABG)', 'Valve repair & replacement', 'Heart-failure clinic'] },
  { slug: 'neurology', name: 'Neurosciences', icon: '🧠', coe: true, blurb: 'Stroke unit, epilepsy care, spine and brain surgery led by neurologists and neurosurgeons.', treatments: ['Stroke thrombolysis', 'Epilepsy management', 'Spine surgery', 'Brain tumour surgery', 'Movement disorders'] },
  { slug: 'orthopaedics', name: 'Orthopaedics & Joint Replacement', icon: '🦴', coe: true, blurb: 'Knee and hip replacement, arthroscopy, sports injuries and trauma care.', treatments: ['Total knee replacement', 'Hip replacement', 'Arthroscopy', 'Fracture & trauma care', 'Sports medicine'] },
  { slug: 'oncology', name: 'Cancer Care', icon: '🎗', coe: true, blurb: 'Medical, surgical and radiation oncology with a tumour board for every patient.', treatments: ['Chemotherapy', 'Cancer surgery', 'Radiation therapy', 'Screening programs', 'Palliative care'] },
  { slug: 'gastro', name: 'Gastroenterology & Liver', icon: '🫁', coe: true, blurb: 'Endoscopy suite, liver clinic and advanced GI surgery.', treatments: ['Endoscopy & colonoscopy', 'ERCP', 'Liver clinic', 'Laparoscopic GI surgery'] },
  { slug: 'mother-child', name: 'Mother & Child', icon: '👶', coe: true, blurb: 'Obstetrics, high-risk pregnancy, Level-III NICU and paediatrics under one roof.', treatments: ['Normal & C-section delivery', 'High-risk pregnancy', 'NICU', 'Paediatrics', 'Vaccination'] },
  { slug: 'nephrology', name: 'Nephrology & Urology', icon: '💧', blurb: 'Dialysis unit, kidney stones and prostate care.', treatments: ['Haemodialysis', 'Kidney-stone treatment', 'Prostate surgery', 'Transplant workup'] },
  { slug: 'pulmonology', name: 'Pulmonology', icon: '🌬', blurb: 'Asthma, COPD, sleep studies and bronchoscopy.', treatments: ['Pulmonary function tests', 'Bronchoscopy', 'Sleep studies', 'TB clinic'] },
  { slug: 'diabetes', name: 'Diabetes & Endocrinology', icon: '🩸', blurb: 'Diabetes, thyroid and hormone disorders with a dedicated educator.', treatments: ['Diabetes clinic', 'Thyroid care', 'Insulin pump therapy', 'Diabetic foot care'] },
  { slug: 'ent', name: 'ENT', icon: '👂', blurb: 'Ear, nose and throat surgery and hearing clinic.', treatments: ['Sinus surgery', 'Tonsillectomy', 'Hearing tests', 'Cochlear implant evaluation'] },
  { slug: 'dermatology', name: 'Dermatology', icon: '✨', blurb: 'Skin, hair and cosmetic dermatology.', treatments: ['Acne & eczema', 'Laser treatments', 'Hair-loss clinic'] },
  { slug: 'emergency', name: 'Emergency & Trauma', icon: '🚑', coe: true, blurb: '24×7 emergency with trauma bay, ICU and ambulance network.', treatments: ['Trauma care', 'Critical care', 'Ambulance service', 'Poison management'] },
];

export interface Doctor { id: number; name: string; spec: string; slug: string; deg: string; exp: number; langs: string[]; gender: 'F' | 'M'; days: string[]; fee: number; img: string; video: boolean; }
const D = IMG.docs;
export const DOCTORS: Doctor[] = [
  { id: 1, name: 'Dr. Anjali Mehra', spec: 'Interventional Cardiologist', slug: 'cardiology', deg: 'MBBS, MD, DM (Cardiology)', exp: 18, langs: ['English', 'Hindi', 'Punjabi'], gender: 'F', days: ['Mon', 'Wed', 'Fri'], fee: 900, img: D[0], video: true },
  { id: 2, name: 'Dr. Rajiv Sandhu', spec: 'Cardiothoracic Surgeon', slug: 'cardiology', deg: 'MBBS, MS, MCh (CTVS)', exp: 22, langs: ['English', 'Punjabi'], gender: 'M', days: ['Tue', 'Thu', 'Sat'], fee: 1200, img: D[4], video: false },
  { id: 3, name: 'Dr. Harpreet Gill', spec: 'Neurologist', slug: 'neurology', deg: 'MBBS, MD, DM (Neurology)', exp: 14, langs: ['English', 'Hindi', 'Punjabi'], gender: 'F', days: ['Mon', 'Tue', 'Thu'], fee: 1000, img: D[1], video: true },
  { id: 4, name: 'Dr. Vikram Arora', spec: 'Orthopaedic & Joint Replacement Surgeon', slug: 'orthopaedics', deg: 'MBBS, MS (Ortho), Fellowship Arthroplasty', exp: 16, langs: ['English', 'Hindi'], gender: 'M', days: ['Mon', 'Wed', 'Sat'], fee: 800, img: D[6], video: true },
  { id: 5, name: 'Dr. Simran Kaur', spec: 'Medical Oncologist', slug: 'oncology', deg: 'MBBS, MD, DM (Medical Oncology)', exp: 12, langs: ['English', 'Hindi', 'Punjabi'], gender: 'F', days: ['Tue', 'Fri'], fee: 1100, img: D[2], video: true },
  { id: 6, name: 'Dr. Amit Bansal', spec: 'Gastroenterologist', slug: 'gastro', deg: 'MBBS, MD, DM (Gastro)', exp: 15, langs: ['English', 'Hindi'], gender: 'M', days: ['Mon', 'Thu', 'Sat'], fee: 900, img: D[7], video: false },
  { id: 7, name: 'Dr. Neha Kapoor', spec: 'Obstetrician & Gynaecologist', slug: 'mother-child', deg: 'MBBS, MS (OBG), FMAS', exp: 13, langs: ['English', 'Hindi', 'Punjabi'], gender: 'F', days: ['Mon', 'Tue', 'Wed', 'Fri'], fee: 700, img: D[3], video: true },
  { id: 8, name: 'Dr. Gurpreet Dhillon', spec: 'Paediatrician & Neonatologist', slug: 'mother-child', deg: 'MBBS, MD (Paeds), Fellowship Neonatology', exp: 11, langs: ['English', 'Punjabi'], gender: 'M', days: ['Tue', 'Thu', 'Sat'], fee: 700, img: D[5], video: true },
  { id: 9, name: 'Dr. Kavita Sharma', spec: 'Nephrologist', slug: 'nephrology', deg: 'MBBS, MD, DM (Nephrology)', exp: 17, langs: ['English', 'Hindi'], gender: 'F', days: ['Wed', 'Fri'], fee: 900, img: D[1], video: false },
  { id: 10, name: 'Dr. Manpreet Grewal', spec: 'Pulmonologist', slug: 'pulmonology', deg: 'MBBS, MD (Pulmonary Medicine)', exp: 10, langs: ['English', 'Punjabi', 'Hindi'], gender: 'M', days: ['Mon', 'Wed', 'Fri'], fee: 800, img: D[4], video: true },
  { id: 11, name: 'Dr. Ritu Malhotra', spec: 'Endocrinologist', slug: 'diabetes', deg: 'MBBS, MD, DM (Endocrinology)', exp: 9, langs: ['English', 'Hindi'], gender: 'F', days: ['Tue', 'Thu'], fee: 850, img: D[2], video: true },
  { id: 12, name: 'Dr. Sukhwinder Brar', spec: 'Emergency Physician', slug: 'emergency', deg: 'MBBS, MD (Emergency Medicine)', exp: 12, langs: ['English', 'Punjabi'], gender: 'M', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], fee: 600, img: D[6], video: false },
];

export interface Pkg { id: number; name: string; cat: 'Men' | 'Women' | 'Senior' | 'Heart' | 'Diabetes' | 'Basic'; tests: number; price: number; mrp: number; hot?: boolean; incl: string[]; }
export const PACKAGES: Pkg[] = [
  { id: 1, name: 'Essential Health Check', cat: 'Basic', tests: 42, price: 1999, mrp: 3500, incl: ['CBC', 'Blood sugar (F)', 'Lipid profile', 'Liver function', 'Kidney function', 'Urine routine', 'Physician consult'] },
  { id: 2, name: 'Executive Health Check — Men', cat: 'Men', tests: 78, price: 4999, mrp: 8900, hot: true, incl: ['Everything in Essential', 'HbA1c', 'Thyroid profile', 'ECG', 'Chest X-ray', 'Ultrasound abdomen', 'PSA', 'Cardiology consult'] },
  { id: 3, name: 'Executive Health Check — Women', cat: 'Women', tests: 80, price: 5299, mrp: 9200, hot: true, incl: ['Everything in Essential', 'HbA1c', 'Thyroid profile', 'ECG', 'Pap smear', 'Mammography / breast USG', 'Vitamin D & B12', 'Gynaecology consult'] },
  { id: 4, name: 'Senior Citizen Care', cat: 'Senior', tests: 86, price: 5999, mrp: 10500, incl: ['Comprehensive bloods', 'Echo', 'Bone density (DEXA)', 'Eye & ENT screen', 'Geriatric consult', 'Diet counselling'] },
  { id: 5, name: 'Heart Check Advanced', cat: 'Heart', tests: 54, price: 6499, mrp: 11000, incl: ['Lipid profile', 'hs-CRP', 'ECG', 'Echo', 'Treadmill test (TMT)', 'Cardiology consult'] },
  { id: 6, name: 'Diabetes Care Panel', cat: 'Diabetes', tests: 38, price: 2499, mrp: 4200, incl: ['HbA1c', 'Fasting & PP sugar', 'Kidney function', 'Urine microalbumin', 'Eye fundus', 'Diabetologist consult', 'Diet counselling'] },
  { id: 7, name: 'Women Wellness Plus', cat: 'Women', tests: 64, price: 3999, mrp: 6800, incl: ['Hormone panel', 'Thyroid', 'Iron studies', 'Vitamin D', 'Pelvic ultrasound', 'Gynaecology consult'] },
  { id: 8, name: 'Young Adult Check', cat: 'Basic', tests: 36, price: 1499, mrp: 2600, incl: ['CBC', 'Sugar', 'Lipid profile', 'Thyroid (TSH)', 'Vitamin D', 'Physician consult'] },
];

export const TESTIMONIALS = [
  { q: 'From the emergency team to the nurses in the ward, everyone explained what was happening to my father. We never felt alone.', who: 'Family of a cardiac patient', img: IMG.family },
  { q: 'Booking my health check online took two minutes and the reports were on my phone the same evening.', who: 'Health-check patient', img: IMG.check },
  { q: 'The NICU staff treated our baby like their own. We are so grateful.', who: 'Parents, Mother & Child', img: IMG.nurse },
];

export const NEWS = [
  { t: 'Free heart screening camp this Sunday', d: '2026-11-15', tag: 'Camp' },
  { t: 'New 3-Tesla MRI now available', d: '2026-11-02', tag: 'Facility' },
  { t: 'World Diabetes Day: free sugar tests all week', d: '2026-11-10', tag: 'Awareness' },
  { t: 'Winter flu vaccinations open for all ages', d: '2026-10-28', tag: 'Vaccination' },
];

export const BLOGS = [
  { t: 'Chest pain: when is it an emergency?', cat: 'Heart', min: 5, img: IMG.care },
  { t: 'Managing diabetes in Punjabi winters', cat: 'Diabetes', min: 6, img: IMG.check },
  { t: 'Knee pain at 40: exercise or surgery?', cat: 'Orthopaedics', min: 7, img: IMG.surgery },
  { t: 'What to pack for your delivery day', cat: 'Mother & Child', min: 4, img: IMG.nurse },
  { t: 'Stroke signs everyone should know (BE-FAST)', cat: 'Neuro', min: 4, img: IMG.icu },
  { t: 'Health checks by age: a simple guide', cat: 'Wellness', min: 6, img: IMG.lab },
];

export const INSURERS = ['Star Health', 'HDFC ERGO', 'ICICI Lombard', 'Niva Bupa', 'Care Health', 'Bajaj Allianz', 'Tata AIG', 'New India Assurance', 'United India', 'Oriental Insurance', 'Aditya Birla Health', 'ManipalCigna', 'CGHS', 'ECHS', 'Ayushman Bharat (PM-JAY)', 'ESIC'];

export const FAQS = [
  ['How do I book an appointment?', 'Use Book Appointment on any page, call our helpline, or message us on WhatsApp. You can choose an in-person or video consultation.'],
  ['Do I need a referral to see a specialist?', 'Walk-in OPD is open to all. For online records and some specialist services, your doctor’s referral number links your file securely.'],
  ['Which insurance and government schemes are accepted?', 'We are empanelled with major insurers and TPAs, as well as CGHS, ECHS and PM-JAY. See Insurance & TPA for the full list.'],
  ['How do I get my lab reports?', 'Reports are sent by SMS and are available in the patient portal after you sign in with your mobile number.'],
  ['Is there 24-hour emergency?', 'Yes. Our emergency and trauma department is open 24×7 with ambulance service.'],
  ['Can family members stay with patients?', 'One attendant may stay with a patient in the ward. ICU visiting hours are posted at the unit.'],
];

export const SEARCH_INDEX = [
  ...SPECIALITIES.map(s => ({ title: s.name, type: 'Speciality', route: '/specialities/' + s.slug, text: s.treatments.join(' ') + ' ' + s.blurb })),
  ...DOCTORS.map(d => ({ title: d.name + ' · ' + d.spec, type: 'Doctor', route: '/doctors?d=' + d.id, text: d.deg + ' ' + d.langs.join(' ') })),
  ...PACKAGES.map(p => ({ title: p.name, type: 'Health check', route: '/health-checks', text: p.cat + ' ' + p.incl.join(' ') })),
  ...BLOGS.map(b => ({ title: b.t, type: 'Article', route: '/health-library', text: b.cat })),
  { title: 'Book an appointment', type: 'Service', route: '/book', text: 'opd consult visit' },
  { title: 'Emergency & ambulance', type: 'Service', route: '/emergency', text: 'trauma accident 24x7' },
  { title: 'Lab reports', type: 'Service', route: '/patient-portal', text: 'results download' },
  { title: 'Second opinion', type: 'Service', route: '/second-opinion', text: 'review case' },
  { title: 'Insurance & TPA', type: 'Service', route: '/insurance', text: 'cashless cghs echs pmjay' },
  { title: 'International patients', type: 'Service', route: '/international', text: 'visa travel nri' },
  { title: 'Home care', type: 'Service', route: '/home-care', text: 'nursing physiotherapy sample collection' },
  { title: 'Pharmacy', type: 'Service', route: '/pharmacy', text: 'medicine order delivery' },
  { title: 'Careers', type: 'Page', route: '/careers', text: 'jobs nurse doctor' },
  { title: 'Contact & directions', type: 'Page', route: '/contact', text: 'address map phone' },
];
