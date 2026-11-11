import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withComponentInputBinding } from '@angular/router';
import { SITE } from '@shared/core';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }), withComponentInputBinding()),
    { provide: SITE, useValue: {
      key: 'clb', dial: '+1',
      fonts: [
        { id: 'syne', label: 'Syne + Inter', display: "'Syne', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif" },
        { id: 'unbounded', label: 'Unbounded + Manrope', display: "'Unbounded', system-ui, sans-serif", body: "'Manrope', system-ui, sans-serif", href: 'https://fonts.googleapis.com/css2?family=Unbounded:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap' },
        { id: 'grotesk', label: 'Space Grotesk + Inter', display: "'Space Grotesk', system-ui, sans-serif", body: "'Inter', system-ui, sans-serif", href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&display=swap' },
        { id: 'bricolage', label: 'Bricolage Grotesque + DM Sans', display: "'Bricolage Grotesque', system-ui, sans-serif", body: "'DM Sans', system-ui, sans-serif", href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=DM+Sans:wght@400;500;600;700&display=swap' },
        { id: 'fraunces', label: 'Fraunces + Inter', display: "'Fraunces', Georgia, serif", body: "'Inter', system-ui, sans-serif", href: 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,800&display=swap' },
      ],
      brand: 'CL-B',
      themes: [
        { id: 'ember', label: 'Ember', swatch: ['#0d0a12', '#ffb25b', '#ff5f8f'], dark: true },
        { id: 'glacier', label: 'Glacier', swatch: ['#07111a', '#7fe3ff', '#b49bff'], dark: true },
        { id: 'forest', label: 'Forest', swatch: ['#0a120d', '#b6e36b', '#57d9a3'], dark: true },
        { id: 'sunrise', label: 'Sunrise', swatch: ['#fff8f1', '#d9581f', '#d6336c'] },
        { id: 'contrast', label: 'High contrast', swatch: ['#000', '#ffd400', '#00e5ff'], dark: true },
      ],
      lockMode: 'email', lockTitle: 'Sign in to CL-B',
      lockNote: 'Bookings, wishlists and member rates need a verified account.',
    } },
  ],
};
