import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home').then(m => m.HomePage), title: 'CL-B · Journeys that host the world' },
  { path: 'experiences', loadComponent: () => import('./pages/experiences').then(m => m.ExperiencesPage), title: 'Experiences · CL-B' },
  { path: 'plan', loadComponent: () => import('./pages/plan').then(m => m.PlanPage), title: 'Plan your journey · CL-B' },
  { path: 'events', loadComponent: () => import('./pages/events').then(m => m.EventsPage), title: 'Events · CL-B' },
  { path: 'about', loadComponent: () => import('./pages/about').then(m => m.AboutPage), title: 'About · CL-B' },
  { path: '**', redirectTo: '' },
];
