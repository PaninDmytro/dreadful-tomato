import { animate, style, transition, trigger } from '@angular/animations';

export const fadeInOutAnimation = trigger('fadeInOutAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('600ms ease-in', style({ opacity: 1 })),
  ]),
  transition(':leave', [
    animate('600ms ease-out', style({ opacity: 0 })),
  ]),
]);
