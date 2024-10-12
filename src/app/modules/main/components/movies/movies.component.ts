import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe, NgForOf, NgIf, NgOptimizedImage, NgStyle } from "@angular/common";
import { combineLatest, map, Observable, startWith, BehaviorSubject } from "rxjs";

import { ContentService } from "../../../../core/services/content.service";
import { IMovie } from "../../../../core/interfaces/movie.interface";
import { DateComponent } from "../../../../shared/components/date/date.component";
import { InputComponent } from "../../../../shared/components/input/input.component";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { PaginationComponent } from "../../../../shared/components/pagination/pagination.component";
import { FormService } from "../../../../core/services/form.service";
import { fadeInOutAnimation } from "../../../../core/animations/fadeIn-out.animation";

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    DatePipe,
    NgForOf,
    NgOptimizedImage,
    NgStyle,
    DateComponent,
    InputComponent,
    ReactiveFormsModule,
    PaginationComponent
  ],
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss'],
  animations: [fadeInOutAnimation],
})
export class MoviesComponent implements OnInit {
  contentService: ContentService = inject(ContentService);
  public formService: FormService = inject(FormService);
  public movies$: Observable<IMovie[]> = this.contentService.getMovies();
  public filterForm: FormGroup = this.formService.filterForm;
  public filteredMovies$: Observable<IMovie[]> = new Observable<IMovie[]>();

  private currentPageSubject = new BehaviorSubject<number>(1);
  public currentPage$ = this.currentPageSubject.asObservable();
  public itemsPerPage: number = 10;
  public totalItems: number = 0;
  public visiblePages: number[] = [];
  public currentPage: number = 0;

  ngOnInit(): void {
    this.setupFilterObservables();
  }

  private setupFilterObservables(): void {
    const search$ = this.filterForm.controls['search'].valueChanges.pipe(startWith(''));
    const year$ = this.filterForm.controls['year'].valueChanges.pipe(startWith(''));

    this.filteredMovies$ = combineLatest([this.movies$, search$, year$, this.currentPage$])
      .pipe(
        map(([movies, search, year, currentPage]) => this.filterAndPaginateMovies(movies, search, year, currentPage))
      );
  }

  private filterAndPaginateMovies(movies: IMovie[], search: string, year: string, currentPage: number): IMovie[] {
    const { filteredMovies, totalItems } = this.contentService.filterAndPaginateMovies(movies, search, +year, currentPage, this.itemsPerPage);
    this.totalItems = totalItems;
    this.currentPage = currentPage;
    this.updateVisiblePages(currentPage);
    return filteredMovies;
  }

  changePage(page: number): void {
    this.currentPageSubject.next(page);
  }

  get pages(): number[] {
    return Array(Math.ceil(this.totalItems / this.itemsPerPage)).fill(0).map((x, i) => i + 1);
  }

  private updateVisiblePages(currentPage: number): void {
    const totalPages = this.pages.length;
    const maxVisiblePages = 5;
    let startPage: number;
    let endPage: number;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
      endPage = totalPages;
    } else {
      const halfMaxVisible = Math.floor(maxVisiblePages / 2);
      if (currentPage <= halfMaxVisible) {
        startPage = 1;
        endPage = maxVisiblePages;
      } else if (currentPage + halfMaxVisible >= totalPages) {
        startPage = totalPages - maxVisiblePages + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - halfMaxVisible;
        endPage = currentPage + halfMaxVisible;
      }
    }

    this.visiblePages = Array.from({ length: (endPage - startPage + 1) }, (_, i) => startPage + i);
  }
}
