import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home').then(m => m.HomePage), title: 'CL-A · Women in Recreation, Tourism & Hospitality' },
  { path: 'about', loadComponent: () => import('./pages/about').then(m => m.AboutPage), title: 'About · CL-A' },
  { path: 'events', loadComponent: () => import('./pages/events').then(m => m.EventsPage), title: 'Events · CL-A' },
  { path: 'summit', loadComponent: () => import('./pages/summit').then(m => m.SummitPage), title: 'Rise Leadership Forum · CL-A' },
  { path: 'academy', loadComponent: () => import('./pages/academy').then(m => m.AcademyPage), title: 'Learning Studio · CL-A' },
  { path: 'mentorship', loadComponent: () => import('./pages/mentorship').then(m => m.MentorshipPage), title: 'Mentor Circles · CL-A' },
  { path: 'resources', loadComponent: () => import('./pages/resources').then(m => m.ResourcesPage), title: 'Resource Library · CL-A' },
  { path: 'jobs', loadComponent: () => import('./pages/jobs').then(m => m.JobsPage), title: 'Job Board · CL-A' },
  { path: 'membership', loadComponent: () => import('./pages/membership').then(m => m.MembershipPage), title: 'Membership · CL-A' },
  { path: 'members', loadComponent: () => import('./pages/members').then(m => m.MembersPage), title: 'Members’ Lounge · CL-A' },
  { path: 'donate', loadComponent: () => import('./pages/donate').then(m => m.DonatePage), title: 'Donate · CL-A' },
  { path: 'contact', loadComponent: () => import('./pages/contact').then(m => m.ContactPage), title: 'Contact · CL-A' },
  { path: '**', redirectTo: '' },
];
