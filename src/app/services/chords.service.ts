import {ChordDefinition} from "../model/chord-definition.model";
import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class ChordsService {

  // chordsOld = ['A', 'Am', 'B', 'Bm', 'C', 'D', 'Dm', 'E', 'Em', 'F', 'G'];

  chords: ChordDefinition[] = [
    new ChordDefinition('A', 'x02220', '--123-'),
    new ChordDefinition('Am', 'x02210', '--321-'),
    new ChordDefinition('B', 'xx4442', '--4321'),
    new ChordDefinition('Bm', 'x24432', '-13421'),
    new ChordDefinition('C', 'x32010', '-32-1-'),
    new ChordDefinition('C#m', 'x46654', '-13421'),
    new ChordDefinition('D', 'xx0232', '---132'),
    new ChordDefinition('Dm', 'xx0231', '---231'),
    new ChordDefinition('E', '022100', '-231--'),
    new ChordDefinition('Em', '022000', '-23---'),
    new ChordDefinition('F', 'xx3211', '--3211'),
    new ChordDefinition('F#m', 'x13321', '-13421'),
    new ChordDefinition('G', '320003', '32---4')
  ];

  chordsBeingPlayed: Map<number, ChordDefinition> = new Map();
  keys: Map<string, ChordDefinition[]> = new Map();

  constructor() {
    this.keys.set('A', this.getChordsFor(['A', 'Bm', 'C#m', 'D', 'E', 'F#m']));
    this.keys.set('C', this.getChordsFor(['C', 'Dm', 'Em', 'F', 'G', 'Am']));
    this.keys.set('D', this.getChordsFor(['D', 'Em', 'F#m', 'G', 'A', 'Bm']));
    this.keys.set('G', this.getChordsFor(['G', 'Am', 'Bm', 'C', 'D', 'Em']));
  }

  public updateChordsBeingPlayed(chords: {chordId: number, chordName: string}[]) {
    this.chordsBeingPlayed = new Map();

    chords.forEach(chordAndId => {
      this.chordsBeingPlayed.set(chordAndId.chordId, this.getChordByName(chordAndId.chordName))
    });

  }

  public getChordByName(name: string): ChordDefinition {
    return this.chords.filter(chord => chord.name === name)[0];
  }

  public getChordById(id: number): ChordDefinition {
    return <ChordDefinition>this.chordsBeingPlayed.get(id);
  }

  public removeOldDiagrams(chordIdToDelete: string): void {

    let els = document.getElementsByClassName('rendered-chord');

    let elementsToDelete = [];
    for (let i = 0; i < els.length; i++) {
      let chordId = els[i].getAttribute('chordid');
      if (chordId === chordIdToDelete) {
        elementsToDelete.push(els[i]);
      }
    }

    elementsToDelete.forEach(els => {
      // @ts-ignore
      els.parentNode.removeChild(els);
    });
  }

  getChordsFor(chords: string[]): ChordDefinition[] {
      return chords.map(name => this.getChordByName(name));
  }

}
