import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { WEATHER, PROPERTY_TYPE, PROPERTY_AGE } from 'src/data/lists';
import { File, DirectoryEntry } from '@ionic-native/file/ngx';
import { DataService } from 'src/services/data/data.service';
import { Router } from '@angular/router';

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { resolve } from 'dns';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-report-preview',
  templateUrl: './report-preview.page.html',
  styleUrls: ['./report-preview.page.scss'],
})
export class ReportPreviewPage implements OnInit {

  @ViewChild('docContainer', {static: true}) docContainer: ElementRef;
  reportDirectory: DirectoryEntry;
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
        testImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAH0BAMAAADh9GazAAAAG1BMVEXMzMyWlpacnJyqqqrFxcWxsbGjo6O3t7e+vr6He3KoAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAFBElEQVR4nO3Zz2/aSBjG8df8MkeGFJKjabvbHKHbSj2aptu9Alr1DKtK6RG6Us7QXvbP3nlnxvY0IUkPrYZK349U/FCD9L7YMx47IgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA4Ofpvxy+uZ0e9nXybH87pdQzbrM0xixupQd17cdGt1JSO9eIFuOradIRHeOsxffrG25SSrY03Rxcgftv0hH9uhGfLiROSbV9IxPzqjMzxTfpiLxupGXOyiszlDgldXCN9PVk6urP2qRjuuapmur3FnpS7eOU1MQ10nan/eYsTse063pnY9GJYhqnlLpmqY1kfngM43RMz5QhheFRxCml+TDTRnzhmS2zSceEubou3DyJUlKbC9fIzp1KPbONkrJzWmk3k+oAZeMQcn8qbc6jlJKtwjUyC5eQRZScpYbcVFVm1dhph0vIKEopvTWla8T/nvrjNslp6SnTqgfAfJRvhn9Lfcjs8WtSSrNzcY1M3HTbtzNWk5zcnMVz62G0MWa4197cfx3GUUpIB+o3jRRR8jam7Ji6yF11Fa/KH0YpIS3CN+LmnI42UifvYKbdZkZa+it7ab9Z6vv5MEoJLc/EN2JC+YMoeW1zMW8udjMzKv+c2Pdhfp6bKKXT0ap9I75ubaRO1WfGs+aishmWOkM88d9yX25SOm7CeeSI6NnUzKz/XIoOoPMTOyJupnlkjNgxcGf1YVdipzVG3Az1yKylK/ftre/thic2a5lg/FAjfXNn3XU43Uaq6/k6SkHP3Fmh24NYXc/HUUqnaaRaYU2jFOzu3sbagV2tsM6ilE7TyH2rX2sybi7snf9K3djT6NRWvxIGe3UXso+SZ+96l3VX4T7QnkbVXchFlBLLojtEEyfvrVnP65Hf9mkzqu8LB3FKK3v4nt2ufLv1FTEPRV+c3j17aOTepyhu5TupJuCO8UuU4gSfooRF0n3Ptdq6ZNnVzxFn5kX510TfntxzrdDIfU8aD3rKtOp1/Nzt1KJP7kljaKRdP/FtktroWdU31ZBxD4bNc42z+olvk5LKHnoan/sWNvUR0p3jUtPJPY0PvvPvI52V+T1cVU7t7yMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8CvKwr9f3i/WiBm+umfPrUYG9l1mjJGhSGugb62rybXIe/NRskJk8nMrfcSg88c9e4404l7He7kJjXR+K7/al3erMvsk+ebnV/uAgbyVl8+kVeY2dJ9OJVsNdNN+urR7s9Uz6W3tnqiR87Vch0baC//SnWY30tul7EMb6X58v2hv5/KvfHj3WrKPbvPhnf7Amd3VL+R13Mjgsl+ERlqlf+kUWWv/Je2AsqdWq+wU/elq+0ae298+K93muczt3szukmv7zw4mHR+ukZveNjSSVS+DLF9fp23EDnb3QxeX60KL1bp0M6jGyEC+tLcSH5HWZ7l7RORFkfiIaCX6s68/re1hcNXqJjoirVX4YGikO5K7Y0SWi+SN6BiR1fbzQm7KK61WN80Ykfw8fDA04t6412jWktQXHS3IzlpyKOel5JNLLUc3zawleRE+GDfiT78rU11HJHUj36G3TV3BD/I5dQE/SHaZugIAwHf4H0NwywsM0GI2AAAAAElFTkSuQmCC'
      },
      styles: this.getStyles()
    };

    return def;
  }



  onExportClick() {
    
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



  private getComments(): Promise<[]> {
    var promise: Promise<[]> = new Promise((resolve, reject) => {
      var nodes: any = [];

      this._getZoneEntries(this.reportDirectory).then(zones => {
        for (let z = 0; z < zones.length; z++) {
          nodes.push({
            pageBreak: 'before',
            text: (z+1).toString() + '. ' + zones[z].name,
            headlineLevel: 2,
            style: 'headlineLevel2',
            tocItem: 'mainToc',
            tocMargin: [20, 0, 0, 0]
          });

          for (let c = 0; c < 3; c++) {
            nodes.push({
              style: 'tableExample',
              margin: [0, 0, 0, 10],
              table: {
                widths: ['*', '*', '*', '*', '*'],
                body: [
                  [{text: '#000'+(c+1).toString(), colSpan: 5, alignment: 'right', borderColor: '#ffffff', border: [false, false, false, 1]}, '', '', '', ''],
                  [{text: 'There is a water leakage in the ceiling!\n\n', colSpan: 5, border: [false, false, false, false]}, '', '', '', ''],
                  [
                    {
                        stack: [
                            {text: '#000'+(c+1).toString()+'A', fontSize: 9, margin: [0, 2, 0, 0], alignment: 'left', style: {color: 'grey'}},
                            {image: 'testImage', width: '95'},
                            {text: 'Done [   ]', margin: [0, 2, 0, 0], alignment: 'right'}
                        ],
                        colSpan: 1, border: [0, false, false, false]
                    },
                    {
                        stack: [
                            {text: '#000'+(c+1).toString()+'A', fontSize: 9, margin: [0, 2, 0, 0], alignment: 'left', style: {color: 'grey'}},
                            {image: 'testImage', width: '95'},
                            {text: 'Done [   ]', margin: [0, 2, 0, 0], alignment: 'right'}
                        ],
                        colSpan: 1, border: [0, false, false, false]
                    },
                    {
                        stack: [
                            {text: '#000'+(c+1).toString()+'A', fontSize: 9, margin: [0, 2, 0, 0], alignment: 'left', style: {color: 'grey'}},
                            {image: 'testImage', width: '95'},
                            {text: 'Done [   ]', margin: [0, 2, 0, 0], alignment: 'right'}
                        ],
                        colSpan: 1, border: [0, false, false, false]
                    },
                    {
                        stack: [
                            {text: '#000'+(c+1).toString()+'A', fontSize: 9, margin: [0, 2, 0, 0], alignment: 'left', style: {color: 'grey'}},
                            {image: 'testImage', width: '95'},
                            {text: 'Done [   ]', margin: [0, 2, 0, 0], alignment: 'right'}
                        ],
                        colSpan: 1, border: [0, false, false, false]
                    },
                    {
                        stack: [
                            {text: '#000'+(c+1).toString()+'A', fontSize: 9, margin: [0, 2, 0, 0], alignment: 'left', style: {color: 'grey'}},
                            {image: 'testImage', width: '95'},
                            {text: 'Done [   ]', margin: [0, 2, 0, 0], alignment: 'right'}
                        ],
                        colSpan: 1, border: [0, false, false, false]
                    },
                  ]
                ]
              }
            });
          }
        }
    
        resolve(nodes);  
      });
    });

    return promise;
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



  private _getCommentEntriesByZone(reportDirectory: DirectoryEntry, zoneDirectory: DirectoryEntry) {
    return this.file.listDir(reportDirectory.nativeURL + 'comments', zoneDirectory.name).then(commentsDirectories => {
      return commentsDirectories;
    });
  }



  private _getCommentDetails(commentDirectory: DirectoryEntry) {
    return this.file.readAsText(commentDirectory.nativeURL, 'details.json').then(f => {
      var comment = JSON.parse(f);
      return comment;
    });
  }

}
