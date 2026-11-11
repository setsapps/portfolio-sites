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
      fontScale: 0.9,
      brand: 'CL-B',
      themes: [
        { id: 'glacier', label: 'Glacier', swatch: ['#07111a', '#7fe3ff', '#b49bff'], dark: true },
        { id: 'ember', label: 'Ember', swatch: ['#0d0a12', '#ffb25b', '#ff5f8f'], dark: true },
        { id: 'forest', label: 'Forest', swatch: ['#0a120d', '#b6e36b', '#57d9a3'], dark: true },
        { id: 'sunrise', label: 'Sunrise', swatch: ['#fff8f1', '#d9581f', '#d6336c'] },
        { id: 'contrast', label: 'High contrast', swatch: ['#000', '#ffd400', '#00e5ff'], dark: true },
      ],
      lockMode: 'email', lockTitle: 'Sign in to CL-B',
      lockNote: 'Bookings, wishlists and member rates need a verified account.',
    } },
  ],
};
