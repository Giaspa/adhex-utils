import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HexagonComponent } from "../features/hexagon/hexagon.component";
import { ArenaComponent } from "../features/arena/arena.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HexagonComponent, ArenaComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'adhex-utils';
}
