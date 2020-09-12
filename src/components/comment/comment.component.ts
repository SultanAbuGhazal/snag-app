import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/services/data/data.service';
import { Platform,  } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

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
    private router: Router,
    private data: DataService
  ) {
    this.platform.ready().then(_ => {
      this.loadComment();
    });
  }

  ngOnInit() {
    
  }

  onCommentClick() {
    console.log("Comment:", this.comment);
    var extras: NavigationExtras = {
      state: { comment: this.comment }
    };
    this.router.navigate(['/report', this.reportId, 'comment', this.comment.id], extras);
  }


  /** PRIVATE METHODS */

  private loadComment() {
    this.data.getComment(this.reportId, this.zone, this.id).then(comment => {
      // for (let i = 0; i < comment['photographs'].length; i++) {
      //   this.data.getImageSrcFromFileURI(comment['photographs'][i]).then(src => {
      //     this.photographs.push(src);
      //   });
      // }
      this.comment = comment;
    });
  }

}
