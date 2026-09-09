import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { CnCardComponent } from './card.component';

@NgModule({ imports: [CommonModule, MatCardModule], declarations: [CnCardComponent], exports: [CnCardComponent] })
export class CnCardModule {}
