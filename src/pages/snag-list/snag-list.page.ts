import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { File, DirectoryEntry } from '@ionic-native/file/ngx';
import { Router, NavigationExtras } from '@angular/router';
import { DataService } from 'src/services/data/data.service';

@Component({
  selector: 'app-snag-list',
  templateUrl: './snag-list.page.html',
  styleUrls: ['./snag-list.page.scss'],
})
export class SnagListPage implements OnInit {

  currentComments: any[];
  reportDirectory: DirectoryEntry;
  zonesDirectories: DirectoryEntry[];
  report: any;

  constructor(
    public alertController: AlertController, 
    private data: DataService,
    private file: File,
    private router: Router
  ) {
    var extras = this.router.getCurrentNavigation().extras;
    this.reportDirectory = extras.state.directory;

    // this.file.getDirectory(this.reportDirectory, 'comments', {create: true}).then(entry => {
      this.file.listDir(this.reportDirectory.nativeURL, 'comments').then(entries => {
        this.zonesDirectories = entries.filter(el => el.isDirectory) as DirectoryEntry[];
      });
    // });
  }


  ngOnInit() {

  }

  ionViewDidEnter() {
    this.loadComments();
  }

  onNewCommentClick() {
    this.presentAlert(async (zoneDirectory) => {
      var commentsDirectory = await this.file.resolveDirectoryUrl(this.reportDirectory.nativeURL + 'comments');
      var lastIdFile = await this.file.getFile(commentsDirectory, 'last_comment_id.txt', {create: false});
      
      var extras: NavigationExtras = {
        state: {
          commentDirectory: null,
          zoneDirectory: zoneDirectory,
          lastIdFile: lastIdFile 
        }
      };
      this.router.navigate(['comment'], extras);
    });
  }

  onFilterChange(event) {
    console.log(event.detail.value);
    
    // if (event.detail.value == "all") {
    //   this.loadComments();
    // } else {
    //   let zone = event.detail.value;
    //   this.loadComments(zone);
    // }
  }

  
  /** PRIVATE METHODS */

  private loadComments(zone = null) {
    this.file.listDir(this.reportDirectory.nativeURL, 'comments').then(zonesDirectories => {
      if (zone) {
        zonesDirectories = zonesDirectories.filter(el => el.name == zone);
      }
      this.currentComments = [];
      zonesDirectories.forEach(dir => {
        if (dir.isDirectory) {
          this.file.listDir(this.reportDirectory.nativeURL + 'comments', dir.name).then(commentsDirectories => {
            this.currentComments = this.currentComments.concat(commentsDirectories.reverse());
          });
        }
      });
    });
  }

  private async presentAlert(selectHandler = null) {
    const alert = await this.alertController.create({
      cssClass: undefined,
      header: 'Select Zone/Area',
      inputs: this.zonesDirectories.map(el => {
        return {
          name: el.name,
          type: 'radio',
          label: el.name,
          value: el,
          checked: undefined
        };
      }),
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: undefined
        }, {
          text: 'Ok',
          handler: selectHandler
        }
      ]
    });

    await alert.present();
  }
}
