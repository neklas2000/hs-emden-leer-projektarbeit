import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';

import { take } from 'rxjs';

import { AuthenticationService } from '@Services/authentication.service';
import { LogoComponent } from '@Components/logo/logo.component';
import { SnackbarMessage, SnackbarService } from '@Services/snackbar.service';
import { HttpException } from '@Utils/http-exception';

@Component({
  selector: 'hsel-login',
  standalone: true,
  imports: [
    LogoComponent,
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
export class LoginComponent {
  hide: boolean = true;
  formGroup: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router,
    private readonly snackbar: SnackbarService,
  ) {}

  login(): void {
    this.authenticationService.login(this.email, this.password)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.snackbar.showInfo(SnackbarMessage.LOGIN_SUCCEEDED);
          this.router.navigateByUrl('/');
        },
        error: (exception: HttpException) => {
          this.snackbar.showException(SnackbarMessage.INCORRECT_CREDENTIALS, exception);
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
