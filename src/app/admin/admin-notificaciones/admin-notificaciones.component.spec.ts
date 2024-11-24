import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNotificacionesComponent } from './admin-notificaciones.component';

describe('AdminNotificacionesComponent', () => {
  let component: AdminNotificacionesComponent;
  let fixture: ComponentFixture<AdminNotificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNotificacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNotificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
