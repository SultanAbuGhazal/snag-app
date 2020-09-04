import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.page.html',
  styleUrls: ['./new-project.page.scss'],
})
export class NewProjectPage implements OnInit {

  // new project form
  form: FormGroup;
  zones: Array<any> = [];

  constructor(private formBuilder: FormBuilder) { }

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

  onSaveClick() {
    console.log(this.form.value);
  }

  

  
  /** PRIVATE METHODS */

  private buildForm() {
    this.form = this.formBuilder.group({
      project_name: new FormControl(null, Validators.required),
      unit_reference: new FormControl(null, Validators.required),
      project_description: new FormControl(null, Validators.required),
      zones: new FormControl(null, Validators.required)
    });
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
