import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SnagListPageRoutingModule } from './snag-list-routing.module';

import { SnagListPage } from './snag-list.page';
import { CommentComponent } from 'src/components/comment/comment.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SnagListPageRoutingModule
  ],
  entryComponents: [
    CommentComponent
  ],
  declarations: [
    SnagListPage,
    CommentComponent
  ]
})
export class SnagListPageModule {}
