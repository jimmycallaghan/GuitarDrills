import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'GuitarPractice';

  bpm = 70;
  barsPerChord = 4;
  repeatComboCount = 3;

  gettingReadyInterval: any;
  flasherInterval: any;
  countdownInterval: any;

  chords = ['A', 'Am', 'B', 'Bm', 'C', 'D', 'Dm', 'E', 'Em', 'F', 'G'];
  chordCombo: { from: string, to: string } = {from: 'D', to: 'C'};

  chordColor0 = 'bg-blue-500';
  chordColor1 = 'bg-yellow-500';
  chord1Class = this.chordColor0;
  chord2Class = this.chordColor0;

  // Total strums = barsPerChord x numberOfChords * repeatComboCount.
  countdown = this.barsPerChord * 2 * this.repeatComboCount;

  countIn = ['ONE', 'TWO', 'THREE', 'FOUR', 'ONE', 'TWO', 'THREE', 'FOUR'];
  countInWord = '';

  isRunning = false;
  isGettingReadyPhase = false;
  isCooldownPhase = false;

  timeBetweenBeats = 0;

  playedSoFar: { from: string, to: string }[] = [];
  playedSoFarFrequency: {chord: string, frequency: number}[] = [];

  chartOption: any;

  ngOnInit(): void {
    this.chords.forEach(chord => {
      this.playedSoFarFrequency.push({chord, frequency: 0});
    });
    this.updateChart();
  }

  public start(): void {
    this.isRunning = true;
    this.countdown = this.barsPerChord * 2 * this.repeatComboCount;
    this.timeBetweenBeats = (60 / this.bpm) * 1000;
    this.init();
  }

  public stop(): void {
    this.isRunning = false;
    clearInterval(this.gettingReadyInterval);
    clearInterval(this.flasherInterval);
    clearInterval(this.countdownInterval);
  }

  updateChart(): void {
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

  private init(): void {

    this.createChordPair();

    this.runGettingReadyPhase().then(() => {
      this.isGettingReadyPhase = false;

      setTimeout(() => {  // Wait one beat before starting the flashes
        this.flasherInterval = this.createFlasher();
        this.countdown--;
        this.countdownInterval = setInterval(() => {
          this.countdown--;
          if (this.countdown <= 0) {
            this.countdown = this.barsPerChord * 4;
            clearInterval(this.flasherInterval);
            clearInterval(this.countdownInterval);
            this.isCooldownPhase = true;

            this.playedSoFar.unshift(this.chordCombo);
            this.updatePlayedSoFarFrequency(this.chordCombo.from);
            this.updatePlayedSoFarFrequency(this.chordCombo.to);
            this.updateChart();

            // Pause 4 beats before going to the next combo
            setTimeout(() => {
              this.init();
            }, this.timeBetweenBeats * 4);
          }
        }, this.timeBetweenBeats);
      }, this.timeBetweenBeats);
    });
  }

  private runGettingReadyPhase(): Promise<null> {
    return new Promise<null>((resolve) => {
      this.isGettingReadyPhase = true;
      this.isCooldownPhase = false;

      let countInIndex = 0;
      this.countInWord = this.countIn[countInIndex];
      this.gettingReadyInterval = setInterval(() => {
        countInIndex ++;
        this.countInWord = this.countIn[countInIndex];
        if (countInIndex === this.countIn.length - 1) {
          clearInterval(this.gettingReadyInterval);
          resolve(null);
        }
      }, this.timeBetweenBeats);
    });
  }

  private createChordPair(): void {
    const fromInt = this.getRandomInt(this.chords.length);
    const toInt = this.getRandomInt(this.chords.length);
    if (fromInt === toInt) {
      return this.createChordPair();
    }
    this.chordCombo = {from: this.chords[fromInt], to: this.chords[toInt]}
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
      }, 200);
  }

  private flashChord2(): void {
    this.chord2Class = this.chordColor1;
    setTimeout(() => {
      this.chord2Class = this.chordColor0;
    }, 200);
  }

}
