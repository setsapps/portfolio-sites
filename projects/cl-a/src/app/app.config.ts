import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { SITE } from '@shared/core';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top', anchorScrolling: 'enabled' }), withComponentInputBinding(), withViewTransitions()),
    { provide: SITE, useValue: {
      key: 'cla', dial: '+1',
      fonts: [
        { id: 'bodoni', label: 'Bodoni Moda + Manrope', display: "'Bodoni Moda', Didot, serif", body: "'Manrope', system-ui, sans-serif" },
        { id: 'playfair', label: 'Playfair Display + Inter', display: "'Playfair Display', Georgia, serif", body: "'Inter', system-ui, sans-serif", href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600;700&display=swap' },
        { id: 'cormorant', label: 'Cormorant Garamond + Montserrat', display: "'Cormorant Garamond', Georgia, serif", body: "'Montserrat', system-ui, sans-serif", href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Montserrat:wght@400;500;600;700&display=swap' },
        { id: 'italiana', label: 'Italiana + Outfit', display: "'Italiana', Georgia, serif", body: "'Outfit', system-ui, sans-serif", href: 'https://fonts.googleapis.com/css2?family=Italiana&family=Outfit:wght@400;500;600;700&display=swap' },
        { id: 'dmserif', label: 'DM Serif Display + DM Sans', display: "'DM Serif Display', Georgia, serif", body: "'DM Sans', system-ui, sans-serif", href: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600;700&display=swap' },
      ],
      brand: 'CL-A',
      themes: [
        { id: 'rose', label: 'Rosé', swatch: ['#b8235a', '#ef9a86', '#fff7f4'] },
        { id: 'peony', label: 'Peony', swatch: ['#c2185b', '#ff6f9c', '#ff8a65'] },
        { id: 'champagne', label: 'Champagne', swatch: ['#8c2f4b', '#c49a52', '#fbf7ef'] },
        { id: 'noir', label: 'Noir', swatch: ['#130a10', '#ff6f9c', '#e9b872'], dark: true },
        { id: 'contrast', label: 'High contrast', swatch: ['#000', '#8a0036', '#fff'] },
      ],
      lockMode: 'email', lockTitle: 'Sign in to the Members’ Lounge',
      lockNote: 'Members-only content is protected by role-based access.',
    } },
  ],
};
