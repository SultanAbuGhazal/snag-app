import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController, NavController } from '@ionic/angular';
import { WEATHER, UNIT_TYPE, UNIT_AGE } from 'src/data/lists';
import { DataService } from 'src/services/data/data.service';

@Component({
  selector: 'app-new-report',
  templateUrl: './new-report.page.html',
  styleUrls: ['./new-report.page.scss'],
})
export class NewReportPage implements OnInit {

  // new report form
  form: FormGroup;
  zones: Array<any> = [];
  unitPhotoSrc: string;
  weatherList: Array<any> = WEATHER;
  unitAgeList: Array<any> = UNIT_AGE;
  unitTypeList: Array<any> = UNIT_TYPE;
  validationMessages: any = null;

  constructor(
    private actionSheetController: ActionSheetController,
    private formBuilder: FormBuilder,
    private nav: NavController,
    private camera: Camera,
    private data: DataService
  ) {
    
  }


  ngOnInit() {
    this.buildForm();
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


  onSaveClick() {
    console.log("Save:", this.form.value);
    if (this.form.valid) {
      var report = this.form.value;
      report['id'] = this.generateProjectId(this.form.value.name);
      
      this.data.newReport(report.id, report).then(_ => {
        this.nav.back();
      });
    } else {
      this.validateAllFormFields(this.form);
    }
  }

  

  
  /** PRIVATE METHODS */

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
      name: new FormControl('My First Project.', Validators.compose([
        Validators.required,
        Validators.pattern('[a-zA-Z0-9 ]*')
      ])),
      description: new FormControl("This is the first project.", Validators.required),
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



  private async openCamera(source = this.camera.MediaType.PICTURE) {
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
    this.form.get('zones').setValue(JSON.stringify(this.zones));
  }



  private removeZone(index) {
    this.zones.splice(index, 1);
    if (this.zones.length) {
      this.form.get('zones').setValue(JSON.stringify(this.zones));
    } else {
      this.form.get('zones').reset();
    }
  }

}
