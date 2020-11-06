import { Component, OnInit } from '@angular/core';
import { File, DirectoryEntry } from '@ionic-native/file/ngx';
import { DataService } from 'src/services/data/data.service';
import { NavigationExtras, Router } from '@angular/router';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  currentReports: any[];
  mainDirectory: DirectoryEntry;

  constructor(
    private router: Router,
    private file: File,
    private platform: Platform,
    private data: DataService
  ) {
    
  }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.loadReports();
  }

  onReloadClick() {
    this.loadReports();
  }

  async onNewReportClick() {
    var reportsDirectory = await this.file.resolveDirectoryUrl(this.mainDirectory.nativeURL + 'reports');
    
    var extras: NavigationExtras = {
      state: {
        reportDirectory: null,
        reportsDirectory: reportsDirectory 
      }
    };
    this.router.navigate(['report'], extras);
  }


  /** PRIVATE METHODS */

  private loadReports() {    
    this.data.getMainDirectory().then(main => {
      this.mainDirectory = main;

      // in case the main directory was just created, make sure the reports directory exists
      this.file.checkDir(main.nativeURL, 'reports').then(exists => {
        if (exists) {
          this.file.listDir(main.nativeURL, 'reports').then(entries => {
            this.currentReports = entries.reverse();
          });
        }

      // if the reports directory does not exist, create it
      }).catch(_ => {
        this.file.createDir(main.nativeURL, 'reports', true).then(e => {
          this.currentReports = [];
        });
      });
    });
  }

}
