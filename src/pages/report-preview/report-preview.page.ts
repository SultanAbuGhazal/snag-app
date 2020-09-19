import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-report-preview',
  templateUrl: './report-preview.page.html',
  styleUrls: ['./report-preview.page.scss'],
})
export class ReportPreviewPage implements OnInit {

  @ViewChild('docContainer', {static: true}) docContainer: ElementRef;
  source: any;

  constructor() { }

  ngOnInit() {
    var dd = {
      content: [
        'First paragraph',
        'Another paragraph, this time a little bit longer to make sure, this line will be divided into at least two lines'
      ]
    };

    var pdfDocGenerator = pdfMake.createPdf(dd);
    pdfDocGenerator.getDataUrl((dataUrl) => {
      this.source = dataUrl;
    });
  }

  onExportClick() {
    
  }

  /** PRIVATE METHODS */
  


}
