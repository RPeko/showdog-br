import { Component } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material';
import { State } from '../models/state';
import { StateDialogProvider } from './state-dialog.provider';

@Component({
  selector: 'app-state-dialog',
  templateUrl: './state-dialog.component.html',
  styleUrls: ['./state-dialog.component.css']
})
export class StateDialogComponent {
  states: State[] = [];  
  stateDialogRef: MatDialogRef<StateDialogComponent>;

  constructor(private dialog: MatDialog, private stateDialogProvider: StateDialogProvider) {}

  openStateDialog() {
    this.stateDialogProvider.states.subscribe(states => this.states = states);
    this.stateDialogRef = this.dialog.open(StateDialogComponent);
  }

}
