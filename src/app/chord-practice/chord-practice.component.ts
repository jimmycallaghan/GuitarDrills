import { Component, OnInit } from '@angular/core';
import {ChordsService} from "../services/chords.service";
import {Subject} from "rxjs";

@Component({
  selector: 'app-chord-practice',
  templateUrl: './chord-practice.component.html',
  styleUrls: ['./chord-practice.component.css']
})
export class ChordPracticeComponent implements OnInit {

  title = 'GuitarPractice';

  bpm = 70;
  barsPerChord = 4;
  repeatComboCount = 3;
  prepTime = 5; // seconds

  gettingReadyInterval: any;
  flasherInterval: any;
  countdownInterval: any;
  prepTimeTimeout: any;
  oneBeatTimeout: any;

  chords: string[] = [];
  selectedChords: string[] = this.chords.slice();
  chordCombo: { from: string, to: string } = {from: 'D', to: 'C'};

  chordColor0 = 'bg-blue-500';
  chordColor1 = 'bg-yellow-500';
  chord1Class = this.chordColor0;
  chord2Class = this.chordColor0;
  flashSpeed = 200; // ms

  // Total strums = barsPerChord x numberOfChords * repeatComboCount.
  countdown = this.barsPerChord * 2 * this.repeatComboCount;

  countIn = ['ONE', 'TWO', 'THREE', 'FOUR', 'ONE', 'TWO', 'THREE', 'FOUR'];
  countInWord = '';

  isRunning = false;
  isCountInPhase = false;
  isCooldownPhase = false;

  timeBetweenBeats = 0;

  playedSoFar: { from: string, to: string }[] = [];
  playedSoFarFrequency: {chord: string, frequency: number}[] = [];

  chartOption: any;

  isComboDialogVisible: boolean = false;

  chordsUpdatedSubject = new Subject<void>();

  constructor(private chordService: ChordsService) {}

  ngOnInit(): void {
    this.chords = this.chordService.chords.map(chord => chord.name);
    this.selectedChords = this.chords.slice();
    this.chords.forEach(chord => {
      this.playedSoFarFrequency.push({chord, frequency: 0});
    });
    this.updateChart();
  }

  public start(): void {
    this.isRunning = true;
    this.countdown = this.barsPerChord * 2 * this.repeatComboCount;
    this.timeBetweenBeats = (60 / this.bpm) * 1000;
    this.isComboDialogVisible = true;
    this.init();
  }

  public stop(): void {
    console.log('stop()');
    this.chordService.removeOldDiagrams('1');
    this.chordService.removeOldDiagrams('2');
    this.isRunning = false;
    this.isCooldownPhase = false;
    clearInterval(this.gettingReadyInterval);
    clearInterval(this.flasherInterval);
    clearInterval(this.countdownInterval);
    clearTimeout(this.prepTimeTimeout);
    clearTimeout(this.oneBeatTimeout);
    this.isComboDialogVisible = false;
  }

  private init(): void {

    this.createChordPair();

    this.isCooldownPhase = true;

    // Simply show the next chords for the prepTime before starting the count-in
    this.prepTimeTimeout = setTimeout(() => {
      this.isCooldownPhase = false;
      this.runCountInPhase().then(() => {
        this.oneBeatTimeout = setTimeout(() => {  // Wait one beat before starting the flashes
          this.flasherInterval = this.createFlasher();
          this.countdown--;
          this.countdownInterval = setInterval(() => {
            this.countdown--;
            if (this.countdown <= 0) {
              this.countdown = this.barsPerChord * 4;
              clearInterval(this.flasherInterval);
              clearInterval(this.countdownInterval);

              this.playedSoFar.unshift(this.chordCombo);
              this.updatePlayedSoFarFrequency(this.chordCombo.from);
              this.updatePlayedSoFarFrequency(this.chordCombo.to);
              this.updateChart();

              this.init();
            }
          }, this.timeBetweenBeats);
        }, this.timeBetweenBeats);
      });
    }, this.prepTime * 1000);

  }

  private runCountInPhase(): Promise<null> {
    return new Promise<null>((resolve) => {
      this.isCountInPhase = true;

      let countInIndex = 0;
      this.countInWord = this.countIn[countInIndex];
      this.gettingReadyInterval = setInterval(() => {
        countInIndex ++;
        this.countInWord = this.countIn[countInIndex];
        if (countInIndex === this.countIn.length - 1) {
          clearInterval(this.gettingReadyInterval);
          this.isCountInPhase = false;
          resolve(null);
        }
      }, this.timeBetweenBeats);
    });
  }

  private createChordPair(): void {
    const fromInt = this.getRandomInt(this.selectedChords.length);
    const toInt = this.getRandomInt(this.selectedChords.length);
    if (fromInt === toInt) {
      return this.createChordPair();
    }
    this.chordCombo = {from: this.selectedChords[fromInt], to: this.selectedChords[toInt]}
    this.chordService.updateChordsBeingPlayed([
      {chordId: 1, chordName: this.selectedChords[fromInt]},
      {chordId: 2, chordName: this.selectedChords[toInt]}
    ])
    this.chordsUpdatedSubject.next();
  }

  private updatePlayedSoFarFrequency(chord: string) {
    const chordPlayed = this.playedSoFarFrequency
      .find(obj => obj.chord === chord);
    if (chordPlayed) {
      chordPlayed.frequency = chordPlayed.frequency + 1;
    } else {
      console.log('Chord ' + chord + ' not found');
    }
  }

  private createFlasher(): any {

    let strumsLeft = this.barsPerChord;
    let chordToFlash = 1;

    this.flashChord1();
    strumsLeft --;

    return setInterval(() => {

      if (chordToFlash === 1) {
        this.flashChord1();
      } else {
        this.flashChord2();
      }

      strumsLeft --;
      if (strumsLeft === 0) {
        strumsLeft = this.barsPerChord;
        chordToFlash = chordToFlash === 1 ? 2 : 1;
      }
    }, this.timeBetweenBeats);
  }

  private getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
  }

  private flashChord1(): void {
    this.chord1Class = this.chordColor1;
    setTimeout(() => {
      this.chord1Class = this.chordColor0;
    }, this.flashSpeed);
  }

  private flashChord2(): void {
    this.chord2Class = this.chordColor1;
    setTimeout(() => {
      this.chord2Class = this.chordColor0;
    }, this.flashSpeed);
  }

  private updateChart(): void {
    this.chartOption = {
      xAxis: {
        type: 'category',
        data: this.chords,
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: this.playedSoFarFrequency.map(obj => obj.frequency),
          type: 'bar',
        },
      ],
    };
  }

}
