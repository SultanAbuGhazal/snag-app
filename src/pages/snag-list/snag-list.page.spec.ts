import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SnagListPage } from './snag-list.page';

describe('SnagListPage', () => {
  let component: SnagListPage;
  let fixture: ComponentFixture<SnagListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnagListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SnagListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
