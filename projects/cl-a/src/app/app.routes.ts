import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home').then(m => m.HomePage), title: 'Velora · Women in Food, Hospitality & Lifestyle' },
  { path: 'about', loadComponent: () => import('./pages/about').then(m => m.AboutPage), title: 'About · Velora' },
  { path: 'events', loadComponent: () => import('./pages/events').then(m => m.EventsPage), title: 'Events · Velora' },
  { path: 'summit', loadComponent: () => import('./pages/summit').then(m => m.SummitPage), title: 'Rise Leadership Forum · Velora' },
  { path: 'academy', loadComponent: () => import('./pages/academy').then(m => m.AcademyPage), title: 'Learning Studio · Velora' },
  { path: 'mentorship', loadComponent: () => import('./pages/mentorship').then(m => m.MentorshipPage), title: 'Mentor Circles · Velora' },
  { path: 'resources', loadComponent: () => import('./pages/resources').then(m => m.ResourcesPage), title: 'Resource Library · Velora' },
  { path: 'jobs', loadComponent: () => import('./pages/jobs').then(m => m.JobsPage), title: 'Job Board · Velora' },
  { path: 'membership', loadComponent: () => import('./pages/membership').then(m => m.MembershipPage), title: 'Membership · Velora' },
  { path: 'members', loadComponent: () => import('./pages/members').then(m => m.MembersPage), title: 'Members’ Lounge · Velora' },
  { path: 'donate', loadComponent: () => import('./pages/donate').then(m => m.DonatePage), title: 'Donate · Velora' },
  { path: 'contact', loadComponent: () => import('./pages/contact').then(m => m.ContactPage), title: 'Contact · Velora' },
  { path: '**', redirectTo: '' },
];
