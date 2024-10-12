import { animate, style, transition, trigger } from "@angular/animations";

export const slideInFromRightAnimation = trigger('slideInFromRight', [
  transition(':enter', [
    style({ transform: 'translateX(100%)', opacity: 0 }),
    animate('1000ms ease-out', style({ transform: 'translateX(0)', opacity: 1 })),
  ]),
  transition(':leave', [
    animate('1000ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 })),
  ]),
]);

