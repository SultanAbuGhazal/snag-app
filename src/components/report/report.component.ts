import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { File, DirectoryEntry } from '@ionic-native/file/ngx';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ProjectComponent implements OnInit {

  @Input('directory') reportDirectory: DirectoryEntry;
  @ViewChild('reportCard', {static: true}) reportCard: ElementRef;
  observer: any;
  unitPhotoSrc: string;
  report: any;

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
        obs.unobserve(this.reportCard['el']);
        this.loadReport();
      }
    }, options);
  }

  

  ngOnInit() {
    // delaying the observer to skip the first intersection
    setTimeout(() => {
      this.observer.observe(this.reportCard['el']);
    }, 200);
  }



  onEditReportClick() {
    var extras: NavigationExtras = {
      state: {
        reportDirectory: this.reportDirectory,
        reportsDirectory: null 
      }
    };
    this.router.navigate(['report'], extras);
  }



  onSnagListClick() {
    var extras: NavigationExtras = {
      state: {
        directory: this.reportDirectory
      }
    };
    this.router.navigate(['snag-list'], extras);
  }



  onReportPreviewClick() {
    var extras: NavigationExtras = {
      state: {
        reportDirectory: this.reportDirectory
      }
    };
    this.router.navigate(['report-preview'], extras);
  }


  /** PRIVATE METHODS */

  private loadReport() {
    // read project information
    this.file.readAsText(this.reportDirectory.nativeURL, 'info.json').then(f => {
      this.report = JSON.parse(f);
      console.log("Loaded Report:", this.report.id);
    });
    // read project image
    this.file.readAsDataURL(this.reportDirectory.nativeURL, 'cover.jpg').then(base64 => {
      this.unitPhotoSrc = base64;
    });
  }

}
