import { Component } from '@angular/core';
import { HexagonComponent } from "../hexagon/hexagon.component";
import { CommonModule } from '@angular/common';

const enum Dot {
  RED = "Powered",
  BLU = "Extended",
  YELLOW = "Doubled",
}
enum ActionType {
  NONE = "none",
  MOVE = "move",
  HIT = "hit",
  CONTROL = "control",
  TRAP = "trap",
  BUILD = "build",
  BOMB = "bomb",
  DODGE = "dodge",
  BUFF = "buff",
  SPRINT = "sprint",
  REACH = "reach"
}
type Gambit = { hp: number }
type Box = { hp: number }
type Barrier = { hp: number }
type Hex = {
  id: string,
  color: string,
  isMidzone?: boolean,
  dots?: Dot[],
  hasBox?: Box,
  hasBarrier?: Barrier,
  hasGambit?: Gambit,
  hasAdverser?: boolean,
  isHighlighted?: boolean
};
const enum Team {
  RED = "bg-fuchsia-400",
  BLU = "bg-emerald-400",
  NEUTRAL = "bg-slate-400",
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
  selectedBoosts = {
    extended: 0,
    doubled: 0,
    powered: 0
  }
  isEvents: boolean = true;
  hasAdverser: boolean = false;
  highlightedHexes = new Set<string>();
  currentAction: ActionType = ActionType.NONE; // Stato attuale dell'azione
  actionType = ActionType;
  math = Math;

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
    if (reset) {
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
        hex.hasBox = undefined;
        hex.hasBarrier = undefined;
        hex.hasGambit = undefined;
        hex.dots = [];
        hex.hasAdverser = false;
        hex.isHighlighted = false; // 🔥 RESETTA l'highlight visivo
      });
    });

    this.highlightedHexes.clear(); // 🔥 Pulisce anche il Set usato per l'highlight

    this.selectedBoosts = {
      extended: 0,
      doubled: 0,
      powered: 0
    };

    this.currentAction = ActionType.NONE; // 🔄 Reset anche dell’azione attiva

    this.hasAdverser = false;

    this.grid = [...this.grid]; // 🔥 Forza il Change Detection
    console.log("🔄 Reset completato! Griglia, highlight e boost resettati.");
  }

  putAdverser(event: string) {
    let selectedHex = this.grid.flat().find(hex => hex.id === event);
    if (!selectedHex) return;

    if (selectedHex.hasAdverser) {
      selectedHex.hasAdverser = false; // Deseleziona l'Adverser
      this.highlightedHexes.clear(); // Rimuove l'highlight
    } else {
      this.grid.flat().forEach(hex => (hex.hasAdverser = false)); // Resetta gli altri
      selectedHex.hasAdverser = true;

      if (this.currentAction !== ActionType.NONE) {
        this.expandActionArea(); // Ricalcola l'espansione per l'azione attiva
      }
    }

    this.hasAdverser = this.grid.flat().some(hex => hex.hasAdverser);

    this.grid = [...this.grid]; // 🔥 Forza il Change Detection
  }

  addBoost(type: Dot) {
    switch (type) {
      case Dot.BLU:
        this.selectedBoosts.extended++;
        break;

      case Dot.RED:
        this.selectedBoosts.powered++;
        break;

      case Dot.YELLOW:
        this.selectedBoosts.doubled++;
        break;
    }
    this.expandActionArea();

    this.grid = [...this.grid]; // Forza il Change Detection
  }

  setHexColor(defaultColor: string, hasAdverser: boolean = false, isHighlighted: boolean = false): string {
    if(!this.isEvents){
      if (hasAdverser) {
        return "bg-[url(assets/Adverser.png)] bg-cover";
      }
      if (isHighlighted) {
        return "bg-blue-700 blur-sm"; // Giallo per celle evidenziate
      }
    }
    return defaultColor;
  }

  activateAction(action: ActionType) {
    if (!this.grid.flat().some(hex => hex.hasAdverser)) {
      console.warn("⚠️ Nessun esagono selezionato! Seleziona un esagono prima di attivare un'azione.");
      return;
    }

    if (this.currentAction === action) {
      this.currentAction = ActionType.NONE; // Disattiva l'azione
      this.highlightedHexes.clear(); // Rimuove l'highlight
    } else {
      this.currentAction = action;
      this.expandActionArea(); // Applica l'espansione basata sull'azione
    }

    this.grid = [...this.grid]; // 🔥 Forza il Change Detection
  }

  // 🔹 Espansione per l'azione attiva
  private expandActionArea() {
    const selectedHex = this.grid.flat().find(hex => hex.hasAdverser);
    if (!selectedHex) return;

    this.highlightedHexes.clear();
    const range = this.selectedBoosts.extended;

    if (range === 0) {
      const neighbors = HEX_ADJACENCY_MAP[selectedHex.id] || [];
      neighbors.forEach(neighborId => this.highlightedHexes.add(neighborId));
    } else {
      const expansionMap = generateExpansionMap(range + 1);
      const expandedHexes = expansionMap[selectedHex.id] || [];
      expandedHexes.forEach(neighborId => this.highlightedHexes.add(neighborId));
    }

    this.grid = [...this.grid]; // 🔥 Forza il Change Detection
  }

  isActionDisabled(action: ActionType): boolean {
    // const hasAdverser = this.grid.flat().some(hex => hex.hasAdverser);

    // 1️⃣ Nessun esagono selezionato → disabilita
    if (!this.hasAdverser) return true;

    // 2️⃣ Se è attiva un’altra azione → disabilita
    if (this.currentAction !== ActionType.NONE && this.currentAction === action) {
      return true;
    }

    // ✅ Altrimenti l'azione è abilitata
    return false;
  }
}

function generateExpansionMap(range: number): Record<string, string[]> {
  let expansionMap: Record<string, Set<string>> = {};

  Object.keys(HEX_ADJACENCY_MAP).forEach(hexId => {
    let visited = new Set<string>();
    let queue: [string, number][] = [[hexId, 0]]; // [hexId, depth]

    while (queue.length > 0) {
      let [currentHex, depth] = queue.shift()!;

      if (depth >= range) continue;
      if (!HEX_ADJACENCY_MAP[currentHex]) continue;

      HEX_ADJACENCY_MAP[currentHex].forEach(neighbor => {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([neighbor, depth + 1]);
        }
      });
    }

    expansionMap[hexId] = visited; // Salviamo la lista di esagoni espansi per ogni hex
  });

  // Convertiamo Set<string> in string[]
  let result: Record<string, string[]> = {};
  Object.keys(expansionMap).forEach(hexId => {
    result[hexId] = Array.from(expansionMap[hexId]);
  });

  return result;
}

const HEX_ADJACENCY_MAP: Record<string, string[]> = {
  "1": ["2", "6"],
  "2": ["1", "3", "6", "7"],
  "3": ["2", "4", "7", "8"],
  "4": ["3", "5", "8", "9"],
  "5": ["4", "9", "10"],
  "6": ["1", "2", "7", "11", "12"],
  "7": ["2", "3", "6", "8", "12", "13"],
  "8": ["3", "4", "7", "9", "13", "14"],
  "9": ["4", "5", "8", "10", "14", "15"],
  "10": ["5", "9", "15"],
  "11": ["6", "12", "16"],
  "12": ["6", "7", "11", "13", "16", "17"],
  "13": ["7", "8", "12", "14", "17", "18"],
  "14": ["8", "9", "13", "15", "18", "19"],
  "15": ["9", "10", "14", "19", "20"],
  "16": ["11", "12", "17", "21", "22"],
  "17": ["12", "13", "16", "18", "22", "23"],
  "18": ["13", "14", "17", "19", "23", "24"],
  "19": ["14", "15", "18", "20", "24", "25"],
  "20": ["15", "19", "25"],
  "21": ["16", "22", "26"],
  "22": ["16", "17", "21", "23", "26", "27"],
  "23": ["17", "18", "22", "24", "27", "28"],
  "24": ["18", "19", "23", "25", "28", "29"],
  "25": ["19", "20", "24", "29", "30"],
  "26": ["21", "22", "27"],
  "27": ["22", "23", "26", "28"],
  "28": ["23", "24", "27", "29"],
  "29": ["24", "25", "28", "30"],
  "30": ["25", "29"]
};
