export class ChordBoxImage {
  //Constants
  NO_FINGER = '-';
  THUMB = 'T';
  INDEX_FINGER = '1';
  MIDDLE_FINGER = '2';
  RING_FINGER = '3';
  LITTLE_FINGER = '4';
  OPEN = 0;
  MUTED = -1;
  FRET_COUNT = 5;
  FONT_NAME = "Arial";

  _ctx: any;

  _size = 12;
  _chordPositions: number[] = [];
  _fingers = [this.NO_FINGER, this.NO_FINGER, this.NO_FINGER, this.NO_FINGER, this.NO_FINGER, this.NO_FINGER];
  _stringNames = 'EADGBe';
  _chordName = '';
  _error = false;

  _fretWidth = 20;
  _lineWidth = 1;
  _boxWidth = 100;
  _boxHeight = 100;

  _imageWidth = 100;
  _imageHeight = 100;
  _xstart = 50; //upper corner of the chordbox
  _ystart = 0;
  _nutHeight = 2;

  _dotWidth = 1;
  _signWidth = 1;
  _signRadius = 1;

  //Different font sizes
  _fretFontSize = 8;
  _fingerFontSize = 8;
  _nameFontSize = 8;
  _superScriptFontSize = 8;
  _markerWidth = 1;

  _foregroundBrush = '#000';
  _backgroundBrush = '#FFF';

  _baseFret = 1;
  _guitarStringFontSize = this._fretWidth * 0.8;

  isShowChordName = true;

  constructor(name: string,
              chord: string,
              fingers: string,
              size: string,
              stringNames: string,
              showChordName: boolean) {

    if (stringNames) {
      this._stringNames = stringNames;
    }

    this.isShowChordName = showChordName;

    //MAIN
    if (name == null || typeof name == 'undefined') {
      this._chordName = "";
    } else {
      this._chordName = name.replace(" ", "");
    }
    this.parseChord(chord);
    this.parseFingers(fingers);
    this.parseSize(size);
    this.initializeSizes();
  };

  createImage(ctx: any, layout: string) {
    this._ctx = ctx;
    this.fillRectangle(this._backgroundBrush, 0, 0, this._imageWidth, this._imageHeight);
    if (this._error) {
      this.drawLine('red', 3, 0, 0, this._imageWidth, this._imageHeight);
      this.drawLine('red', 3, 0, this._imageHeight, this._imageWidth, 0);
    } else {
      if (typeof layout === 'undefined' || layout === '1') {
        this.drawChordBox();
        this.drawBars();
        this.drawChordPositionsAndFingers();
        this.drawBaseFret();
        this.drawStringNames();
      } else if (layout === '2') {
        this.drawChordBox();
        this.drawChordPositions();
        this.drawBars();
        this.drawBaseFret();
        this.drawFingers();
      }
      if (this.isShowChordName) {
        this.drawChordName();
      }
    }
  };

  pen(color: string, size: number) {
    this._ctx.strokeStyle = color;
    this._ctx.lineWidth = size;
    this._ctx.lineCap = 'round';
  };

  font(fname: string, size: number) {
    this._ctx.font = size+"px "+fname;
    this._ctx.textBaseline = 'top';
  };

  drawLine(color: string, size: number, x1: number, y1: number, x2: number, y2: number) {
    this._ctx.beginPath();
    this.pen(color, size);
    this._ctx.moveTo(x1, y1);
    this._ctx.lineTo(x2, y2);
    this._ctx.stroke();
  };

  fillRectangle(color: string, x1: number, y1: number, x2: number, y2: number){
    this._ctx.beginPath();
    this._ctx.fillStyle = color;
    this._ctx.rect(x1, y1, x2, y2);
    this._ctx.fill();
  };

  drawCircle(color: string, size: number, x1: number, y1: number, diameter: number) {
    const radius = diameter/2;
    this._ctx.beginPath();
    this.pen(color, size);
    this._ctx.arc(x1+radius, y1+radius, radius, 0, 2 * Math.PI, false);
    this._ctx.stroke();
  };

  fillCircle(color: string, x1: number, y1: number, diameter: number) {
    const radius = diameter/2;
    this._ctx.beginPath();
    this._ctx.fillStyle = color;
    this._ctx.arc(x1+radius, y1+radius, radius, 0, 2 * Math.PI, false);
    this._ctx.fill();
  };

  measureString(text: string, font: string, size: number) {
    // this.font(font, size);
    const metrics = this._ctx.measureText(text);
    metrics.Width = metrics.width;
    metrics.Height = this._ctx.measureText('M').width; // calculating the with of the letter 'M' a good approximation of the line height
    return metrics;
  };

  drawString(text: string, font: string, color: string, x: number, y: number, size: number) {
    this.font(font, size);
    this._ctx.fillStyle = color;
    this._ctx.fillText(text, x, y);
  };

  initializeSizes() {
    this._fretWidth = 4 * this._size;
    this._nutHeight = this._fretWidth / 2;
    this._lineWidth = Math.ceil(this._size * 0.31);
    this._dotWidth = Math.ceil(0.9 * this._fretWidth);
    this._markerWidth = 0.7 * this._fretWidth;
    this._boxWidth = 5 * this._fretWidth + 6 * this._lineWidth;
    this._boxHeight = this.FRET_COUNT * (this._fretWidth + this._lineWidth) + this._lineWidth;

    let perc = 0.8;
    this._fretFontSize = this._fretWidth / perc;
    this._fingerFontSize = this._fretWidth * 0.8;
    this._guitarStringFontSize = this._fretWidth * 0.8;
    this._nameFontSize = this._fretWidth * 2 / perc;
    this._superScriptFontSize = 0.7 * this._nameFontSize;
    if (this._size == 1) {
      this._nameFontSize += 2;
      this._fingerFontSize += 2;
      this._fretFontSize += 2;
      this._superScriptFontSize += 2;
    }

    this._xstart = this._fretWidth;
    if (this.isShowChordName) {
      this._ystart = Math.round(0.2 * this._superScriptFontSize + this._nameFontSize + this._nutHeight + 1.7 * this._markerWidth);
    } else {
      this._ystart = this._nutHeight + 1.7 * this._markerWidth;
    }
    console.log('yStart: ' + this._ystart);

    this._imageWidth = (this._boxWidth + 5 * this._fretWidth);
    this._imageHeight = (this._boxHeight + this._ystart + this._fretWidth + this._fretWidth);
    console.log('imageHeight: ' + this._imageHeight);

    this._signWidth = (this._fretWidth * 0.75);
    this._signRadius = this._signWidth / 2;
  };

  getWidth(): string {
    return this._imageWidth + '';
  };

  getHeight(): string {
    return this._imageHeight + '';
  };

  parseSize(size:string) {
    this._size = parseFloat(size);
    if (isNaN(this._size)) {
      this._size = 1;
    }
  };

  parseFingers(fingers: string) {
    fingers = String(fingers).toUpperCase() + '------';
    fingers = fingers.replace(/[^\-T1234]/g,'');
    this._fingers = fingers.substr(0,6).split('');
  };

  parseChord(chord: string) {
    if (chord == null || typeof chord == 'undefined' || !chord.match(/[\dxX]{6}|((1|2)?[\dxX]-){5}(1|2)?[\dxX]/)) {
      this._error = true;
    } else {
      var parts;
      if (chord.length > 6) {
        parts = chord.split('-');
      } else {
        parts = chord.split('');
      }
      var maxFret = 0;
      var minFret = Number.MAX_VALUE;
      for (var i = 0; i < 6; i++) {
        if (parts[i].toUpperCase() == "X") {
          this._chordPositions[i] = this.MUTED;
        } else {
          this._chordPositions[i] = parseInt(parts[i]);
          maxFret = Math.max(maxFret, this._chordPositions[i]);
          if (this._chordPositions[i] != 0) {
            minFret = Math.min(minFret, this._chordPositions[i]);
          }
        }
      }
      if (maxFret <= 5) {
        this._baseFret = 1;
      } else {
        this._baseFret = minFret;
      }
    }
  };

  drawChordBox() {
    let totalFretWidth = this._fretWidth + this._lineWidth;

    for (var i = 0; i <= this.FRET_COUNT; i++) {
      var y = this._ystart + i * totalFretWidth;
      this.drawLine(this._foregroundBrush, this._lineWidth, this._xstart, y, this._xstart + this._boxWidth - this._lineWidth, y);
    }

    for (i = 0; i < 6; i++) {
      var x = this._xstart + (i * totalFretWidth);
      this.drawLine(this._foregroundBrush, this._lineWidth, x, this._ystart, x, this._ystart + this._boxHeight - this._lineWidth);
    }

    if (this._baseFret == 1) {
      //Need to draw the nut
      var nutHeight = this._fretWidth / 2;
      this.fillRectangle(this._foregroundBrush, this._xstart - this._lineWidth / 2, this._ystart - nutHeight, this._boxWidth, nutHeight);
    }
  };

  drawBars() {
    let bars = new Map<string, { 'Str': number, 'Pos': number, 'Length': number, 'Finger': string }>();

    for (let i = 0; i < 5; i++) {
      if (this._chordPositions[i] != this.MUTED &&
        this._chordPositions[i] != this.OPEN &&
        this._fingers[i] != this.NO_FINGER &&
        !bars.hasOwnProperty(this._fingers[i])) {

        let bar = { 'Str':i, 'Pos':this._chordPositions[i], 'Length': 0, 'Finger': this._fingers[i] };

        for (var j = i + 1; j < 6; j++) {
          if (this._fingers[j] == bar['Finger'] && this._chordPositions[j] == this._chordPositions[i]) {
            bar['Length'] = j - i;
          }
        }

        if (bar.Length > 0) {
          bars.set(bar.Finger, bar);
        }
      }
    }

    var totalFretWidth = this._fretWidth + this._lineWidth;
    for (let [finger, bar] of bars) {
        console.log('if');
        let xstart = this._xstart + bar['Str'] * totalFretWidth;
        let xend = xstart + bar['Length'] * totalFretWidth;
        let y = this._ystart + (bar['Pos'] - this._baseFret + 1) * totalFretWidth - (totalFretWidth / 2);
        this.drawLine(this._foregroundBrush, this._dotWidth / 2, xstart, y, xend, y);
    }
  };

  drawChordPositions() {
    let yoffset =this._ystart -this._fretWidth;
    let xoffset =this._lineWidth / 2;
    let totalFretWidth =this._fretWidth +this._lineWidth;
    let xfirstString =this._xstart + 0.5 *this._lineWidth;
    for (let i = 0; i <this._chordPositions.length; i++) {
      let absolutePos =this._chordPositions[i];
      let relativePos = absolutePos -this._baseFret + 1;

      let xpos =this._xstart - (0.5 *this._fretWidth) + (0.5 *this._lineWidth) + (i * totalFretWidth);
      if (relativePos > 0) {
        let ypos = relativePos * totalFretWidth + yoffset;
        this.fillCircle(this._foregroundBrush, xpos, ypos,this._dotWidth);
      } else if (absolutePos == this.OPEN) {
        let ypos =this._ystart -this._fretWidth;
        let markerXpos = xpos + ((this._dotWidth -this._markerWidth) / 2);
        if (this._baseFret == 1) {
          ypos -=this._nutHeight;
        }
        this.drawCircle(this._foregroundBrush,this._lineWidth, markerXpos, ypos,this._markerWidth);
      } else if (absolutePos == this.MUTED) {
        let ypos =this._ystart -this._fretWidth;
        let markerXpos = xpos + ((this._dotWidth -this._markerWidth) / 2);
        if (this._baseFret == 1) {
          ypos -=this._nutHeight;
        }
        this.drawLine(this._foregroundBrush,this._lineWidth * 1.5, markerXpos, ypos, markerXpos +this._markerWidth, ypos +this._markerWidth);
        this.drawLine(this._foregroundBrush,this._lineWidth * 1.5, markerXpos, ypos +this._markerWidth, markerXpos +this._markerWidth, ypos);
      }
    }
  };

  drawChordPositionsAndFingers() {
    let yoffset =this._ystart -this._fretWidth;
    let xoffset =this._lineWidth / 2;
    let totalFretWidth =this._fretWidth +this._lineWidth;
    let xfirstString =this._xstart + 0.5 *this._lineWidth;
    // this.font(this.FONT_NAME,this._fingerFontSize);
    for (let i = 0; i <this._chordPositions.length; i++) {
      let absolutePos =this._chordPositions[i];
      let relativePos = absolutePos -this._baseFret + 1;

      let xpos =this._xstart - (0.5 *this._fretWidth) + (0.5 *this._lineWidth) + (i * totalFretWidth);
      if (relativePos > 0) {
        let ypos = relativePos * totalFretWidth + yoffset;
        this.fillCircle(this._foregroundBrush, xpos, ypos,this._dotWidth);
        let finger =this._fingers[i];
        if (finger != this.NO_FINGER) {
          let charSize =this.measureString(finger.toString(), this.FONT_NAME, this._fingerFontSize);
          this.drawString(
            finger.toString(),
            this.FONT_NAME,
            this._backgroundBrush,
            xpos - (0.5 * charSize.Width) + this._dotWidth/2,
            ypos - (0.5 * charSize.Height) +this._dotWidth/2,
            charSize);
        }
      } else if (absolutePos == this.OPEN) {
        //let pen = Pen(this._foregroundBrush,this._lineWidth);
        let ypos =this._ystart -this._fretWidth;
        let markerXpos = xpos + ((this._dotWidth -this._markerWidth) / 2);
        if (this._baseFret == 1) {
          ypos -=this._nutHeight;
        }
        this.drawCircle(this._foregroundBrush,this._lineWidth, markerXpos, ypos,this._markerWidth);
        let finger =this._fingers[i];
        if (finger != this.NO_FINGER) {
          let charSize = this.measureString(finger.toString(), this.FONT_NAME, this._fingerFontSize);
          this.drawString(finger.toString(), this.FONT_NAME, this._backgroundBrush, xpos - (0.5 * charSize.Width) +this._dotWidth/2, ypos - (0.5 * charSize.Height) +this._dotWidth/2, charSize);
        }
      } else if (absolutePos == this.MUTED) {
        //let pen = Pen(this._foregroundBrush,this._lineWidth * 1.5);
        let ypos =this._ystart -this._fretWidth;
        let markerXpos = xpos + ((this._dotWidth -this._markerWidth) / 2);
        if (this._baseFret == 1) {
          ypos -=this._nutHeight;
        }
        this.drawLine(this._foregroundBrush,this._lineWidth * 1.5, markerXpos, ypos, markerXpos +this._markerWidth, ypos +this._markerWidth);
        this.drawLine(this._foregroundBrush,this._lineWidth * 1.5, markerXpos, ypos +this._markerWidth, markerXpos +this._markerWidth, ypos);
        let finger =this._fingers[i];
        if (finger != this.NO_FINGER) {
          let charSize =this.measureString(finger.toString(), this.FONT_NAME, this._fingerFontSize);
          this.drawString(finger.toString(), this.FONT_NAME, this._backgroundBrush, xpos - (0.5 * charSize.Width) +this._dotWidth/2, ypos - (0.5 * charSize.Height) +this._dotWidth/2, charSize);
        }
      }
    }
  };


  drawFingers() {
    let xpos =this._xstart + (0.5 *this._lineWidth);
    let ypos =this._ystart + this._boxHeight;
    this.font(this.FONT_NAME, this._fingerFontSize);
    for (let f=0; f < this._fingers.length; f++) {
      let finger =this._fingers[f];
      if (finger != this.NO_FINGER) {
        let charSize =this.measureString(finger.toString(), this.FONT_NAME, this._fingerFontSize);
        this.drawString(finger.toString(), this.FONT_NAME, this._foregroundBrush, xpos - (0.5 * charSize.Width), ypos - (0.5 * charSize.Height) +this._dotWidth/2, this._fingerFontSize);
      }
      xpos += (this._fretWidth +this._lineWidth);
    }
  }

  drawStringNames() {
    let xpos =this._xstart + (0.5 *this._lineWidth);
    let ypos =this._ystart +this._boxHeight;
    this.font(this.FONT_NAME, this._guitarStringFontSize);
    for (let s=0; s<6; s++) {
      let guitarString =this._stringNames[s];
      let charSize =this.measureString(guitarString, this.FONT_NAME, this._guitarStringFontSize);
      this.drawString(guitarString, this.FONT_NAME, this._foregroundBrush, xpos - (0.5 * charSize.Width), ypos, this._guitarStringFontSize);
      xpos += (this._fretWidth +this._lineWidth);
    }
  };

  drawChordName() {
    let name;
    let supers;
    if (this._chordName.indexOf('_') == -1) {
      name =this._chordName;
      supers = "";
    } else {
      let parts =this._chordName.split('_');
      name = parts[0];
      supers = parts[1];
    }
    let stringSize =this.measureString(name, this.FONT_NAME, this._nameFontSize);

    let xTextStart =this._xstart;
    if (stringSize.Width <this._boxWidth) {
      xTextStart =this._xstart + ((this._boxWidth - stringSize.Width) / 2);
    }
    this.drawString(name, this.FONT_NAME,this._foregroundBrush, xTextStart, 0.2 *this._superScriptFontSize, this._nameFontSize);
    if (supers != "") {
      this.drawString(supers, this.FONT_NAME,this._foregroundBrush, xTextStart + 0.8 * stringSize.Width, 0, this._superScriptFontSize);
    }
  };

  drawBaseFret(): void {
    if (this._baseFret > 1) {
      let offset = (this._fretFontSize -this._fretWidth) / 2;
      this.drawString(this._baseFret + "fr",
        this.FONT_NAME,
        this._foregroundBrush,
        this._xstart + this._boxWidth + (0.4 * this._fretWidth) + 5,
        this._ystart - offset,
        this._fretFontSize);
    }
  }

}
