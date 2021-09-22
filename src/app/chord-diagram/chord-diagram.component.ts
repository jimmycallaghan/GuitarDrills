import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {ElementRef} from '@angular/core';

// @ts-ignore
import * as chordImage from 'ChordJS';
import {ChordBoxImage} from "./ChordBoxImage";
import {ChordsService} from "../services/chords.service";
import {ChordDefinition} from "../model/chord-definition.model";
import {Subject} from "rxjs";

@Component({
  selector: 'app-chord-diagram',
  templateUrl: './chord-diagram.component.html',
  styleUrls: ['./chord-diagram.component.css']
})
export class ChordDiagramComponent implements OnInit, AfterViewInit {

  @ViewChild('chord') chord: ElementRef | undefined;
  @Input() name: string = '';
  @Input() chordsChangedSubject: Subject<void> = new Subject();
  @Input() chordId: number = 0;

  constructor(private chordService: ChordsService) {}

  ngAfterViewInit() {

    this.chordsChangedSubject.subscribe(() => {
      this.init();
    });
    this.init();
  }

  init(): void {

    this.chordService.removeOldDiagrams(this.chordId + '');

    let chordFromService: ChordDefinition;
    if (this.name !== '') {
      chordFromService = this.chordService.getChordById(this.chordId);
    } else {
      console.log('No chord found with name: ' + this.name);
      return;
    }

    if (!chordFromService) {
      // Happens on first load when no chord has been added yet.
      return;
    }

    if (!this.chord) {
      console.log('No chord element found in html');
      return;
    }

    let elt = this.chord.nativeElement;
    let name = chordFromService.name;
    let positions = chordFromService.positions;
    let fingers = chordFromService.fingers;

    let layout;
    if (elt.getAttribute('layout') === null) {
      layout = elt.setAttribute('layout', '1');
    } else {
      layout = elt.getAttribute('layout');
    }
    var stringNames = elt.getAttribute('strings');
    let size = elt.getAttribute('size');

    var canvas = this.generateChordHtml(name, positions, fingers, size, layout, stringNames);
    elt.parentNode.insertBefore(canvas, elt);
  }

  ngOnInit(): void {

  }

  generateChordHtml(name: string, positions: string, fingering: string, size: string, layout: string, stringNames: string) {
    if (positions.length != 6 || fingering.length != 6) {
      console.error('ChordJS cannot generate a chord diagram from invalid chord input! (Too many positions or fingers.');
      console.log('ChordJS will render an empty chord instead!');
      positions = 'xxxxxx';
      fingering = '------';
    }
    let chordObj = new ChordBoxImage(name, positions, fingering, size, stringNames);
    let canvas = document.createElement('canvas');
    canvas.setAttribute('class', 'rendered-chord');
    canvas.setAttribute('chordid', this.chordId + '');
    canvas.setAttribute('width', chordObj.getWidth());
    canvas.setAttribute('height', chordObj.getHeight());
    var ctx = canvas.getContext('2d');
    chordObj.createImage(ctx,layout);
    return canvas;
  }

}
