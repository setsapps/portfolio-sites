import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { SITE } from '@shared/core';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }), withComponentInputBinding(), withViewTransitions()),
    { provide: SITE, useValue: {
      key: 'lh', dial: '+91',
      fontScale: 0.9,
      brand: 'Ludhiana Hospital',
      themes: [
        { id: 'saffron', label: 'Saffron', swatch: ['#0b6b6f', '#e9812a', '#fffaf3'] },
        { id: 'royal', label: 'Royal', swatch: ['#1e3a8a', '#e9812a', '#f7f9ff'] },
        { id: 'emerald', label: 'Emerald', swatch: ['#0f6b45', '#c98a1b', '#f6fbf7'] },
        { id: 'rose', label: 'Rose', swatch: ['#8e1f3d', '#e9812a', '#fff7f7'] },
        { id: 'night', label: 'Night', swatch: ['#0c1517', '#3cc6c0', '#f5a259'], dark: true },
        { id: 'contrast', label: 'High contrast', swatch: ['#000', '#00474b', '#fff'] },
      ],
      lockMode: 'otp-referral', lockTitle: 'Patient sign-in',
      lockNote: 'Your records are protected. Access needs a verified mobile number and a doctor referral.',
    } },
  ],
};
