import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SnagListPageRoutingModule } from './snag-list-routing.module';

import { SnagListPage } from './snag-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SnagListPageRoutingModule
  ],
  declarations: [SnagListPage]
})
export class SnagListPageModule {}
