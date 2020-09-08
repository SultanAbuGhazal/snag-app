import { Component, OnInit } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.page.html',
  styleUrls: ['./comment.page.scss'],
})
export class CommentPage implements OnInit {

  constructor(
    public actionSheetController: ActionSheetController, 
    private camera: Camera, 
    private nav: NavController
  ) {

  }


  ngOnInit() {

  }

  onAddPhotoClick() {
    this.openCamera();
  }

  onSaveClick() {
    this.presentActionSheet();
  }


  /** PRIVATE METHODS */

  private saveComment() {

  }

  private async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'What next?',
      cssClass: undefined,
      buttons: [{
        text: 'New Comment, Same Zone',
        icon: 'add',
        handler: () => {
          console.log('Comment');
        }
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

  private openCamera(source = this.camera.MediaType.PICTURE) {
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      console.log(base64Image);
    }, (err) => {
      // Handle error
      console.log(err);
    });
  }

}
