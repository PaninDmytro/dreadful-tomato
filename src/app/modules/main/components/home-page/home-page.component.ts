import { Component } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { AsyncPipe, NgClass, NgForOf } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgForOf,
    AsyncPipe,
    RouterLink,
    NgClass,
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
  sections = [
    { title: 'Movies', link: ['/main', 'movies'], class: 'home_movies' },
    { title: 'Series', link: ['/main', 'series'], class: 'home_series' }
  ];
}
