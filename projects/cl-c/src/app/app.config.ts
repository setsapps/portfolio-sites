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
      fonts: [
        { id: 'fraunces', label: 'Fraunces + Plus Jakarta Sans', display: "'Fraunces', Georgia, serif", body: "'Plus Jakarta Sans', system-ui, sans-serif" },
        { id: 'playfair', label: 'Playfair Display + Poppins', display: "'Playfair Display', Georgia, serif", body: "'Poppins', system-ui, sans-serif", href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Poppins:wght@400;500;600;700&display=swap' },
        { id: 'lora', label: 'Lora + Nunito Sans', display: "'Lora', Georgia, serif", body: "'Nunito Sans', system-ui, sans-serif", href: 'https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,600;0,700;1,600&family=Nunito+Sans:wght@400;600;700;800&display=swap' },
        { id: 'dmserif', label: 'DM Serif Display + Mulish', display: "'DM Serif Display', Georgia, serif", body: "'Mulish', system-ui, sans-serif", href: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Mulish:wght@400;500;600;700;800&display=swap' },
        { id: 'baskerville', label: 'Libre Baskerville + Source Sans 3', display: "'Libre Baskerville', Georgia, serif", body: "'Source Sans 3', system-ui, sans-serif", href: 'https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Source+Sans+3:wght@400;500;600;700&display=swap' },
      ],
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
