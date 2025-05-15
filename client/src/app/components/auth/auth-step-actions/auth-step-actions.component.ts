import { Component, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'hsel-auth-step-actions',
  imports: [],
  templateUrl: './auth-step-actions.component.html',
  styleUrl: './auth-step-actions.component.scss',
  standalone: true,
})
export class AuthStepActionsComponent {
  @ViewChild(TemplateRef, { static: true }) templateRef!: TemplateRef<unknown>;
}
