import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

import { TitleService } from '../../../services/title.service';
import { TitleState } from '../../../utils/title-state';

@Component({
  selector: 'hsel-header',
  imports: [MatToolbarModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
})
export class HeaderComponent implements OnInit {
  title = new TitleState('Meilensteintrendanalyse');
  subtitle = new TitleState('Hochschule Emden/Leer');

  constructor(private readonly titleService: TitleService) {}

  ngOnInit(): void {
    this.titleService.title$.subscribe((title) => {
      if (!title) {
        this.title.reset();
        this.subtitle.reset();
      } else {
        this.title.update(title);
        this.subtitle.update(null);
      }
    });
  }
}
