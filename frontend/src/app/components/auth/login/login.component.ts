import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../../services/authentication.service';
import { take } from 'rxjs';

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
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('svgContainer') svgContainer!: ElementRef<HTMLDivElement>;

  hide: boolean = true;
  formGroup: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  private logo!: string;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly activatedRoute: ActivatedRoute,
    private readonly authenticationService: AuthenticationService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.pipe(take(1)).subscribe(({ logo }) => {
      this.logo = logo;
    });
  }

  ngAfterViewInit(): void {
    this.svgContainer.nativeElement.innerHTML = this.logo;
  }

  login(): void {
    this.authenticationService.login(this.email, this.password)
      .pipe(take(1))
      .subscribe((result) => {
        if (typeof result === 'boolean' && result == true) {
          this.router.navigateByUrl('/');
        } else {
          console.log(result);
        }
      });
  }

  get email(): string {
    return this.formGroup.get('email')?.value || '';
  }

  get password(): string {
    return this.formGroup.get('password')?.value || '';
  }
}
