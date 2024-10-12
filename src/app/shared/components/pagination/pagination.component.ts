import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgForOf } from "@angular/common";

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input()
  currentPage: number = 0;
  @Input()
  visiblePages: number[] = [];
  @Input()
  pages: number[] = [];

  @Output()
  changePageEmitter: EventEmitter<number> = new EventEmitter();

  public changePage(page: number): void {
    this.changePageEmitter.emit(page);
  }
}
