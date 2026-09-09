import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { CnProgressComponent } from './progress.component';

@NgModule({
  imports: [CommonModule, MatProgressBarModule, MatProgressSpinnerModule],
  declarations: [CnProgressComponent],
  exports: [CnProgressComponent]
})
export class CnProgressModule {}
