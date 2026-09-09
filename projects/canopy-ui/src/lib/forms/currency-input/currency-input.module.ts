import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { CnCurrencyInputComponent } from './currency-input.component';
import { CnCurrencyPipe } from './currency.pipe';

@NgModule({
  imports: [CommonModule, MatFormFieldModule],
  declarations: [CnCurrencyInputComponent, CnCurrencyPipe],
  exports: [CnCurrencyInputComponent, CnCurrencyPipe, MatFormFieldModule]
})
export class CnCurrencyInputModule {}
