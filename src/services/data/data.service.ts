import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { File, DirectoryEntry } from '@ionic-native/file/ngx';
import { MAIN_DIRECTORY_NAME as directory_name } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  private root;
  // private mainPath: string;
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
      // this.mainPath = this.file.externalRootDirectory.concat(directory_name);
    });
  }



  getImageSrcFromFileURI(uri): Promise<string> {
    let filename = uri.substring(uri.lastIndexOf('/') + 1);
    let path = uri.substring(0, uri.lastIndexOf('/') + 1);
    return this.file.readAsDataURL(path, filename);
  }



  /** PRIVATE METHODS */

  public async getMainDirectory() {
    var rootDirEntry = await this.file.resolveDirectoryUrl(this.root);
    return this.file.getDirectory(rootDirEntry, directory_name, { create: true });
  }

  public async getTrashDirectory(): Promise<DirectoryEntry> {
    var mainDirEntry = await this.getMainDirectory();
    return this.file.getDirectory(mainDirEntry, 'deleted', { create: true });
  }

  // public async getReportsDirectory() {
  //   var mainDirEntry = await this.getMainDirectory();
  //   return this.file.getDirectory(mainDirEntry, 'reports', { create: true });
  // }

  // private async getReportDirectory(id: string) {
  //   var dirEntry = await this.getReportsDirectory();
  //   return this.file.getDirectory(dirEntry, id, { create: true });
  // }

  // private async getCommentsDirectory(reportId: string) {
  //   var dirEntry = await this.getReportDirectory(reportId);
  //   return this.file.getDirectory(dirEntry, this.paths.comments, { create: true });
  // }

  // private async getZoneCommentsDirectory(reportId: string, zone: string) {
  //   var dirEntry = await this.getCommentsDirectory(reportId);
  //   return this.file.getDirectory(dirEntry, zone, { create: true });
  // } 

  // private async getCommentDirectory(reportId: string, zone: string, commentId: any) {
  //   if (typeof commentId == 'number') {
  //     commentId = commentId.toString();
  //   }
  //   var dirEntry = await this.getZoneCommentsDirectory(reportId, zone);
  //   return this.file.getDirectory(dirEntry, commentId, { create: true });
  // }

}
