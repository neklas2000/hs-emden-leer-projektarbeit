import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';

import { Subscription, take } from 'rxjs';

import { AuthenticationService } from '@Services/authentication.service';
import { Undefinable } from '@Types';
import { ThemeMode, ThemeService } from '@Services/theme.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  hide: boolean = true;
  formGroup: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  themeMode: ThemeMode = ThemeMode.DARK;
  private themeSubscription: Undefinable<Subscription> = undefined;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router,
    private readonly theme: ThemeService,
  ) {}

  ngOnInit(): void {
    this.themeSubscription = this.theme.modeStateChanged$.subscribe((mode) => {
      this.themeMode = mode;
    });
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  login(): void {
    this.authenticationService.login(this.email, this.password)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  toggleHide(ev: MouseEvent): void {
    ev.preventDefault();

    this.hide = !this.hide;
  }

  get email(): string {
    return this.formGroup.get('email')?.value || '';
  }

  get password(): string {
    return this.formGroup.get('password')?.value || '';
  }
}
