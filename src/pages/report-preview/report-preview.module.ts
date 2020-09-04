import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportPreviewPageRoutingModule } from './report-preview-routing.module';

import { ReportPreviewPage } from './report-preview.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportPreviewPageRoutingModule
  ],
  declarations: [ReportPreviewPage]
})
export class ReportPreviewPageModule {}
