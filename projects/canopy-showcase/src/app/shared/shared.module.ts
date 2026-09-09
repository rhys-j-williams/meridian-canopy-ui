import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CnA11yModule } from '@northgate/canopy-ui/a11y';
import { CnButtonModule, CnIconButtonModule, CnMenuModule } from '@northgate/canopy-ui/actions';
import { CnDisclosureModule } from '@northgate/canopy-ui/content';
import {
  CnAccountCardModule, CnBadgeModule, CnCardModule, CnDataTableModule, CnDividerModule, CnExpansionModule,
  CnFilterChipsModule, CnListModule, CnSkeletonModule, CnVirtualListModule
} from '@northgate/canopy-ui/data-display';
import { CnErrorSummaryModule, CnProgressModule } from '@northgate/canopy-ui/feedback';
import { CnFormsModule } from '@northgate/canopy-ui/forms';
import { CnPageHeaderModule, CnPageShellModule } from '@northgate/canopy-ui/layout';
import { CnStepperShellModule, CnTabsModule } from '@northgate/canopy-ui/navigation';
import { CnBottomSheetModule, CnDialogShellModule, CnToastModule, CnTooltipModule } from '@northgate/canopy-ui/overlays';
import { DemoPageComponent } from './demo-page.component';
import { DemoSectionComponent } from './demo-section.component';

const CANOPY = [
  CnA11yModule, CnButtonModule, CnIconButtonModule, CnMenuModule, CnDisclosureModule,
  CnAccountCardModule, CnBadgeModule, CnCardModule, CnDataTableModule, CnDividerModule, CnExpansionModule,
  CnFilterChipsModule, CnListModule, CnSkeletonModule, CnVirtualListModule,
  CnErrorSummaryModule, CnProgressModule, CnFormsModule, CnPageHeaderModule, CnPageShellModule,
  CnStepperShellModule, CnTabsModule, CnBottomSheetModule, CnDialogShellModule, CnToastModule, CnTooltipModule
];

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MatFormFieldModule, MatIconModule, ...CANOPY],
  declarations: [DemoPageComponent, DemoSectionComponent],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MatFormFieldModule, MatIconModule, ...CANOPY, DemoPageComponent, DemoSectionComponent]
})
export class SharedModule {}
