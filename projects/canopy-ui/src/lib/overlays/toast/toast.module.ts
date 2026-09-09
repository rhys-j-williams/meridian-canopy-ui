import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { CnToastComponent } from './toast.component';

@NgModule({
  imports: [CommonModule, MatSnackBarModule, MatButtonModule, MatIconModule],
  declarations: [CnToastComponent],
  exports: [CnToastComponent, MatSnackBarModule]
})
export class CnToastModule {}
