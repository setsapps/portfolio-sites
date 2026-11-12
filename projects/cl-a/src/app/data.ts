// Velora content model. Placeholder brand + sample content — swap with the client's real data.
export const BRAND = {
  name: 'Velora',
  long: 'Women in Food, Hospitality & Lifestyle',
  tagline: 'Educate · Elevate · Empower',
  email: 'hello@velora.example',
  city: 'Vancouver, BC',
};

const U = (id: string, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;
const L = (n: string, sm = false) => `img/${n}${sm ? '-sm' : ''}.webp`;
export const IMG = {
  hero: L('cla-hero-1'), hero2: L('cla-hero-1'), hero3: L('cla-hero-2'), hotel: L('cla-hero-3'),
  summit: L('cla-summit'), chef: L('cla-kitchen-table', true), mentor: L('cla-mentor', true), academy: L('cla-academy', true),
  outdoor: L('cla-outdoor', true), network: L('cla-network'), talk: L('cla-team'), team: L('cla-team'),
  summitSm: L('cla-summit', true), hotelSm: L('cla-hero-3', true), chefHero: L('cla-hero-2', true),
};

export const JOURNEY = [
  { k: 'Subscribe', t: 'Join the conversation', d: 'A monthly letter with opportunities, events and stories from women across the industry.', icon: '✉' },
  { k: 'Attend', t: 'Show up in the room', d: 'Forums, socials and the annual leadership summit, in person and online.', icon: '◎' },
  { k: 'Learn', t: 'Grow your craft', d: 'On-demand courses and live cohorts built by operators, for operators.', icon: '✎' },
  { k: 'Lead', t: 'Step into leadership', d: 'Board-readiness, speaking and advocacy programs that open doors.', icon: '★' },
  { k: 'Mentor', t: 'Lift as you climb', d: 'Give back through Mentor Circles and pass on what you have learned.', icon: '♥' },
];

export interface Program { id: string; name: string; kicker: string; blurb: string; img: string; route: string; tone: string; }
export const PROGRAMS: Program[] = [
  { id: 'forum', name: 'Rise Leadership Forum', kicker: 'Annual summit', blurb: 'A full day of keynotes, candid panels and connection for women leading across food and hospitality.', img: IMG.summit, route: '/summit', tone: 'rose' },
  { id: 'kitchen', name: 'The Kitchen Table', kicker: 'Culinary series', blurb: 'Intimate dinners hosted by women chefs and restaurateurs, with conversations about building a career in food.', img: IMG.chef, route: '/events', tone: 'gold' },
  { id: 'circles', name: 'Mentor Circles', kicker: 'Mentorship', blurb: 'Six-month small-group mentoring matched by goals, sector and stage of career.', img: IMG.mentor, route: '/mentorship', tone: 'plum' },
  { id: 'studio', name: 'Learning Studio', kicker: 'Academy', blurb: 'Self-paced courses and live cohorts on leadership, finance, operations and wellbeing.', img: IMG.academy, route: '/academy', tone: 'blush' },
];

export interface EventItem { id: number; title: string; date: string; time: string; place: string; type: 'Summit' | 'Dinner' | 'Webinar' | 'Social' | 'Workshop'; price: number; member: boolean; img: string; seats: string; desc: string; }
export const EVENTS: EventItem[] = [
  { id: 1, title: 'Rise Leadership Forum 2027', date: '2027-04-22', time: '08:30 – 18:00', place: 'Waterfront hotel ballroom, Vancouver', type: 'Summit', price: 295, member: false, img: IMG.summit, seats: 'Early-bird open', desc: 'Keynotes, breakout labs and an evening reception.' },
  { id: 2, title: 'The Kitchen Table: Winter Supper', date: '2026-12-04', time: '18:30 – 21:30', place: 'Chef-owned bistro, Gastown', type: 'Dinner', price: 120, member: false, img: IMG.chef, seats: 'Limited seats', desc: 'A four-course supper and fireside chat with the chef.' },
  { id: 3, title: 'Negotiating Your Next Role', date: '2026-11-26', time: '12:00 – 13:00 PT', place: 'Online', type: 'Webinar', price: 0, member: true, img: IMG.talk, seats: 'Members free', desc: 'Scripts, frameworks and live Q&A.' },
  { id: 4, title: 'Holiday Members Social', date: '2026-12-11', time: '17:30 – 20:00', place: 'Rooftop lounge, Downtown', type: 'Social', price: 25, member: false, img: IMG.network, seats: 'Open', desc: 'Drinks, music and new connections.' },
  { id: 5, title: 'Finance for Operators', date: '2027-01-20', time: '10:00 – 15:00', place: 'Learning Studio, Vancouver', type: 'Workshop', price: 85, member: true, img: IMG.academy, seats: 'Cohort of 20', desc: 'Read a P&L, build a budget and pitch for resources.' },
  { id: 6, title: 'Wellness Retreat Weekend', date: '2027-02-10', time: '18:00 – 19:30', place: 'Online', type: 'Webinar', price: 0, member: false, img: IMG.outdoor, seats: 'Free', desc: 'Two days of rest, movement and honest conversation.' },
  { id: 7, title: 'Mentor Circles Kick-off', date: '2027-01-08', time: '17:00 – 18:30', place: 'Online', type: 'Workshop', price: 0, member: true, img: IMG.mentor, seats: 'Matched members', desc: 'Meet your circle and set your goals.' },
  { id: 8, title: 'Hotel GM Shadow Day', date: '2027-03-05', time: 'All day', place: 'Partner hotel, Whistler', type: 'Workshop', price: 45, member: true, img: IMG.hotel, seats: '8 places', desc: 'Spend a day alongside a general manager.' },
];

export interface Course { id: number; title: string; level: 'Foundation' | 'Intermediate' | 'Advanced'; topic: string; hours: number; lessons: number; format: 'Self-paced' | 'Live cohort'; price: number; }
export const COURSES: Course[] = [
  { id: 1, title: 'Leading Front-of-House Teams', level: 'Foundation', topic: 'Leadership', hours: 4, lessons: 12, format: 'Self-paced', price: 0 },
  { id: 2, title: 'Revenue Management Essentials', level: 'Intermediate', topic: 'Finance', hours: 6, lessons: 15, format: 'Self-paced', price: 149 },
  { id: 3, title: 'From Supervisor to Manager', level: 'Intermediate', topic: 'Leadership', hours: 8, lessons: 10, format: 'Live cohort', price: 299 },
  { id: 4, title: 'Board Readiness Program', level: 'Advanced', topic: 'Governance', hours: 12, lessons: 8, format: 'Live cohort', price: 495 },
  { id: 5, title: 'Wellbeing for Shift Workers', level: 'Foundation', topic: 'Wellbeing', hours: 2, lessons: 6, format: 'Self-paced', price: 0 },
  { id: 6, title: 'Sustainable Kitchen Operations', level: 'Intermediate', topic: 'Operations', hours: 5, lessons: 11, format: 'Self-paced', price: 129 },
  { id: 7, title: 'Public Speaking for Leaders', level: 'Advanced', topic: 'Leadership', hours: 6, lessons: 6, format: 'Live cohort', price: 349 },
  { id: 8, title: 'Inclusive Hiring Playbook', level: 'Foundation', topic: 'People', hours: 3, lessons: 9, format: 'Self-paced', price: 0 },
];

export interface Resource { id: number; title: string; type: 'Guide' | 'Toolkit' | 'Webinar' | 'Report' | 'Podcast' | 'Template'; topic: string; access: 'Free' | 'Members'; date: string; mins: number; blurb: string; }
export const RESOURCES: Resource[] = [
  { id: 1, title: 'Returning to work after parental leave', type: 'Guide', topic: 'Career', access: 'Free', date: '2026-10-28', mins: 12, blurb: 'Planning, conversations and a 90-day re-entry plan.' },
  { id: 2, title: 'Pay-equity self-audit kit', type: 'Toolkit', topic: 'Workplace', access: 'Members', date: '2026-10-14', mins: 25, blurb: 'Spreadsheet and step-by-step method for small employers.' },
  { id: 3, title: 'Building a seasonal-staff pipeline', type: 'Webinar', topic: 'Hiring', access: 'Free', date: '2026-10-02', mins: 48, blurb: 'Recording with operators from restaurants and boutique hotels.' },
  { id: 4, title: 'Flexible scheduling policy template', type: 'Template', topic: 'Workplace', access: 'Members', date: '2026-09-21', mins: 8, blurb: 'Editable policy with rollout checklist.' },
  { id: 5, title: 'Sector workforce snapshot', type: 'Report', topic: 'Research', access: 'Free', date: '2026-09-09', mins: 18, blurb: 'Summary of publicly available labour-market data.' },
  { id: 6, title: 'Episode 14: Owning the room', type: 'Podcast', topic: 'Leadership', access: 'Free', date: '2026-08-30', mins: 36, blurb: 'Presence, preparation and handling pushback.' },
  { id: 7, title: 'Safe late-shift travel checklist', type: 'Toolkit', topic: 'Safety', access: 'Free', date: '2026-08-12', mins: 6, blurb: 'Practical steps employers can put in place this week.' },
  { id: 8, title: 'Negotiation scripts for first-time managers', type: 'Guide', topic: 'Career', access: 'Members', date: '2026-07-25', mins: 14, blurb: 'Word-for-word openers and responses.' },
  { id: 9, title: 'Mentoring agreement template', type: 'Template', topic: 'Mentorship', access: 'Free', date: '2026-07-10', mins: 5, blurb: 'Set goals, cadence and boundaries from day one.' },
  { id: 10, title: 'Episode 13: From line cook to owner', type: 'Podcast', topic: 'Career', access: 'Free', date: '2026-06-28', mins: 41, blurb: 'A chef-owner on the long road to her own restaurant.' },
  { id: 11, title: 'Board-readiness self-assessment', type: 'Toolkit', topic: 'Leadership', access: 'Members', date: '2026-06-15', mins: 15, blurb: 'Map your skills against what boards look for.' },
  { id: 12, title: 'Harassment-prevention training outline', type: 'Guide', topic: 'Safety', access: 'Members', date: '2026-05-30', mins: 20, blurb: 'Module plan for front-line teams.' },
];

export interface Job { id: number; title: string; org: string; city: string; type: 'Full-time' | 'Part-time' | 'Seasonal' | 'Contract'; sector: 'Hotels' | 'Food & Beverage' | 'Wellness' | 'Lifestyle' | 'Events'; salary: string; days: number; featured?: boolean; }
export const JOBS: Job[] = [
  { id: 1, title: 'Director of Sales', org: 'Sample Resort Group', city: 'Whistler, BC', type: 'Full-time', sector: 'Hotels', salary: '$95k – $115k', days: 1, featured: true },
  { id: 2, title: 'Executive Sous Chef', org: 'Sample Dining Co.', city: 'Vancouver, BC', type: 'Full-time', sector: 'Food & Beverage', salary: '$70k – $82k', days: 3 },
  { id: 3, title: 'Guest Experience Manager', org: 'Sample Boutique Hotel', city: 'Victoria, BC', type: 'Full-time', sector: 'Hotels', salary: '$62k – $70k', days: 4, featured: true },
  { id: 4, title: 'Spa & Wellness Manager', org: 'Sample Spa Retreat', city: 'Banff, AB', type: 'Full-time', sector: 'Wellness', salary: '$64k – $72k', days: 6 },
  { id: 5, title: 'Café Operations Lead', org: 'Sample Café Group', city: 'Kelowna, BC', type: 'Contract', sector: 'Food & Beverage', salary: '$31 / hr', days: 8 },
  { id: 6, title: 'Events & Conference Manager', org: 'Sample Convention Centre', city: 'Calgary, AB', type: 'Full-time', sector: 'Events', salary: '$75k – $85k', days: 10 },
  { id: 7, title: 'Front Desk Supervisor', org: 'Sample Lodge', city: 'Jasper, AB', type: 'Seasonal', sector: 'Hotels', salary: '$24 / hr + housing', days: 12 },
  { id: 8, title: 'Brand Marketing Specialist (part-time)', org: 'Sample Lifestyle Brand', city: 'Remote · Canada', type: 'Part-time', sector: 'Lifestyle', salary: '$35 / hr', days: 14 },
];

export const TEAM = [
  { n: 'Executive Director', r: 'Leads strategy, partnerships and the team', i: 'ED' },
  { n: 'Programs Lead', r: 'Runs events, Mentor Circles and the Forum', i: 'PL' },
  { n: 'Learning Manager', r: 'Builds Learning Studio courses', i: 'LM' },
  { n: 'Community Manager', r: 'Members, chapters and volunteers', i: 'CM' },
  { n: 'Partnerships Manager', r: 'Sponsors and employer partners', i: 'PM' },
  { n: 'Board Chair', r: 'Volunteer board of industry leaders', i: 'BC' },
];

export const STORIES = [
  { q: 'Mentor Circles gave me a room of women who had already solved the problems I was facing.', who: 'Member, hotel operations', img: IMG.mentor },
  { q: 'I came for one dinner and left with a business partner and three new friends.', who: 'Member, chef-owner', img: IMG.chef },
  { q: 'The Forum is the one day a year I protect in my calendar, for the people as much as the talks.', who: 'Member, boutique hotel owner', img: IMG.summit },
];

export const PARTNERS = ['Partner Hotel Group', 'Artisan Food Co-op', 'Wellness Studio Collective', 'Culinary Institute', 'Restaurant Alliance', 'Lifestyle Media House', 'Farm-to-Table Network', 'Event Venue Co.'];

export const SEARCH_INDEX = [
  ...EVENTS.map(e => ({ title: e.title, type: 'Event', route: '/events', text: e.type + ' ' + e.place })),
  ...COURSES.map(c => ({ title: c.title, type: 'Course', route: '/academy', text: c.topic + ' ' + c.level })),
  ...RESOURCES.map(r => ({ title: r.title, type: r.type, route: '/resources', text: r.topic })),
  ...JOBS.map(j => ({ title: j.title + ' · ' + j.org, type: 'Job', route: '/jobs', text: j.city + ' ' + j.sector })),
  { title: 'Become a member', type: 'Page', route: '/membership', text: 'join pricing plans' },
  { title: 'Mentor Circles', type: 'Program', route: '/mentorship', text: 'mentor mentee' },
  { title: 'Rise Leadership Forum', type: 'Program', route: '/summit', text: 'summit tickets speakers' },
  { title: 'Donate', type: 'Page', route: '/donate', text: 'give support scholarship' },
  { title: 'About us', type: 'Page', route: '/about', text: 'team mission board' },
  { title: 'Contact', type: 'Page', route: '/contact', text: 'email address' },
];
