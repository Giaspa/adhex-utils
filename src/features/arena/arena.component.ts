import { Component } from '@angular/core';
import { HexagonComponent } from "../hexagon/hexagon.component";
import { CommonModule } from '@angular/common';

const enum Dot {
  RED = "Powered",
  BLU = "Extended",
  YELLOW = "Doubled",
}
type Gambit = { hp: number }
type Box = { hp: number }
type Barrier = { hp: number }
type Hex = { id: string, color: string, isMidzone?: boolean, dots?: Dot[], hasBox?: Box, hasBarrier?: Barrier, hasGambit?: Gambit };
const enum Team {
  RED = "bg-red-400",
  BLU = "bg-blue-400",
  NEUTRAL = "bg-gray-400",
}
@Component({
  selector: 'arena',
  imports: [CommonModule, HexagonComponent],
  templateUrl: './arena.component.html',
  styleUrl: './arena.component.css',
  host: { 'ngSkipHydration': 'true' }
})
export class ArenaComponent {
  rows = 6;
  cols = 5;
  grid: Hex[][] = [];
  rowColor: string[] = [
    Team.RED,
    Team.NEUTRAL,
    Team.NEUTRAL,
    Team.NEUTRAL,
    Team.NEUTRAL,
    Team.BLU,
  ]
  dots = {
    powered: Dot.RED,
    extended: Dot.BLU,
    doubled: Dot.YELLOW,
  };

  teamzoneA: Hex[][] = [
    [
      { id: "1", color: Team.NEUTRAL },
      { id: "2", color: Team.NEUTRAL },
      { id: "3", color: Team.NEUTRAL },
      { id: "4", color: Team.NEUTRAL },
      { id: "5", color: Team.NEUTRAL },
    ],
    [
      { id: "6", color: Team.NEUTRAL },
      { id: "7", color: Team.NEUTRAL },
      { id: "8", color: Team.NEUTRAL },
      { id: "9", color: Team.NEUTRAL },
      { id: "10", color: Team.NEUTRAL },
    ]
  ]

  midzone: Hex[][] = [
    [
      { id: "11", color: Team.NEUTRAL, isMidzone: true },
      { id: "12", color: Team.NEUTRAL, isMidzone: true },
      { id: "13", color: Team.NEUTRAL, isMidzone: true },
      { id: "14", color: Team.NEUTRAL, isMidzone: true },
      { id: "15", color: Team.NEUTRAL, isMidzone: true },
    ],
    [
      { id: "16", color: Team.NEUTRAL, isMidzone: true },
      { id: "17", color: Team.NEUTRAL, isMidzone: true },
      { id: "18", color: Team.NEUTRAL, isMidzone: true },
      { id: "19", color: Team.NEUTRAL, isMidzone: true },
      { id: "20", color: Team.NEUTRAL, isMidzone: true },
    ]
  ]

  teamzoneB: Hex[][] = [
    [
      { id: "21", color: Team.NEUTRAL },
      { id: "22", color: Team.NEUTRAL },
      { id: "23", color: Team.NEUTRAL },
      { id: "24", color: Team.NEUTRAL },
      { id: "25", color: Team.NEUTRAL },
    ],
    [
      { id: "26", color: Team.NEUTRAL },
      { id: "27", color: Team.NEUTRAL },
      { id: "28", color: Team.NEUTRAL },
      { id: "29", color: Team.NEUTRAL },
      { id: "30", color: Team.NEUTRAL },
    ]
  ]

  constructor() {
    this.generateGrid();

    this.rowColor.forEach((_, index) => {
      this.setColor(index)
    })
  }

  generateGrid() {
    this.grid = [...this.teamzoneA, ...this.midzone, ...this.teamzoneB]
    console.log("🚀 ~ ArenaComponent ~ generateGrid ~ this.grid:", this.grid)
  }

  changeColor(index: number) {
    const prevCol = this.rowColor[index];

    switch (prevCol) {
      case Team.RED:
        this.rowColor[index] = Team.BLU;
        break;
      case Team.BLU:
        this.rowColor[index] = Team.NEUTRAL;
        break;
      case Team.NEUTRAL:
        this.rowColor[index] = Team.RED;
        break;
    }

    this.setColor(index)
  }

  setColor(index: number) {
    this.grid[index].map(x => x.color = this.rowColor[index])
  }

  getSvgPath(fileName: string): string {
    return typeof window !== 'undefined' ? `/assets/${fileName}` : '';
  }

  boostRain() {
    this.reset();

    this.grid.forEach(row => {
      row.forEach(hex => {
        if (!hex.dots) {
          hex.dots = []; // 🔥 Inizializza se è undefined
        }
        const dot = this.getCasualDot();
        console.log("🚀 ~ ArenaComponent ~ boostRain ~ dot:", dot);

        hex.dots.push(dot);
      });
    });
    console.log("🚀 ~ ArenaComponent ~ boostRain ~ this.grid:", this.grid);
  }

  getCasualDot(): Dot {
    const casual = Math.floor(Math.random() * 3) + 1

    switch (casual) {
      case 1: return Dot.BLU;
      case 2: return Dot.RED;
      default: return Dot.YELLOW;
    }
  }

  dropBox(reset: boolean = true) {
    if(reset) {
      this.reset();
    }

    // Filtra gli esagoni della midzone
    const midzoneHexes = this.grid.flat().filter(hex => hex.isMidzone);

    // Controlla se ci sono esagoni nella midzone
    if (midzoneHexes.length === 0) {
      console.warn("🚨 Nessun esagono disponibile nella midzone!");
      return;
    }

    // Seleziona un esagono casuale
    const randomIndex = Math.floor(Math.random() * midzoneHexes.length);
    const chosenHex = midzoneHexes[randomIndex];

    // Se la box non esiste, la crea con 1 HP
    if (!chosenHex.hasBox) {
      chosenHex.hasBox = { hp: 1 };
    } else {
      // Se la box esiste, incrementa gli HP di 1
      chosenHex.hasBox.hp += 1;
    }

    // Se non ha già un array di dots, lo inizializza
    if (!chosenHex.dots) {
      chosenHex.dots = [];
    }

    // Aggiunge 2 dot casuali
    const firstDot = this.getCasualDot();
    let secondDot = this.getCasualDot();

    // Evitiamo che i due dot siano identici
    while (secondDot === firstDot) {
      secondDot = this.getCasualDot();
    }

    chosenHex.dots.push(firstDot, secondDot);

    console.log("📦 Box piazzata su:", chosenHex);
    console.log("🔴 Nuovi dot aggiunti:", firstDot, secondDot);
  }

  goldRush() {
    this.reset();

    for (let i = 0; i < 6; i++) {
      this.dropBox(false);
    }
    console.log("💰 Gold Rush attivata! 6 box piazzate casualmente.");
  }

  geomorphism() {
    this.reset();

    this.grid.forEach(row => {
      row.forEach(hex => {
        // Se l'Hex ha già una Box, lo saltiamo
        if (hex.hasBox) return;

        // 50% di possibilità di assegnare una Barrier
        if (Math.random() < 0.5) {
          hex.hasBarrier = { hp: 1 };

          // Se non ha già un array di dots, lo inizializza
          if (!hex.dots) {
            hex.dots = [];
          }

          // Aggiunge un nuovo Dot casuale
          hex.dots.push(this.getCasualDot());
        }
      });
    });

    // 🔥 Forza Angular a rilevare il cambiamento
    this.grid = [...this.grid];

    console.log("🛡️ Geomorphism attivato! Barriere posizionate sulla mappa.");
  }

  mouseTrap() {
    this.reset();

    this.grid.forEach(row => {
      row.forEach(hex => {
        // Se ha già una Box o una Barrier, lo saltiamo
        if (hex.hasBox || hex.hasBarrier) return;

        // 50% di possibilità di assegnare una Gambit (trappola)
        if (Math.random() < 0.5) {
          hex.hasGambit = { hp: 1 };

          // Se non ha già un array di dots, lo inizializza
          if (!hex.dots) {
            hex.dots = [];
          }

          // Aggiunge un nuovo Dot casuale
          hex.dots.push(this.getCasualDot());
        }
      });
    });

    // 🔥 Forza Angular a rilevare il cambiamento
    this.grid = [...this.grid];

    console.log("🐭 Mouse Trap attivata! Trappole posizionate sulla mappa.");
  }

  reset() {
    this.grid.forEach(row => {
      row.forEach(hex => {
        // 🔄 Rimuove Box, Barriere, Trappole e Dots
        hex.hasBox = undefined;
        hex.hasBarrier = undefined;
        hex.hasGambit = undefined;
        hex.dots = [];
      });
    });

    // 🔥 Forza il Change Detection di Angular
    this.grid = [...this.grid];

    console.log("🔄 Reset completato! La griglia è stata ripristinata.");
  }
}
