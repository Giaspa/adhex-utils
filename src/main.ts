import { bootstrapApplication, provideClientHydration } from '@angular/platform-browser';
import { ArenaComponent } from './features/arena/arena.component';

// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));
bootstrapApplication(ArenaComponent, {
  providers: [] // Rimuovi provideClientHydration() se causa problemi
});
