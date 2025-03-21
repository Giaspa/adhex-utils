import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'hexagon',
  imports: [],
  standalone: true,
  templateUrl: './hexagon.component.html',
  styleUrl: './hexagon.component.css'
})
export class HexagonComponent {
  @Input() color: string = "bg-blue-500"
  @Input() hexId: string = "1"
  @Output() clickEventEmitter: EventEmitter<any> = new EventEmitter<any>();

  clickHandle(){
    this.clickEventEmitter.emit(this.hexId)
  }
}
