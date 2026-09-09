import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { NgxMaskModule } from 'ngx-mask';
import { CnMaskedInputComponent } from './masked-input.component';

@NgModule({
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, NgxMaskModule.forRoot()],
  declarations: [CnMaskedInputComponent],
  exports: [CnMaskedInputComponent]
})
export class CnMaskedInputModule {}
