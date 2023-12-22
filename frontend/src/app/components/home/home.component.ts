import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  @Input() title!: string;
  @Output() private onClick!: EventEmitter<void>;
  projects: any[] = [{
    id: 1,
    name: 'Softwareprojektmanagement - ByteBusters'
  }, {
    id: 2,
    name: 'Data Science - ByteBusters'
  }, {
    id: 3,
    name: 'Projektarbeit'
  }]

  constructor() {
    this.onClick = new EventEmitter();
  }

  onLoginClick(): void {
    this.onClick.emit();
  }
}
