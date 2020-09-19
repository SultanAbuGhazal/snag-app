import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { File, DirectoryEntry } from '@ionic-native/file/ngx';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {

  @Input('directory') commentDirectory: DirectoryEntry;
  // @Input() id: string;
  // @Input() zone: any;
  // @Input() report: any;
  @ViewChild('commentItem', {static: true}) commentItem: ElementRef;
  observer: any;
  comment: any;
  photographs: string[] = [];

  constructor(
    private router: Router,
    private file: File
  ) {
    var options = {
      rootMargin: '0px',
      threshold: 0
    }
    
    this.observer = new IntersectionObserver((entry, obs) => {
      if(entry[0].isIntersecting) {
        obs.unobserve(this.commentItem['el']);
        this.loadComment();
      }
    }, options);
  }

  ngOnInit() {
    // delaying the observer to skip the first intersection
    setTimeout(() => {
      this.observer.observe(this.commentItem['el']);
    }, 200);
  }

  onCommentClick() {
    var extras: NavigationExtras = {
      state: { 
        commentDirectory: this.commentDirectory
      }
    };
    this.router.navigate(['comment'], extras);
  }


  /** PRIVATE METHODS */

  private loadComment() {
    this.file.readAsText(this.commentDirectory.nativeURL, 'details.json').then(f => {
      this.comment = JSON.parse(f);
      console.log("Loaded Comment:", this.comment.id);
    });
  }

}
