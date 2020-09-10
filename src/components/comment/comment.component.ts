import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/services/data/data.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {

  @Input() id: string;
  @Input() zone: string;
  @Input() reportId: string;
  comment: any;
  photographs: string[] = [];

  constructor(
    private platform: Platform,
    private data: DataService
  ) {
    this.platform.ready().then(_ => {
      this.loadComment();
    });
  }

  ngOnInit() {
    
  }


  /** PRIVATE METHODS */

  private loadComment() {
    this.data.getComment(this.reportId, this.zone, this.id).then(comment => {
      for (let i = 0; i < comment['photographs'].length; i++) {
        this.data.getImageSrcFromFileURI(comment['photographs'][i]).then(src => {
          this.photographs.push(src);
        });
      }
      this.comment = comment;
    });
  }

}
