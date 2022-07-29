import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BookAppointmentPage } from './book-appointment.page';

describe('BookAppointmentPage', () => {
  let component: BookAppointmentPage;
  let fixture: ComponentFixture<BookAppointmentPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BookAppointmentPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();
  
    fixture = TestBed.createComponent(BookAppointmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
