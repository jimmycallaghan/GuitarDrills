import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ChordPracticeComponent} from "./chord-practice/chord-practice.component";
import {ChordDiagramComponent} from "./chord-diagram/chord-diagram.component";

const appRoutes: Routes = [
  {path: '', component: ChordPracticeComponent, pathMatch: 'full'},
  {path: 'chord-diagram', component: ChordDiagramComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
