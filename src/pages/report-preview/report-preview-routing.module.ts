import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportPreviewPage } from './report-preview.page';

const routes: Routes = [
  {
    path: '',
    component: ReportPreviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportPreviewPageRoutingModule {}
