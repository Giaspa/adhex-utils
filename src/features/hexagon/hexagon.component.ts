import { Component, Input } from '@angular/core';

@Component({
  selector: 'hexagon',
  imports: [],
  standalone: true,
  templateUrl: './hexagon.component.html',
  styleUrl: './hexagon.component.css'
})
export class HexagonComponent {
  @Input() color: string = "bg-blue-500"
}
