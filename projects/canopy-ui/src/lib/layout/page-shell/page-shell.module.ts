import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { RouterModule } from '@angular/router';
import { CnA11yModule } from '@northgate/canopy-ui/a11y';
import { CnTooltipModule } from '@northgate/canopy-ui/overlays';
import { CnPageShellComponent } from './page-shell.component';
import { CnThemeToggleComponent } from './theme-toggle.component';

@NgModule({
  imports: [CommonModule, RouterModule, FlexLayoutModule, MatButtonModule, MatIconModule, MatMenuModule, CnA11yModule, CnTooltipModule],
  declarations: [CnPageShellComponent, CnThemeToggleComponent],
  exports: [CnPageShellComponent, CnThemeToggleComponent]
})
export class CnPageShellModule {}
