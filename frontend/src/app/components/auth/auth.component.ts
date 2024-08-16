import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'hsel-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss',
  standalone: true,
  imports: [RouterOutlet],
})
export class AuthComponent {}
