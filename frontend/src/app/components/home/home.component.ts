import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion'

@Component({
  selector: 'hsel-home',
  standalone: true,
  imports: [MatExpansionModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent { }
