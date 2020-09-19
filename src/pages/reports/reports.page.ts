import { Component, OnInit } from '@angular/core';
import { File, DirectoryEntry } from '@ionic-native/file/ngx';
import { DataService } from 'src/services/data/data.service';
import { NavigationExtras, Router } from '@angular/router';


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
      this.file.listDir(main.nativeURL, 'reports').then(entries => {
        this.currentReports = entries.reverse();
      });
    });
  }

}
