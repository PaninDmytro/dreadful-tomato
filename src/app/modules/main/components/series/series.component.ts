import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, NgForOf, NgIf, NgStyle } from "@angular/common";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BehaviorSubject, combineLatest, map, Observable, startWith } from "rxjs";

import { DateComponent } from "../../../../shared/components/date/date.component";
import { InputComponent } from "../../../../shared/components/input/input.component";
import { IMovie } from "../../../../core/interfaces/movie.interface";
import { ISeries } from "../../../../core/interfaces/series.interface";
import { ContentService } from "../../../../core/services/content.service";
import { PaginationComponent } from "../../../../shared/components/pagination/pagination.component";
import { FormService } from "../../../../core/services/form.service";
import { fadeInOutAnimation } from "../../../../core/animations/fadeIn-out.animation";

@Component({
  selector: 'app-series',
  standalone: true,
  imports: [
    AsyncPipe,
    DateComponent,
    FormsModule,
    InputComponent,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NgStyle,
    PaginationComponent
  ],
  templateUrl: './series.component.html',
  styleUrl: './series.component.scss',
  animations: [fadeInOutAnimation]
})
export class SeriesComponent implements OnInit {
  contentService: ContentService = inject(ContentService);
  public formService: FormService = inject(FormService);
  public filterForm: FormGroup = this.formService.filterForm;
  public series$: Observable<ISeries[]> = this.contentService.getSeries();
  public filteredSeries$: Observable<IMovie[]> = new Observable<IMovie[]>();
  public currentPageSubject = new BehaviorSubject<number>(1);
  public currentPage$ = this.currentPageSubject.asObservable();
  public itemsPerPage: number = 10;
  public totalItems: number = 0;
  public visiblePages: number[] = [];
  public currentPage: number = 1;

  ngOnInit(): void {
    this.setupFilterObservables();
  }

  private setupFilterObservables(): void {
    const search$ = this.filterForm.controls['search'].valueChanges.pipe(startWith(''));
    const year$ = this.filterForm.controls['year'].valueChanges.pipe(startWith(''));

    this.filteredSeries$ = combineLatest([this.series$, search$, year$, this.currentPage$])
      .pipe(
        map(([series, search, year, currentPage]) => this.filterAndPaginateSeries(series, search, year, currentPage))
      );
  }

  private filterAndPaginateSeries(series: ISeries[], search: string, year: string, currentPage: number): IMovie[] {
    const { filteredMovies, totalItems } = this.contentService.filterAndPaginateMovies(series, search, +year, currentPage, this.itemsPerPage);
    this.totalItems = totalItems;
    this.currentPage = currentPage;
    this.updateVisiblePages(currentPage);
    return filteredMovies;
  }

  changePage(page: number): void {
    this.currentPageSubject.next(page);
  }

  get pages(): number[] {
    return Array(Math.ceil(this.totalItems / this.itemsPerPage)).fill(0).map((_, i) => i + 1);
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
