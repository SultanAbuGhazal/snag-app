import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController, NavController, AlertController } from '@ionic/angular';
import { File, DirectoryEntry } from '@ionic-native/file/ngx';
import { WEATHER, UNIT_TYPE, UNIT_AGE } from 'src/data/lists';
import { DataService } from 'src/services/data/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})
export class ReportPage implements OnInit {

  // new report form
  form: FormGroup;
  validationMessages: any = null;
  editMode: boolean = false;

  reportsDirectory: DirectoryEntry;
  reportDirectory: DirectoryEntry;
  report: any;

  unitPhotoSrc: string; // ?

  zones: Array<any> = [];
  weatherList: Array<any> = WEATHER;
  unitAgeList: Array<any> = UNIT_AGE;
  unitTypeList: Array<any> = UNIT_TYPE;

  constructor(
    public alertController: AlertController,
    private actionSheetController: ActionSheetController,
    private formBuilder: FormBuilder,
    private nav: NavController,
    private file: File,
    private camera: Camera,
    private data: DataService,
    private router: Router
  ) {
    var extras = this.router.getCurrentNavigation().extras;

    if (extras.state.reportsDirectory) {
      this.reportsDirectory = extras.state.reportsDirectory;
    }

    if (extras.state.reportDirectory) { // editing mode
      console.log("Open in Editing Mode.");
      this.editMode = true;
      this.reportDirectory = extras.state.reportDirectory;
    }
  }


  ngOnInit() {
    var form = this.buildForm();
    
    if (this.editMode) {
      this.loadReport().then(report => {
        // fill the form with current values
        for (const field in form.value) {
          if (report.hasOwnProperty(field)) {
            console.log(field);
            form.get(field).setValue(report[field]);
          }
        }
      });
    }
  }


  onAddZoneClick(input) {
    if (input.value && input.value.trim() != '') {
      this.addZone(input.value);
      input.value = null;
    }
  }


  onDeleteZoneClick(index) {
    this.removeZone(index);
  }


  onAddPhotoClick() {
    this.openCamera().then(imageURI => {
      this.data.getImageSrcFromFileURI(imageURI).then(src => {
        this.unitPhotoSrc = src;
        this.form.get('unit_photo_uri').setValue(imageURI);
      });
    }).catch(_ => {
      // no image selected
    });
  }



  onDeleteClick() {
    this.alertController.create({
      header: 'Delete Report',
      message: 'Are you sure you want to delete this report?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Yes',
          handler: () => {
            this.deleteReport().then(_ => {
              this.nav.back();
            });
          }
        }
      ]
    }).then(alert => {
      alert.present();
    });
  }


  onSaveClick() {
    console.log("Save:", this.form.value);
    if (this.form.valid) {
      var report = this.form.value;
      report['id'] = this.generateProjectId(this.form.value.name);
      
      this.saveReport(report).then(_ => {
        this.nav.back();
      });
    } else {
      this.validateAllFormFields(this.form);
    }
  }

  

  
  /** PRIVATE METHODS */

  private loadReport() {
    return this.file.readAsText(this.reportDirectory.nativeURL, 'info.json').then(f => {
      this.report = JSON.parse(f);
      console.log("Loaded report", this.report);
      return this.report;
    });
  }

  

  private updateReport() {

  }



  private saveReport(report) {
    return new Promise(async (resolve, reject) => {
      var reportDirectory = await this.createReportDirectory(report.id, report['zones']);
      let photoURI = report['unit_photo_uri'];
      let photoName = photoURI.substring(photoURI.lastIndexOf('/') + 1);
      let photoPath = photoURI.substring(0, photoURI.lastIndexOf('/') + 1);

      Promise.all([
        this.file.writeFile(reportDirectory.nativeURL, 'info.json', JSON.stringify(report)),
        this.file.moveFile(photoPath, photoName, reportDirectory.nativeURL, "cover.jpg")
      ]).then(_ => {
        resolve();
      }).catch(errors => {
        console.error("Failed to save report!", errors);
        reject();
      });
    });
  }



  /**
   * Creates the report folder, the comments folder, and a folder for each zone.
   * It also creates a text file to keep track of the last comment ID.
   * @param directoryName 
   * @param zones 
   */
  private createReportDirectory(directoryName: string, zones: any[]): Promise<DirectoryEntry> {
    return new Promise((resolve, reject) => {
      // create the report folder
      this.file.getDirectory(this.reportsDirectory, directoryName, {create: true}).then(reportDirectory => {
        // create the comments folder inside the report folder
        this.file.getDirectory(reportDirectory, 'comments', {create: true}).then(commentsDirectory => {
          var promises = [];

          // write a file to track the comment id
          promises.push(this.file.writeFile(commentsDirectory.nativeURL, 'last_comment_id.txt', "0"));
          // create a comments folder for each zone
          zones.forEach(z => {
            promises.push(this.file.createDir(commentsDirectory.nativeURL, z.name, true));
          });

          Promise.all(promises).then(_ => {
            resolve(reportDirectory);
          }).catch(_ => {
            console.error("Failed to create zones folders!");
            reject();
          });
        }).catch(_ => {
          console.error("Failed to create comments folder!");
          reject();
        });
      }).catch(_ => {
        console.error("Failed to create report folder!");
        reject();
      });
    });
  }



  /**
   * Deletes this report by moving the report directory
   * from the reports directory to the deleted directory
   */
  private async deleteReport() {
    var folder = this.reportDirectory.nativeURL;
    if (folder.endsWith('/')) {
      folder = folder.substring(0, folder.length - 1);
    }
    var path = folder.substring(0, folder.lastIndexOf('/') + 1);

    var trashDirectory = await this.data.getTrashDirectory();
    return this.file.moveDir(path, this.reportDirectory.name, trashDirectory.nativeURL, '');
  }



  private buildForm() {
    this.validationMessages = {
      'name': [
        { type: 'required', message: 'This is required.' },
        { type: 'pattern', message: 'Only letters and digits are allowed.' }
      ],
      'description': [
        { type: 'required', message: 'This is required.' }
      ],
      'unit_photo_uri': [
        { type: 'required', message: 'This is required.' }
      ]
    };
    this.form = this.formBuilder.group({
      name: new FormControl(null, Validators.compose([
        Validators.required,
        Validators.pattern('[a-zA-Z0-9 ]*')
      ])),
      description: new FormControl(null, Validators.required),
      prepared_for: new FormControl(null),
      inspected_by: new FormControl(null),
      inspected_on: new FormControl(null),
      inspected_at: new FormControl(null),
      weather: new FormControl(null),
      unit_reference: new FormControl(null),
      unit_type: new FormControl(null),
      unit_age: new FormControl(null),
      unit_photo_uri: new FormControl(null, Validators.required),
      zones: new FormControl(null)
    });

    return this.form;
  }

  

  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }



  private async openCamera() {
    const options: CameraOptions = {
      quality: 100,
      sourceType: null,
      destinationType: this.camera.DestinationType.FILE_URI,
      allowEdit: false,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    var promise = new Promise((resolve, reject) => {
      this.actionSheetController.create({
        header: 'Select source',
        cssClass: undefined,
        buttons: [{
          text: 'Camera',
          icon: 'camera-outline',
          handler: () => {
            options.sourceType = this.camera.PictureSourceType.CAMERA;
            this.camera.getPicture(options).then(resolve).catch(reject);
          }
        }, {
          text: 'Photo Gallery',
          icon: 'images-outline',
          handler: () => {
            options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
            this.camera.getPicture(options).then(resolve).catch(reject);
          }
        }]
      }).then(s => s.present());
    });

    return promise;
  }



  private generateProjectId(projectName) {
    let randomNumber = Math.floor(Math.random() * (9999 - 1000 + 1) ) + 1000;
    let projectId = projectName.toLowerCase().replace(/\s+/g, "_").concat("_", randomNumber);
    return projectId;
  }

  
  
  private addZone(zoneName: string) {
    this.zones.unshift({
      name: zoneName.trim()
    });
    this.form.get('zones').setValue(this.zones);
  }



  private removeZone(index) {
    this.zones.splice(index, 1);
    if (this.zones.length) {
      this.form.get('zones').setValue(this.zones);
    } else {
      this.form.get('zones').reset();
    }
  }

}
