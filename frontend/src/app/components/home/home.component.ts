import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion'

@Component({
  selector: 'hsel-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
  imports: [MatExpansionModule],
})
export class HomeComponent { }
