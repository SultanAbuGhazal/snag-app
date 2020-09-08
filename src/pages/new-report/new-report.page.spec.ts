import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NewReportPage } from './new-report.page';

describe('NewReportPage', () => {
  let component: NewReportPage;
  let fixture: ComponentFixture<NewReportPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewReportPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NewReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
