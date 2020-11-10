import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WEATHER, PROPERTY_TYPE, PROPERTY_AGE } from 'src/data/lists';
import { File, DirectoryEntry } from '@ionic-native/file/ngx';
import { DataService } from 'src/services/data/data.service';
import { Router } from '@angular/router';

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
  reportDirectory: DirectoryEntry;
  reportPDF: any;
  source: any;

  constructor(
    private data: DataService,
    private router: Router,
    private file: File
  ) {
    var extras = this.router.getCurrentNavigation().extras;
    this.reportDirectory = extras.state.reportDirectory;
  }



  ngOnInit() {
    this.getDocumentDefinition().then(dd => {
      var pdfDocGenerator = pdfMake.createPdf(dd);
      this.reportPDF = pdfDocGenerator;
      pdfDocGenerator.getDataUrl((dataUrl) => {
        this.source = dataUrl;
      });
    });
  }



  async getDocumentDefinition() {
    var def = {
      pageSize: 'A4',
      pageOrientation: 'portrait',
      pageBreakBefore: function (currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
          // console.log(currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage);
          // return followingNodesOnPage.length === 0;
          return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0;
      },
      footer: this.getFooter(),
      background: this.getBackground(),
      content: [
        ...this.getCoverPage(),
        ...this.getTableOfContent(),
        ...this.getIntroduction(),
        '\n\n',
        ...(await this.getPropertyDetails()),
        ...(await this.getComments())
      ],
      images: {
        testImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAJYBAMAAAC+wq27AAAAG1BMVEXMzMyWlpacnJyqqqrFxcWxsbGjo6O3t7e+vr6He3KoAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAFRUlEQVR4nO3ZS2/bOBSGYVKWL0tTbp0srV4mWcadFuhSTjKdWdrGoGt7ECBdOp1B1nEL9HcPD0lJTOpcFi3oAu8DRPocOQCPJF6kKAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwI81eFO8v5t26f5T/O3T1/Llzd2UUs+43cIYM7+TdshLe/RGUteG5+p2SurKFSKN8a1p0y6ncvRQktTrC25TSrlxhWylMe5Ut2mXtRwsbBiYuqQ2JdXxhZTmbT41k1tph74p/vtrbTZKZWZUnbmS2pTU1hUykJupK6e1TbtkZiW9aiV/N5eb6iZOSZWukI60Ta1HcdplW1RyNz5TajpWUtJJnFLqmoUUon33KOK0y9SNAmt7vUL3mMQppVmhpRDfcG2qKO1SPpPt8qhuuL02bUpqfegKuXK3Us/24jYJO6ZVdleGC5S7+070/a20PohSSrYVrpBpmELmUXIWEvrmoP56PV10whTyPEopnZrKFeLPp5zcNjmZ3DJZ3QG6zdgULpm9fm1KaXqgXCGlG24H9s5pk9M3o2hs7Zjqj/VY1lqZ/9V2HKWEpKPeKmQSJW9tqtzUjeyZgay1Nm0hRZQSkkb4QtyYk0shTfK25qTbjEhZ4dZaB/KXlfxiVkQpocVI+UJMaP4wSl7HHM6ayS4r1mElFsbnmYlSOm6K9oX4dkshTaq/M542k4o25qj6s7QdSJvwiyil4wacR66ILNKbkVUbvxw53LMr4kaaR/qI7QNt1q7M3Fa2X33EjVCPjFp2AA6zvPuun/zGezZqmWD8UCED0667djV/vwqp5/NVlIKeaVfoWdMf6vl8HKV02kLqFdZJlIKr6DG214xQ9QprFKV02kLuW/1a5biZ2GWJIjvbsfdt9atCZ6+fQm6i5Nmn3kVTVb+5jeqnkMMoJaajJ0QTJ+/UrGZNz8/92Z+OmufCYZzS0g8/s9uVb7edEd2Ylstia9+e2UMh975FcSvfshmAF/LyoSdXaO/eooRF0n3vtToyl181D4Yz81rWWvM9fK8VCrnvTeNWbpmsWce796n7+aYxFNJp3vi2SazlrhqYUfvZeiVp2rzxbVNS+qG38X1fwjp6VrfTTiVp797GB0/9/8i38rcwq+zb/0cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/Cp0+Pnl/WKFmOLtPUfuFDK0n7QxRhVKZUP5aJ2Vl0p9MBdKT5Qqf25LHzHMf7/nyI5C3HZ8o65DIfnr6qvdnC8r/Un11z+/tQ8YqlP15qXKqr4N3RcnSi+Hsuu8WNijevlS9Tb2SFTIwUpdhkI6c7/pnuhr1btKWYcU0r34MO9sZupf9fH8ndIXbvfxXE6wtocGE/UuLmR4PJiEQrLKb/KJzm6+pO1Q9tbKqnwyOFlu3qtX9tzryu1eqZk9qu0hdWl/bGeS/uEKue5tQiG63gx1f3WZthDb2d2JnhyvJtJYaZfshnUfGaovnY2Kr0j2WX1/RdTRJPEVkZbIaV99WtnL4Foru+iKZMvwxVBI97n6vo+oxTx5IdJH1HLzea6uqzNprezaPqL6B+GLoRD3wW2jUUulnnSkQXbUUttqVql+eSzNkV07aqn+JHwxLsTffmemnkdU6kKeoLdJ3YIf5HPqBvwg+jh1CwAAT/A/xKPO9PPCMc4AAAAASUVORK5CYII=',
        // testImage: '//placehold.it/200'
      },
      styles: this.getStyles()
    };

    return def;
  }



  onExportClick() {
    if (this.source) {
      this.reportPDF.print();
      // this.file.writeFile(this.reportDirectory.nativeURL, 'report.pdf', this.source, {replace: true}).then(_ => {
      //   console.log("exported!");
      // });
    }
  }

  

  /** PRIVATE METHODS */



  private getBackground() {
    return function (currentPage, pageSize) {
      if (currentPage == 1) return [{
        table: {
          widths: ['60%', '0%', '0%', '*'],
          heights: [840],
          body: [
            [{
              text: '',
              border: [false, false, false, false]
            }, {
              text: '',
              border: [true, false, true, false]
            }, {
              text: '',
              border: [true, false, true, false]
            }, {
              text: '',
              fillColor: '#2E75B6'
            }],
          ]
        },
        layout: {
          hLineColor: function (i, node) {
            return '#2E75B6';
          },
          vLineColor: function (i, node) {
            if (i > 0 && i < 4) {
              return '#C1D9A9';
            }
            return null;
          },
          vLineWidth: function (i, node) {
            if (i == 1) {
              return 2;
            }
            if (i == 2) {
              return 1.5;
            }
            return null;
          },
          paddingLeft: function (i) {
            return 0;
          },
          paddingRight: function (i, node) {
            return 2;
          }
        }
      }];

      return null;
    }
  }



  private getFooter() {
    return function(currentPage, pageCount) {
      if (currentPage != 1) {
        return {
          text: 'page ' + currentPage.toString() + ' of ' + pageCount,
          margin: [40, 10, 40, 10],
          style: {
            alignment: 'right'
          }
        };
      }
    }
  }



  private getCoverPage() {
    return [{
      style: {
        margin: [0, 0, 0, 0]
      },
      margin: [-40, -40, -40, -40],
      table: {
        widths: ['61%', '*'],
        heights: [null, 516, 100], // total 840
        body: [
          [{
            text: '',
            border: [false, false, false, false]
          }, {
            text: [{
                style: 'reportTitle',
                text: 'Inspection Report'
              },
              '\n\n\n',
              {
                style: 'reportSubtitle',
                text: 'Yas Acres: YN-06-166'
              }
            ],
            border: [false, false, false, false]
          }],
          [{
              colSpan: 2,
              border: [false, false, false, false],
              style: {
                alignment: 'center'
              },
              image: 'testImage',
              width: 400,
              height: 500
            },
            '',
          ],
          [{
              style: {
                color: '#2E75B6',
                fontSize: 13,
                bold: true
              },
              border: [false, false, false, false],
              margin: [50, 10, null, null],
              text: [
                'Prepared for Mrs. Susan Wei',
                '\n',
                'By Eng. Osama Kolayb',
                '\n',
                '8/13/2020'
              ]
            },
            {
              text: '',
              border: [false, false, false, false]
            }
          ]
        ]
      },
      layout: {
        paddingTop: function (i, node) {
          if (i === 0) return 30;
          return 10;
        },
        paddingBottom: function (i, node) {
          if (i === 0) return 30;
          return 10;
        }
      },
      pageBreak: 'after'
    }];
  }



  private getTableOfContent() {
    return [{
      toc: {
        id: 'mainToc',
        title: {
          text: 'Table of Content',
          headlineLevel: 1,
          margin: [0, 0, 0, 10],
          style: {
            fontSize: 16,
            bold: true
          }
        }
      },
      pageBreak: 'after'
    }];
  }



  private getIntroduction() {
    return [
      {
        breakPageBefore: true,
        text: 'Introduction',
        headlineLevel: 1,
        style: 'headlineLevel1',
        tocItem: 'mainToc'
      }, {
        alignment: 'justify',
        margin: [0, 10, 0, 10],
        text: 'Our company has been requested to complete an inspection for the above property and compile a Handover\
        Inspection report on readily visible defects at the time of our inspection. The following statements outline my\
        observations and my opinion of the condition of the dwelling as viewed. It is noted that this report contains an\
        opinion on that which is readily viewable and such can only be relied upon for what can be seen. No opinion\
        or warranty is made on that which cannot be seen. Additional defects may become evident over time & the\
        report is not an exhaustive list of all defects within the building. The report does not consider any electrical,\
        plumbing, fire services, security or other electronic systems.'
      }
    ];
  }



  private async getPropertyDetails() {
    var report = await this._getReportDetails(this.reportDirectory);
    return [
      {
        text: 'Address of Inspected Property',
        style: 'headlineLevel1',
        tocItem: 'mainToc'
      },
      '\n',
      {
        style: 'tableExample',
        table: {
          headerRows: 1,
          body: [
            [
              {text: 'Location', style: 'tableAttribute'}, 
              "?"
            ], [
              {text: 'Time of Inspection', style: 'tableAttribute'}, 
              new Date(report.inspected_at).toLocaleTimeString()
            ], [
              {text: 'Weather Condition', style: 'tableAttribute'}, 
              WEATHER.find(e => e.value == report.weather).name
            ], [
              {text: 'Type of Construction', style: 'tableAttribute'}, 
              PROPERTY_TYPE.find(e => e.value == report.property_type).name
            ], [
              {text: 'Building Age', style: 'tableAttribute'}, 
              PROPERTY_AGE.find(e => e.value == report.property_age).name
            ], [
              {text: 'Occupational Usage', style: 'tableAttribute'}, 
              "?"
            ], [
              {text: 'Building Furnished', style: 'tableAttribute'}, 
              "?"
            ], [
              {text: 'Building Tenancy', style: 'tableAttribute'}, 
              "?"
            ], [
              {text: 'Persons in Attendance', style: 'tableAttribute'}, 
              "?"
            ]
          ]
        },
        layout: 'noBorders'
      },
      '\n\n',
      {
        text: 'Property Description',
        tocItem: 'mainToc',
        style: 'headlineLevel1'
      },
      '\n',
      report.description
    ];
  }



  /**
   * This function prepares the comments nodes of all the zones
   * 
   */
  private async getComments() {
    var nodes = [];

    // list and iterate through the zones
    var zones = await this._getZoneEntries(this.reportDirectory);
    for (let z = 0; z < zones.length; z++) {
      nodes.push({
        pageBreak: 'before',
        text: (z+1).toString() + '. ' + zones[z].name,
        headlineLevel: 2,
        style: 'headlineLevel2',
        tocItem: 'mainToc',
        tocMargin: [20, 0, 0, 0]
      });

      // list and iterate through the comment of the current zone
      var comments = await this._getCommentsByZone(this.reportDirectory, zones[z]);
      for (let c = 0; c < comments.length; c++) {
        var commentId = comments[c].id.toString().padStart(4, '0');
        var photos: any[] = [[]];
        var row = 0;

        for (let p = 0; p < comments[c].photographs.length; p++) {
          let uri = comments[c].photographs[p];
          let filename = uri.substring(uri.lastIndexOf('/') + 1);
          let path = uri.substring(0, uri.lastIndexOf('/') + 1);
          var src = await this.file.readAsDataURL(path, filename);
          var photoId = String.fromCharCode(65 + p);

          if (p > 0 && p % 5 == 0) {
            photos.push([]);
            row++;
          }

          photos[row].push({
            stack: [
                {text: '#'+commentId+photoId, fontSize: 9, margin: [0, 2, 0, 0], alignment: 'left', style: {color: 'grey'}},
                {image: src, width: 95},
                {text: 'Done [   ]', margin: [0, 2, 0, 0], alignment: 'right'}
            ],
            colSpan: 1, border: [false, false, false, false]
          });
        }

        while (photos[row].length < 5) {
          photos[row].push({text: '', border: [false, false, false, false]});
        }

        nodes.push({
          style: 'tableExample',
          margin: [0, 0, 0, 10],
          table: {
            widths: ['*', '*', '*', '*', '*'],
            body: [
              [{text: '#'+commentId, colSpan: 5, alignment: 'right', borderColor: '#ffffff', border: [false, false, false, 1]}, '', '', '', ''],
              [{text: comments[c].description+'\n\n', colSpan: 5, border: [false, false, false, false]}, '', '', '', ''],
              ...photos
            ]
          }
        });
        // debugger;
      }
    }

    return nodes;
  }



  private getStyles() {
    return {
      header: {
        fontSize: 19,
        bold: true
      },
      tableAttribute: {
        bold: true,
        fontSize: 12,
        color: 'black'
      },
      quote: {
        italics: true
      },
      small: {
        fontSize: 8
      },    
      reportTitle: {
        color: 'white',
        bold: true,
        alignment: 'center',
        fontSize: 32
      },
      reportSubtitle: {
        color: 'white',
        bold: true,
        alignment: 'center',
        fontSize: 16
      },
      headlineLevel1: {
        fontSize: 18,
        margin: [0, 0, 0, 5],
        bold: true
      },
      headlineLevel2: {
        fontSize: 14,
        margin: [0, 0, 0, 5],
        bold: true
      }
    };
  }



  private addImages() {

  }



  private _getReportDetails(reportDirectory: DirectoryEntry) {
    return this.file.readAsText(reportDirectory.nativeURL, 'info.json').then(f => {
      var report = JSON.parse(f);
      return report;
    });
  }



  private _getZoneEntries(reportDirectory: DirectoryEntry) {
    return this.file.listDir(reportDirectory.nativeURL, 'comments').then(entries => {
      return entries.filter(el => el.isDirectory) as DirectoryEntry[];
    });
  }



  private _getCommentsByZone(reportDirectory: DirectoryEntry, zoneDirectory: DirectoryEntry): any {
    var promise = new Promise((resolve, reject) => {
      this.file.listDir(reportDirectory.nativeURL + 'comments', zoneDirectory.name).then(commentsDirectories => {
        var promises = [];

        for (let c = 0; c < commentsDirectories.length; c++) {
          promises.push(this.file.readAsText(commentsDirectories[c].nativeURL, 'details.json'));
        }

        Promise.all(promises).then(results => {
          resolve(results.map(el => JSON.parse(el)));
        });

        return commentsDirectories;
      });
    });
    
    return promise;
  }



  private _getCommentDetails(commentDirectory: DirectoryEntry) {
    return this.file.readAsText(commentDirectory.nativeURL, 'details.json').then(f => {
      var comment = JSON.parse(f);
      return comment;
    });
  }

}
