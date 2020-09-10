import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { DataService } from 'src/services/data/data.service';

@Component({
  selector: 'app-snag-list',
  templateUrl: './snag-list.page.html',
  styleUrls: ['./snag-list.page.scss'],
})
export class SnagListPage implements OnInit {

  currentComments: any[];
  report: any;

  constructor(
    public alertController: AlertController, 
    private data: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    var id = this.route.snapshot.paramMap.get('report_id');
    this.loadReport(id).then(_ => {
      this.loadComments();
    });
  }


  ngOnInit() {

  }

  ionViewDidEnter() {
    if (this.report) {
      this.loadComments();
    }
  }

  onNewCommentClick() {
    this.presentAlert((zone) => {
      var extras: NavigationExtras = {
        state: { zone: zone }
      };
      this.router.navigate(['/report', this.report.id, 'comment'], extras);
    });
  }

  onFilterChange(event) {
    console.log(event.detail.value);
  }

  
  /** PRIVATE METHODS */

  private loadReport(id) {
    return this.data.getReport(id).then(report => {
      report['zones'] = JSON.parse(report['zones']);
      this.report = report;
    });
  }

  private loadComments(zone = null) {
    return this.data.getComments(this.report.id).then(comments => {
      this.currentComments = comments;
    });
  }

  private async presentAlert(selectHandler = null) {
    const alert = await this.alertController.create({
      cssClass: undefined,
      header: 'Select Zone/Area',
      inputs: this.report['zones'].map(el => {
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
