import { Component } from '@angular/core';
import { NgFor } from "@angular/common";
import { RouterLink } from "@angular/router";

import { footerNav } from "../../constants/footer-nav.constant";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    NgFor,
    RouterLink
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  public footerNav: string[] = footerNav;
}
