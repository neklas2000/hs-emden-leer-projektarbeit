import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { DateTime } from 'luxon';

import { MilestoneEstimate } from '@Models/milestone-estimate';
import { Nullable } from '@Types';
import { FormValidators } from '@Validators';

@Component({
  selector: 'hsel-milestone-estimate-form-field',
  templateUrl: './milestone-estimate-form-field.component.html',
  styleUrl: './milestone-estimate-form-field.component.scss',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
})
export class MilestoneEstimateFormFieldComponent implements OnInit {
	@Input() estimate!: MilestoneEstimate;
  @Input() allowedDates: string[] = [];
	form!: FormGroup;
  minDate: Nullable<DateTime> = null;
  maxDate: Nullable<DateTime> = null;

	constructor(private readonly formBuilder: FormBuilder) {}

	ngOnInit(): void {
		this.form = this.formBuilder.group({
			estimationDate: [this.estimate.estimationDate, [FormValidators.required]],
		});

    if (this.allowedDates.length > 0) {
      this.minDate = DateTime.fromSQL(this.allowedDates[0]);
      this.maxDate = DateTime.fromSQL(this.allowedDates[this.allowedDates.length - 1]);
    }
	}

  private filterDates(date: DateTime | null): boolean {
    if (!date) return false;

    for (const allowedDate of this.allowedDates) {
      if (date.toFormat('yyyy-MM-dd') === allowedDate) return true;
    }

    return false;
  }

  boundFilterDates = this.filterDates.bind(this);

  get value(): Nullable<DateTime> {
    const value = this.form.get('estimationDate')?.value;

    if (!value || (typeof value === 'string' && value.length === 0)) return null;

    return value;
  }
}
