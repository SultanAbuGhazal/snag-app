import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { File, DirectoryEntry } from '@ionic-native/file/ngx';
import { MAIN_DIRECTORY_NAME as directory_name } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private root;
  private mainPath: string;
  private paths = {
    reports: 'reports',
    report: 'reports/:report',
    report_info: 'info.json',
    comment_details: 'details.json',
    last_comment_id: 'last_comment_id.txt',
    comments: 'comments',
    project_photo: 'project_photo.jpg'
  };

  constructor(
    private platform: Platform,
    private file: File
  ) {
    this.platform.ready().then(_ => {
      this.root = this.file.externalRootDirectory;
      this.mainPath = this.file.externalRootDirectory.concat(directory_name);
    });
  }


  // getReports(): Promise<any> {
  //   var promise = new Promise((resolve, reject) => {
  //     this.getMainDirectory().then(entry => {
  //       this.file.listDir(entry.nativeURL, 'reports').then(entries => {
  //         resolve(entries);
  //       });
  //     });
  //   });

  //   // var promise = new Promise((resolve, reject) => {
  //   //   this.getReportsDirectory().then(entry => {
  //   //     this.file.listDir(entry.nativeURL.replace("/"+entry.name, ""), entry.name).then(entries => {
  //   //       resolve(entries.map(el => el.name));
  //   //     });
  //   //   });
  //   // });

  //   return promise;
  // }


  // getReport(id: string): Promise<any> {
  //   return this.file.readAsText(
  //     this.mainPath.concat('/', this.paths.reports, '/', id), this.paths.report_info
  //   ).then(f => {
  //     return JSON.parse(f);
  //   });
  // }


  // newReport(id: string, report: any): Promise<any> {
  //   var promise = new Promise((resolve, reject) => {
  //     // create the project folder
  //     this.file.createDir(this.mainPath.concat('/', this.paths.reports), id, true).then(entry => {
  //       let photoName = report['unit_photo_uri'].substring(report['unit_photo_uri'].lastIndexOf('/') + 1);
  //       let photoPath = report['unit_photo_uri'].substring(0, report['unit_photo_uri'].lastIndexOf('/') + 1);
  //       let newName = "cover.jpg";
  //       // replace the path of the cache (temp) location to the new permenant location
  //       report['unit_photo_uri'] = entry.nativeURL.concat(newName);


  //       Promise.all([
  //         // copy the project photo from the cache to report folder (results[0])
  //         this.file.moveFile(photoPath, photoName, entry.nativeURL, newName),

  //         // write the info.json file (results[1])
  //         this.file.writeFile(entry.nativeURL, this.paths.report_info, JSON.stringify(report)),

  //         // create a comments folder (results[2])
  //         this.file.createDir(entry.nativeURL, this.paths.comments, true)
  //       ]).then(results => {
  //         var commentsEntry = results[2];
  //         var zones = JSON.parse(report['zones']);
  //         var promises = [];
  //         // console.log("Image of the new report:", results[0].toURL());
          

  //         // create a comments folder for each zone
  //         for (let i = 0; i < zones.length; i++) {
  //           promises.push(
  //             this.file.createDir(commentsEntry.nativeURL, zones[i].name, true)
  //           );            
  //         }

  //         // write a file to track the comment id
  //         promises.push(
  //           this.file.writeFile(commentsEntry.nativeURL, this.paths.last_comment_id, "0")
  //         );

  //         Promise.all(promises).then(_ => {
  //           resolve();
  //         });

  //       }).catch(_ => {
  //         console.error("Failed to create content!");
  //         reject();
  //       });

  //     }).catch(_ => {
  //       console.error("Failed to create folder!");
  //       reject();
  //     });
  //   });

  //   return promise;
  // }



  // getComments(reportId, zone = null): Promise<any> {
  //   var promise = new Promise((resolve, reject) => {
      
  //     if (zone) {
  //       this.getZoneCommentsDirectory(reportId, zone).then(entry => {
  //         // list the comments in this zone folder
  //         this.file.listDir(entry.nativeURL.replace("/"+entry.name, ""), entry.name).then(entries => {
  //           resolve(entries.map(el => {
  //             return {
  //               id: el.name,
  //               zone: zone
  //             };
  //           }));
  //         }).catch(reject);
  //       }).catch(reject);

  //     } else {
  //       var comments = [];
  //       this.getCommentsDirectory(reportId).then(entry => {
  //         // list the zones folders and iterate through them
  //         this.file.listDir(entry.nativeURL.replace("/"+entry.name, ""), entry.name).then(zoneEntries => {
  //           // listDir each zone folder and wait for all the promises to resolve
  //           Promise.all(
  //             zoneEntries.filter(el => el.isDirectory).map(zoneEntry => {
  //               return this.file.listDir(entry.nativeURL, zoneEntry.name).then(entries => {
  //                 comments = comments.concat(entries.map(el => {
  //                   return {
  //                     id: el.name,
  //                     zone: zoneEntry.name
  //                   };
  //                 }));
  //               });
  //             })
  //           ).then(_ => {
  //             resolve(comments);
  //           }).catch(reject);
  //         }).catch(reject);
  //       }).catch(reject);
  //     }
  //   });

  //   return promise;
  // }



  // getComment(reportId: string, zone: string, id: any) {
  //   return new Promise((resolve, reject) => {
  //     if (typeof id == 'number') {
  //       id = id.toString();
  //     }

  //     this.getCommentDirectory(reportId, zone, id).then(entry => {
  //       this.file.readAsText(entry.nativeURL, this.paths.comment_details).then(f => {
  //         resolve(JSON.parse(f));
  //       }).catch(reject);
  //     }).catch(reject);
  //   });
  // }



  // newComment(reportId: string, zone: any, commentId: string, comment: any) {
  //   var promise = new Promise((resolve, reject) => {
  //     // create the comment folder
  //     this.getCommentDirectory(reportId, zone, commentId).then(entry => {
  //       // move the photographs
  //       var promises = [];
  //       comment.photographs = JSON.parse(comment.photographs);
  //       for (let i = 0; i < comment.photographs.length; i++) {
  //         let photoName = comment.photographs[i].substring(comment.photographs[i].lastIndexOf('/') + 1);
  //         let photoPath = comment.photographs[i].substring(0, comment.photographs[i].lastIndexOf('/') + 1);
  //         // replace the path of the cache (temp) location to the new permenant location
  //         comment.photographs[i] = entry.nativeURL.concat(photoName);

  //         promises.push(
  //           this.file.moveFile(photoPath, photoName, entry.nativeURL, '')
  //         );
  //       }

  //       // save the json
  //       promises.push(
  //         this.file.writeFile(entry.nativeURL, this.paths.comment_details, JSON.stringify(comment))
  //       );

  //       Promise.all(promises).then(_ => {
  //         resolve();
  //       }).catch(reject);
  //     }).catch(reject);
  //   });

  //   return promise;
  // }



  getImageSrcFromFileURI(uri): Promise<string> {
    let filename = uri.substring(uri.lastIndexOf('/') + 1);
    let path = uri.substring(0, uri.lastIndexOf('/') + 1);
    return this.file.readAsDataURL(path, filename);
  }

  

  // getNextCommentId(reportId) {
  //   var promise = new Promise((resolve, reject) => {
  //     this.getCommentsDirectory(reportId).then(entry => {
  //       // read the last comment id
  //       this.file.readAsText(entry.nativeURL, this.paths.last_comment_id).then(f => {
  //         var lastCommmentId = parseInt(f);
  //         var nextCommmentId = lastCommmentId + 1;
  
  //         // update the file with the new comment id to keep track of it
  //         this.file.writeExistingFile(entry.nativeURL, this.paths.last_comment_id, nextCommmentId.toString())
  //         .then(_ => {
  //           resolve(nextCommmentId);
  //         }).catch(reject);
  //       }).catch(reject);
  //     }).catch(reject);
  //   });

  //   return promise;
  // }


  /** PRIVATE METHODS */

  public async getMainDirectory() {
    var rootDirEntry = await this.file.resolveDirectoryUrl(this.root);
    return this.file.getDirectory(rootDirEntry, directory_name, { create: true });
  }

  public async getTrashDirectory(): Promise<DirectoryEntry> {
    var mainDirEntry = await this.getMainDirectory();
    return this.file.getDirectory(mainDirEntry, 'deleted', { create: true });
  }

  public async getReportsDirectory() {
    var mainDirEntry = await this.getMainDirectory();
    return this.file.getDirectory(mainDirEntry, this.paths.reports, { create: true });
  }

  private async getReportDirectory(id: string) {
    var dirEntry = await this.getReportsDirectory();
    return this.file.getDirectory(dirEntry, id, { create: true });
  }

  private async getCommentsDirectory(reportId: string) {
    var dirEntry = await this.getReportDirectory(reportId);
    return this.file.getDirectory(dirEntry, this.paths.comments, { create: true });
  }

  private async getZoneCommentsDirectory(reportId: string, zone: string) {
    var dirEntry = await this.getCommentsDirectory(reportId);
    return this.file.getDirectory(dirEntry, zone, { create: true });
  }

  private async getCommentDirectory(reportId: string, zone: string, commentId: any) {
    if (typeof commentId == 'number') {
      commentId = commentId.toString();
    }
    var dirEntry = await this.getZoneCommentsDirectory(reportId, zone);
    return this.file.getDirectory(dirEntry, commentId, { create: true });
  }

}
