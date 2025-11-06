import { Component, Input } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'app-stats-card',
  imports: [NgClass, CommonModule],
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.scss']
})
export class StatsCardComponent {
  @Input() label!: string;
  @Input() value!: string | number
  @Input() color?: string;
}
