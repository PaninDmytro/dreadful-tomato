import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from "@angular/router";
import { filter, Observable, takeUntil } from "rxjs";
import { DestroyService } from "../../../core/services/destroy.service";
import { NgIf } from "@angular/common";
import { DateComponent } from "../date/date.component";
import { InputComponent } from "../input/input.component";
import { PaginatorModule } from "primeng/paginator";
import { FormGroup, ReactiveFormsModule } from "@angular/forms";
import { FormService } from "../../../core/services/form.service";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    DateComponent,
    InputComponent,
    PaginatorModule,
    ReactiveFormsModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  public router: Router = inject(Router);
  public destroyService: DestroyService = inject(DestroyService);
  public formService: FormService = inject(FormService);

  public isMoviesOrSeriesPage: boolean = false;
  public pageType: 'movies' | 'series' | '' = '';
  public movieForm: FormGroup = this.formService.filterForm;
  public isFilterActive: boolean = false;

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter<any>((event) => event instanceof NavigationEnd),
        takeUntil(this.destroyService),
      )
      .subscribe((event: NavigationEnd) => {
        const isIncludesMovies = event.url.includes('/movies');
        const isIncludesSeries = event.url.includes('/series');

          if (isIncludesMovies) {
            this.pageType = 'movies';
          }

          if (isIncludesSeries) {
            this.pageType = 'series';
          }

          return isIncludesMovies
          || isIncludesSeries
            ? this.isMoviesOrSeriesPage = true
            : this.isMoviesOrSeriesPage = false
        }
      );
  }

  public focusOnFilter(): void {
    this.isFilterActive = true;
  }

  public ofFilter(): void {
    this.isFilterActive = false;
  }
}
