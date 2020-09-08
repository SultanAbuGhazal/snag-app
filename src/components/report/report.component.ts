import { Component, OnInit, Input } from '@angular/core';
import { DataService } from 'src/services/data/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ProjectComponent implements OnInit {

  @Input('id') id: string;
  unitPhotoSrc: string;
  report: any;

  constructor(
    private router: Router,
    private data: DataService
  ) { }

  ngOnInit() {
    this.loadReport();
  }


  /** PRIVATE METHODS */

  private loadReport() {
    this.data.getReport(this.id).then(report => {
      this.report = report;
      this.data.getImageSrcFromFileURI(report['unit_photo_uri']).then(src => {
        this.unitPhotoSrc = src;
      });
    });
  }

}
