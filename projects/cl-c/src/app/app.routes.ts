import { Routes } from '@angular/router';

const T = (t: string) => t + ' · Ludhiana Hospital';
export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home').then(m => m.HomePage), title: 'Ludhiana Hospital · Multi-speciality care in Ludhiana' },
  { path: 'specialities', loadComponent: () => import('./pages/specialities').then(m => m.SpecialitiesPage), title: T('Specialities') },
  { path: 'specialities/:slug', loadComponent: () => import('./pages/speciality').then(m => m.SpecialityPage), title: T('Speciality') },
  { path: 'doctors', loadComponent: () => import('./pages/doctors').then(m => m.DoctorsPage), title: T('Find a Doctor') },
  { path: 'book', loadComponent: () => import('./pages/book').then(m => m.BookPage), title: T('Book Appointment') },
  { path: 'health-checks', loadComponent: () => import('./pages/packages').then(m => m.PackagesPage), title: T('Health Checks') },
  { path: 'patient-portal', loadComponent: () => import('./pages/portal').then(m => m.PortalPage), title: T('Patient Portal') },
  { path: 'emergency', loadComponent: () => import('./pages/emergency').then(m => m.EmergencyPage), title: T('Emergency') },
  { path: 'insurance', loadComponent: () => import('./pages/insurance').then(m => m.InsurancePage), title: T('Insurance & TPA') },
  { path: 'health-library', loadComponent: () => import('./pages/library').then(m => m.LibraryPage), title: T('Health Library') },
  { path: 'about', loadComponent: () => import('./pages/about').then(m => m.AboutPage), title: T('About') },
  { path: 'contact', loadComponent: () => import('./pages/contact').then(m => m.ContactPage), title: T('Contact') },
  { path: ':svc', loadComponent: () => import('./pages/service').then(m => m.ServicePage) },
];
