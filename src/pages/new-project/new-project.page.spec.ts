import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewProjectPage } from './new-project.page';

describe('NewProjectPage', () => {
  let component: NewProjectPage;
  let fixture: ComponentFixture<NewProjectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewProjectPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewProjectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
