import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/services/data/data.service';
import { Platform } from '@ionic/angular';


@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {

  currentReports: any[];

  constructor(
    private platform: Platform,
    private data: DataService
  ) { }

  async ngOnInit() {
    await this.platform.ready();
  }

  ionViewDidEnter() {
    this.loadReports();
  }


  /** PRIVATE METHODS */

  private loadReports() {
    this.data.getReports().then(reports => {
      console.log(reports);
      
      this.currentReports = reports;
    });
  }

}
