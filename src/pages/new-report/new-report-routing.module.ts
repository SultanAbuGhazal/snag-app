import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewReportPage } from './new-report.page';

const routes: Routes = [
  {
    path: '',
    component: NewReportPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewReportPageRoutingModule {}
