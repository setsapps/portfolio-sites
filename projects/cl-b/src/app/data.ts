// CL-B — placeholder brand + sample content (tourism & hospitality)
const U = (id: string, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;
export const IMG = {
  lake: U('photo-1503614472-8c93d56e92ce', 1600),
  lodge: U('photo-1589129140837-67287c22521b', 1200),
  cabin: U('photo-1587381420270-3e1a5b9e6904', 1200),
  hike: U('photo-1501555088652-021faa106b9b', 1200),
  hike2: U('photo-1533240332313-0db49b459ad6', 1200),
  banff: U('photo-1561134643-668f9057cce4', 1200),
  lobby: U('photo-1566073771259-6a8506099945', 1200),
  chef: U('photo-1709837167719-1ff90bdbbac5', 1200),
  aurora: U('photo-1531366936337-7c912a4589a7', 1200),
  kayak: U('photo-1503614472-8c93d56e92ce', 1200),
  summit: U('photo-1540575467063-178a50c2df87', 1200),
};

export const CHAPTERS = [
  { n: '01', k: 'Arrival', t: 'Dawn breaks over the range', d: 'Fly in over glacier-cut peaks as first light spills into the valley.' },
  { n: '02', k: 'The Lake', t: 'Glide across glass-still water', d: 'Turquoise water, silent paddles and mountains reflected twice.' },
  { n: '03', k: 'The Lodge', t: 'Warm timber, open fires', d: 'Hosts who know your name, a chef’s table and a sauna by the shore.' },
  { n: '04', k: 'Aurora', t: 'The sky comes alive', d: 'Night falls, the lodge glows and the northern lights begin to dance.' },
  { n: '05', k: 'Gather', t: 'Bring your people', d: 'Retreats, summits and journeys designed for teams and communities.' },
];

export interface Exp { id: number; title: string; cat: 'Stay' | 'Adventure' | 'Culinary' | 'Wellness' | 'Night sky'; price: number; nights: number; rating: string; img: string; place: string; tag?: string; }
export const EXPERIENCES: Exp[] = [
  { id: 1, title: 'Aurora Nights in a Glass Dome', cat: 'Night sky', price: 690, nights: 2, rating: 'New', img: IMG.aurora, place: 'Northern lakes', tag: 'Most requested' },
  { id: 2, title: 'Lakeside Timber Lodge', cat: 'Stay', price: 420, nights: 1, rating: 'New', img: IMG.lodge, place: 'Mountain valley' },
  { id: 3, title: 'Sunrise Paddle & Breakfast', cat: 'Adventure', price: 140, nights: 0, rating: 'New', img: IMG.kayak, place: 'Glacier lake' },
  { id: 4, title: 'Chef’s Table by the Fire', cat: 'Culinary', price: 210, nights: 0, rating: 'New', img: IMG.chef, place: 'The lodge' },
  { id: 5, title: 'Ridge-line Guided Hike', cat: 'Adventure', price: 160, nights: 0, rating: 'New', img: IMG.hike, place: 'Alpine trail', tag: 'Small group' },
  { id: 6, title: 'Forest Sauna & Cold Plunge', cat: 'Wellness', price: 95, nights: 0, rating: 'New', img: IMG.cabin, place: 'Lakeshore' },
  { id: 7, title: 'Mountain Town Boutique Stay', cat: 'Stay', price: 360, nights: 1, rating: 'New', img: IMG.lobby, place: 'Historic town' },
  { id: 8, title: 'Peaks & Valleys Photo Walk', cat: 'Adventure', price: 120, nights: 0, rating: 'New', img: IMG.banff, place: 'Scenic parkway' },
];

export const EVENTS = [
  { d: '2027-01-22', t: 'Winter Hosts Retreat', p: 'Lakeside lodge', k: 'Retreat', price: 1250 },
  { d: '2027-02-12', t: 'Aurora Leadership Summit', p: 'Northern lakes', k: 'Summit', price: 890 },
  { d: '2027-03-18', t: 'Culinary Trails Weekend', p: 'Mountain town', k: 'Culinary', price: 540 },
  { d: '2027-05-06', t: 'Spring Guides Gathering', p: 'Alpine hut', k: 'Community', price: 0 },
];

export const SEARCH_INDEX = [
  ...EXPERIENCES.map(e => ({ title: e.title, type: e.cat, route: '/experiences', text: e.place })),
  ...EVENTS.map(e => ({ title: e.t, type: 'Event', route: '/events', text: e.p + ' ' + e.k })),
  { title: 'Plan a trip', type: 'Tool', route: '/plan', text: 'itinerary planner' },
  { title: 'About CL-B', type: 'Page', route: '/about', text: 'team partners' },
];
