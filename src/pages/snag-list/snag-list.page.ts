import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-snag-list',
  templateUrl: './snag-list.page.html',
  styleUrls: ['./snag-list.page.scss'],
})
export class SnagListPage implements OnInit {

  constructor(public alertController: AlertController, private router: Router) { }


  ngOnInit() {
    
  }

  onNewCommentClick() {
    this.presentAlert((x) => {
      this.navigateToNewCommentPage(x);
    });
  }

  onFilterChange() {
    
  }

  
  /** PRIVATE METHODS */

  private navigateToNewCommentPage(selectedZone) {
    var extras: NavigationExtras = {
      state: {
        zone: selectedZone
      }
    };
    this.router.navigate(['/project', '1', 'comment'], extras);
    // this.router.navigate(['/project', '1', 'comment']);
  }

  private getListOfZones(): any {
    return [
      {
        name: 'radio1',
        type: 'radio',
        label: 'Bedroom #1',
        value: 'value1',
        checked: undefined
      },
      {
        name: 'radio2',
        type: 'radio',
        label: 'Bedroom #2',
        value: 'value2'
      },
      {
        name: 'radio3',
        type: 'radio',
        label: 'Main Hall',
        value: 'value3'
      },
      {
        name: 'radio4',
        type: 'radio',
        label: 'Master Bathroom',
        value: 'value4'
      }
    ];
  }

  private async presentAlert(selectHandler = null) {
    const alert = await this.alertController.create({
      cssClass: undefined,
      header: 'Select Zone/Area',
      inputs: this.getListOfZones(),
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
