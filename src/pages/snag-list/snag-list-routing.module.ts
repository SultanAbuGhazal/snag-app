import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SnagListPage } from './snag-list.page';

const routes: Routes = [
  {
    path: '',
    component: SnagListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SnagListPageRoutingModule {}
