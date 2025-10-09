import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, ContentChildren, Input, OnChanges, QueryList, SimpleChanges } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { AuthStepComponent } from '../auth-step/auth-step.component';
import { LogoComponent } from '../../logo/logo.component';
import { I18nModule } from "../../i18n/i18n.module";

@Component({
  selector: 'hsel-auth-stepper',
  imports: [MatCardModule, CommonModule, LogoComponent, I18nModule],
  templateUrl: './auth-stepper.component.html',
  styleUrl: './auth-stepper.component.scss',
  standalone: true,
})
export class AuthStepperComponent implements AfterContentInit, OnChanges {
  @Input() i18nTitle!: string;
  @Input() step = -1;
  @ContentChildren(AuthStepComponent) steps!: QueryList<AuthStepComponent>;
  activeStep!: AuthStepComponent;
  private afterContentInit: boolean = false;

  ngAfterContentInit(): void {
    this.afterContentInit = true;

    if (this.steps && this.steps.length > 0 && this.step < 0) {
      this.step = 0;
    }

    this.renderSteps();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (Object.hasOwn(changes, 'step')) {
      this.renderSteps();
    }
  }

  private renderSteps(): void {
    if (!this.afterContentInit) return;

    for (const step of this.steps) {
      step.updateDisplay('none');
    }

    if (this.step > -1) {
      const step = this.steps.get(this.step)!
      step.updateDisplay('block');
      this.activeStep = step;
    }
  }
}
