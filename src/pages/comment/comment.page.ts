import { Component, OnInit } from '@angular/core';
import { ActionSheetController, NavController, AlertController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Router } from '@angular/router';
import { File, DirectoryEntry } from '@ionic-native/file/ngx';
import { Validators, FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from 'src/services/data/data.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.page.html',
  styleUrls: ['./comment.page.scss'],
})
export class CommentPage implements OnInit {

  form: FormGroup;
  validationMessages: any = null;
  editMode: boolean = false;

  zoneDirectory: DirectoryEntry;
  commentDirectory: DirectoryEntry;
  lastCommentIdFile: Entry;
  comment: any;

  photographs: {uri: string, src: any, existing: boolean}[] = [];
  removedPhotographs: string[] = [];

  constructor(
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    private formBuilder: FormBuilder, 
    private data: DataService,
    private file: File,
    private camera: Camera, 
    private nav: NavController,
    private router: Router
  ) {
    var extras = this.router.getCurrentNavigation().extras;
    
    if (extras.state.lastIdFile) {
      this.lastCommentIdFile = extras.state.lastIdFile;
    }

    if (extras.state.zoneDirectory) {
      this.zoneDirectory = extras.state.zoneDirectory;
    }

    if (extras.state.commentDirectory) { // editing mode
      console.log("Open in Editing Mode.");
      this.editMode = true;
      this.commentDirectory = extras.state.commentDirectory;
    }
  }


  ngOnInit() {
    var form = this.buildForm();
    
    if (this.editMode) {
      // prepare the form with current values
      this.loadComment().then(comment => {
        form.setValue({
          id: comment.id,
          zone: comment.zone,
          description: comment.description,
          photographs: comment.photographs,
        });
        // load the photographs
        comment.photographs.forEach(uri => {
          this.addPhotograph(uri, true);
        });
      });
    } else {
      form.get('zone').setValue(this.zoneDirectory.name);
    }
  }



  onAddPhotoClick() {
    this.openCamera().then((imageURI: string) => {
      this.addPhotograph(imageURI);
    }).catch(_ => {
      // no image selected
    });
  }



  onDeletePhotoClick(index) {
    this.removePhotograph(index);
  }



  onDeleteClick() {
    this.alertController.create({
      header: 'Delete Comment',
      message: 'Are you sure you want to delete this comment?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Yes',
          handler: () => {
            this.deleteComment().then(_ => {
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
    if (this.form.valid) {      
      if (this.editMode) {
        this.updateComment(this.commentDirectory, this.form.value).then(_ => {
          this.nav.back();
        });
      } else {
        this.saveComment(this.form.value).then(_ => {
          this.presentActionSheet();
          this.form.reset({zone: this.zoneDirectory.name});
          this.photographs = [];
          this.removedPhotographs = [];
        });
      }
    } else {
      this.validateAllFormFields(this.form);
    }
  }



  /** PRIVATE METHODS */

  private loadComment() {
    return this.file.readAsText(this.commentDirectory.nativeURL, 'details.json').then(f => {
      this.comment = JSON.parse(f);
      console.log("Loaded comment", this.comment);
      return this.comment;
    });
  }

  private addPhotograph(uri: string, existing: boolean = false) {
    this.data.getImageSrcFromFileURI(uri).then(src => {
      this.photographs.push({
        uri: uri,
        src: src,
        existing: existing
      });
      this.form.get('photographs').setValue(this.photographs.map(el => el.uri));
    });
  }

  private removePhotograph(index) {
    if (this.editMode) {
      this.removedPhotographs.push(this.photographs[index].uri);
    }
    this.photographs.splice(index, 1);

    if (this.photographs.length) {
      this.form.get('photographs').setValue(this.photographs.map(el => el.uri));
    } else {
      this.form.get('photographs').reset();
    }
  }

  private buildForm() {
    this.validationMessages = {
      'zone': [
        { type: 'required', message: 'This is required.' }
      ],
      'description': [
        { type: 'required', message: 'This is required.' }
      ],
      'photographs': [
        { type: 'required', message: 'This is required.' }
      ]
    };
    this.form = this.formBuilder.group({
      id: new FormControl(null),
      zone: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      photographs: new FormControl(null, Validators.required)
    });

    return this.form;
  }



  private updateComment(directory: DirectoryEntry, comment: any) {
    return new Promise(async (resolve, reject) => {
      let photosToBeSaved = this.photographs.filter(el => !el.existing).map(el => el.uri);
      this.savePhotographs(directory, photosToBeSaved).then((entries: any) => {
        comment.photographs = this.photographs.filter(el => el.existing).map(el => el.uri);
        if (entries) {
          comment.photographs = comment.photographs.concat(entries.map(el => el.nativeURL));
        }

        Promise.all([
          this.file.writeExistingFile(directory.nativeURL, 'details.json', comment),
          this.deletePhotographs(this.removedPhotographs)
        ]).then(resolve).catch(errors => {
          console.error("Failed to save comment!", errors);
          reject();
        });
      }).catch(reject);
    });
  }



  private saveComment(comment) {
    return new Promise(async (resolve, reject) => {
      comment.id = await this.getNextCommentId();
      var commentDirectory = await this.file.getDirectory(this.zoneDirectory, comment.id.toString(), {create: true});

      this.savePhotographs(commentDirectory, comment.photographs).then((entries: any) => {
        comment.photographs = entries.map(el => el.nativeURL);
        this.file.writeFile(commentDirectory.nativeURL, 'details.json', comment).then(resolve).catch(errors => {
          console.error("Failed to save comment!", errors);
          reject();
        });
      });
    });
  }



  private savePhotographs(distination: DirectoryEntry, photos: string[]) {
    var promises = photos.map(el => {
      var name = el.substring(el.lastIndexOf('/') + 1);
      var path = el.substring(0, el.lastIndexOf('/') + 1);
      var newPath = distination.nativeURL;
      return this.file.moveFile(path, name, newPath, '');
    });

    return Promise.all(promises).catch(err => {
      console.error("Failed to save all new photos!", err);
    });
  }



  private deletePhotographs(photos: string[]) {
    // this will return a promise that resolves 
    // when an array of promise resolves
    return Promise.all(photos.map(el => {
      var name = el.substring(el.lastIndexOf('/') + 1);
      var path = el.substring(0, el.lastIndexOf('/') + 1);
      return this.file.removeFile(path, name);
    })).catch(err => {
      console.error("Failed to delete all removed photos!", err);
    });
  }



  private deleteComment() {
    if (this.editMode) {
      var folder = this.commentDirectory.nativeURL;
      if (folder.endsWith('/')) {
        folder = folder.substring(0, folder.length - 1);
      }
      var path = folder.substring(0, folder.lastIndexOf('/') + 1);
      
      return this.file.removeRecursively(path, this.commentDirectory.name).catch(err => {
        console.error("Failed to delete comment!", err);
      });
    }
  }



  /**
   * Reads the next comment ID from a file 
   * and write the next ID to same file
   */
  private getNextCommentId() {
    return new Promise((resolve, reject) => {
      if (this.lastCommentIdFile) {
        // this part reads the numbder stored in the file
        var path = this.lastCommentIdFile.nativeURL;
        var parent = path.substring(0, path.lastIndexOf('/') + 1);
        this.file.readAsText(parent, this.lastCommentIdFile.name).then(t => {
          // this part writes the next number to the same file
          var lastCommmentId = parseInt(t);
          var nextCommmentId = lastCommmentId + 1;
          this.file.writeExistingFile(parent, this.lastCommentIdFile.name, nextCommmentId.toString()).then(_ => {
            resolve(nextCommmentId);
          }).catch(reject);
        }).catch(reject);
      } else {
        reject();
      }
    });
  }



  private async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'What next?',
      cssClass: undefined,
      buttons: [{
        text: 'New Comment, Same Zone',
        icon: 'add',
        role: 'cancel'
      }, {
        text: 'Back',
        icon: 'arrow-back',
        handler: () => {
          this.nav.back();
        }
      }]
    });

    await actionSheet.present();
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

}
