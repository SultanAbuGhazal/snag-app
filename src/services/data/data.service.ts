import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { MAIN_DIRECTORY_NAME as directory_name } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private mainDirectoryLocation: string = this.file.externalRootDirectory;
  private mainDirectory: DirectoryEntry;

  constructor(
    private platform: Platform,
    private file: File
  ) {

  }

  initialize(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.mainDirectory) resolve(this.mainDirectory);
      else {
        this.getMainDirectory().then(entry => {
          this.mainDirectory = entry;
          resolve(this.mainDirectory);
        }, error => {
          console.log(error);
        });
      }
    });
  }


  getProjects(): Promise<any> {
    var promise = new Promise((resolve, reject) => {
        this.mainDirectory.getDirectory('projects', { create: false }, projectsEntry => {
          console.log(projectsEntry);
          this.file.listDir(this.mainDirectory.nativeURL, 'projects').then(x => {
            console.log(x);
          }, error => {
            console.log(error);
          });
        }, error => {
          console.log(error);
        });
    });

    return promise;
  }


  /** PRIVATE METHODS */

  /**
   * get the main directory if it exists,
   * create it if it does not exist
   */
  private getMainDirectory(): Promise<any> {

    var promise = new Promise((resolve, reject) => {

      window.resolveLocalFileSystemURL(this.mainDirectoryLocation, (entry: DirectoryEntry) => {
        entry.getDirectory(directory_name, { create: true }, entry => {
          console.log("Main Directory Found!", entry.fullPath);
          resolve(entry);
        }, error => {
          console.log(error);
        });

      }, error => {
        console.log(error);
      });

    });

    return promise;
  }

}
