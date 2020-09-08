import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportsPageRoutingModule } from './reports-routing.module';

import { ReportsPage } from './reports.page';
import { ProjectComponent } from 'src/components/report/report.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportsPageRoutingModule
  ],
  entryComponents: [
    ProjectComponent
  ],
  declarations: [
    ReportsPage,
    ProjectComponent
  ]
})
export class ProjectsPageModule {}
