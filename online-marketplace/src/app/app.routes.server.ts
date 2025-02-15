import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'retail/product/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'vehicles/:id',
    renderMode: RenderMode.Server,
   
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
