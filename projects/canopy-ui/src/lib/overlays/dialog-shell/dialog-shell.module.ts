import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { CnConfirmDialogComponent } from './confirm-dialog.component';
import { CnDialogShellComponent } from './dialog-shell.component';

@NgModule({
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  declarations: [CnDialogShellComponent, CnConfirmDialogComponent],
  exports: [CnDialogShellComponent, CnConfirmDialogComponent, MatDialogModule]
})
export class CnDialogShellModule {}
