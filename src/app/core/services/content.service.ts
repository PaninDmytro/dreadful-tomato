import { inject, Injectable } from '@angular/core';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";

import { IMovie, IMovieResponse } from "../interfaces/movie.interface";
import { EContent } from "../enums/content.enum";
import { ISeries } from "../interfaces/series.interface";

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  private url = 'https://static.rviewer.io/challenges/datasets/dreadful-tomatoes/data.json';
  private http: HttpClient = inject(HttpClient);

  private getEntriesByType<T extends { programType: EContent }>(programType: EContent): Observable<T[]> {
    return this.http.get<IMovieResponse>(this.url)
      .pipe(
        map(response => response.entries.filter(entry => entry.programType === programType) as unknown as T[]),
        catchError(this.handleError)
      );
  }

  getMovies(): Observable<IMovie[]> {
    return this.getEntriesByType<IMovie>(EContent.MOVIE);
  }

  getSeries(): Observable<ISeries[]> {
    return this.getEntriesByType<ISeries>(EContent.SERIES);
  }

  filterAndPaginateMovies(movies: IMovie[], search: string, year: number, currentPage: number, itemsPerPage: number): { filteredMovies: IMovie[], totalItems: number } {
    let filteredMovies = [...movies];

    if (year) {
      filteredMovies = filteredMovies.filter(movie => movie.releaseYear === +year);
    }

    if (search) {
      const normalizedSearch = search.trim().toLowerCase();
      filteredMovies = filteredMovies.filter(movie =>
        movie.title.toLowerCase().includes(normalizedSearch)
      );
    }

    const totalItems = filteredMovies.length;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedMovies = filteredMovies.slice(startIndex, startIndex + itemsPerPage);

    return { filteredMovies: paginatedMovies, totalItems };
  }

  private handleError(err: any): Observable<never> {
    console.error('Error occurred:', err);
    return EMPTY;
  }
}
