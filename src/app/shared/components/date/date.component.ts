import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CalendarModule } from "primeng/calendar";

@Component({
  selector: 'app-date',
  standalone: true,
  templateUrl: './date.component.html',
  styleUrls: ['./date.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateComponent),
      multi: true,
    },
  ],
  imports: [
    CalendarModule,
    FormsModule
  ]
})
export class DateComponent implements ControlValueAccessor {
  value: string | null = null;

  writeValue(value: string | null): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onChange = (value: string | null) => { };
  onTouched = () => { };

  onDateChange(event: any) {
    if (!event) return;

    const date = new Date(event);
    const year = date.getFullYear().toString();

    this.value = year;
    this.onChange(year);
    this.onTouched();
  }
}
