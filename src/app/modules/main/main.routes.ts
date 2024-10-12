import { Routes } from '@angular/router';
import { MainComponent } from "./main.component";


export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'home-page',
        pathMatch: 'full',
      },
      {
        path: 'home-page',
        loadComponent: () =>
          import('./components/home-page/home-page.component').then(
            (c) => c.HomePageComponent,
          ),
        title: 'Home page',
      },
      {
        path: 'movies',
        loadComponent: () =>
          import('./components/movies/movies.component').then(
            (c) => c.MoviesComponent,
          ),
        title: 'Movies',
      },
      {
        path: 'series',
        loadComponent: () =>
          import('./components/series/series.component').then(
            (c) => c.SeriesComponent,
          ),
        title: 'Series',
      }
    ],
  },
];
