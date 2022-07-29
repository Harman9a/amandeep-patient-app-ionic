import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { IdemoComponent } from './idemo.component';

describe('IdemoComponent', () => {
  let component: IdemoComponent;
  let fixture: ComponentFixture<IdemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdemoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(IdemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
