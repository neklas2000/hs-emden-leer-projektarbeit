import { Component, OnInit } from '@angular/core';

import { TitleService } from '../../services/title.service';

@Component({
  selector: 'hsel-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true,
})
export class HomeComponent implements OnInit {
  constructor(private readonly title: TitleService) {}

  ngOnInit(): void {
    this.title.reset();
  }
}
