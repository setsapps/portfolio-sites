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
      fontScale: 0.9,
      brand: 'Velora',
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
