import { NgModule } from '@angular/core';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { CnTooltipDirective } from './tooltip.directive';
import { CnTooltipStylesComponent } from './tooltip-styles.component';

@NgModule({
  imports: [MatTooltipModule],
  declarations: [CnTooltipDirective, CnTooltipStylesComponent],
  exports: [CnTooltipDirective, CnTooltipStylesComponent, MatTooltipModule]
})
export class CnTooltipModule {}
