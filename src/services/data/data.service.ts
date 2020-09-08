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


  getReports(): Promise<any> {
    var promise = new Promise((resolve, reject) => {
      this.getReportsDirectory().then(entry => {
        this.file.listDir(entry.nativeURL.replace("/"+entry.name, ""), entry.name).then(entries => {
          resolve(entries.map(el => el.name));
        });
      });
    });

    return promise;
  }


  getReport(id: string): Promise<any> {
    return this.file.readAsText(this.mainPath.concat('/', this.paths.reports, '/', id), this.paths.report_info).then(f => {
      return JSON.parse(f);
    });
  }


  newReport(id: string, report: Object): Promise<any> {
    var promise = new Promise((resolve, reject) => {
      // create the project folder
      this.file.createDir(this.mainPath.concat('/', this.paths.reports), id, true).then(entry => {
        let photoName = report['unit_photo_uri'].substring(report['unit_photo_uri'].lastIndexOf('/') + 1);
        let photoPath = report['unit_photo_uri'].substring(0, report['unit_photo_uri'].lastIndexOf('/') + 1);

        // copy the project photo from the cache to report folder
        this.file.moveFile(photoPath, photoName, entry.nativeURL, '').then(photoEntry => {
          report['unit_photo_uri'] = photoEntry.nativeURL;
          
          // write the info.json file
          this.file.writeFile(entry.nativeURL, this.paths.report_info, JSON.stringify(report)).then(_ => {
            resolve();
          }).catch(err => {
            console.error("Failed to write json file!");
            reject();
          });
        }).catch(err => {
          console.error("Failed to move photo!");
          reject();
        });
      }).catch(_ => {
        console.error("Failed to create folder!");
        reject();
      });
    });

    return promise;
  }


  getImageSrcFromFileURI(uri): Promise<string> {
    let filename = uri.substring(uri.lastIndexOf('/') + 1);
    let path = uri.substring(0, uri.lastIndexOf('/') + 1);
    return this.file.readAsDataURL(path, filename);
  }


  /** PRIVATE METHODS */

  private async getMainDirectory() {
    var rootDirEntry = await this.file.resolveDirectoryUrl(this.root);
    return this.file.getDirectory(rootDirEntry, directory_name, { create: true });
  }

  private async getReportsDirectory() {
    var mainDirEntry = await this.getMainDirectory();
    return this.file.getDirectory(mainDirEntry, this.paths.reports, { create: true });
  }

  // private async getReportDirectory(name) {
  //   var mainDirEntry = await this.getMainDirectory();
  //   return this.file.getDirectory(mainDirEntry, this.paths.reports, { create: true });
  // }

}
