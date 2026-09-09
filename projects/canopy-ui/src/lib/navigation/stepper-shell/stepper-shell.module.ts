import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatStepperModule } from '@angular/material/stepper';
import { CnStepDirective } from './step.directive';
import { CnStepperShellComponent } from './stepper-shell.component';

@NgModule({
  imports: [CommonModule, MatStepperModule, MatButtonModule],
  declarations: [CnStepperShellComponent, CnStepDirective],
  exports: [CnStepperShellComponent, CnStepDirective]
})
export class CnStepperShellModule {}
