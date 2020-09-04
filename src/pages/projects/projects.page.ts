import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/services/data/data.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.page.html',
  styleUrls: ['./projects.page.scss'],
})
export class ProjectsPage implements OnInit {

  constructor(
    private platform: Platform,
    private data: DataService
  ) { }

  async ngOnInit() {
    await this.data.initialize();
    this.data.getProjects();
  }

}
