import { Component, OnInit } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActivatedRoute, Router } from '@angular/router';
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
  photographs: any[] = [];
  photographsSrc: any[] = [];
  editMode: boolean = false;
  reportId: string;
  commentId: string;
  zone: any;

  constructor(
    public actionSheetController: ActionSheetController,
    private formBuilder: FormBuilder, 
    private data: DataService,
    private camera: Camera, 
    private route: ActivatedRoute,
    private nav: NavController,
    private router: Router
  ) {
    this.reportId = this.route.snapshot.paramMap.get('report_id');
    this.commentId = this.route.snapshot.paramMap.get('comment_id');
    var extras = this.router.getCurrentNavigation().extras;
    this.zone = extras.state.zone;

    if (this.commentId) {
      this.editMode = true;
    }
  }


  ngOnInit() {
    this.buildForm();
  }

  onAddPhotoClick() {
    this.openCamera().then(imageURI => {
      this.photographs.push(imageURI);
      this.form.get('photographs').setValue(JSON.stringify(this.photographs));
      this.data.getImageSrcFromFileURI(imageURI).then(src => {
        this.photographsSrc.push(src);
      });
    }).catch(_ => {
      // no image selected
    });
  }

  onSaveClick() {
    if (this.form.valid) {
      this.saveComment().then(_ => {
        this.form.reset({zone: this.zone.name});
        this.photographs = [];
        this.photographsSrc = [];
      });
    } else {
      this.validateAllFormFields(this.form);
    }
  }



  onDeletePhotoClick(index) {
    this.photographs.splice(index, 1);
    this.form.get('photographs').setValue(JSON.stringify(this.photographs));
  }



  /** PRIVATE METHODS */

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
      zone: new FormControl(this.zone.name, Validators.required),
      description: new FormControl("This is the first comment.", Validators.required),
      photographs: new FormControl(null, Validators.required)
    });
  }



  private saveComment() {
    return new Promise((resolve, reject) => {
      this.data.getNextCommentId(this.reportId).then(nextId => {
        var comment = this.form.value;
        comment['id'] = nextId;

        this.data.newComment(this.reportId, comment.zone, comment['id'], comment).then(_ => {
          this.presentActionSheet();
          resolve();
        });
      });
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
