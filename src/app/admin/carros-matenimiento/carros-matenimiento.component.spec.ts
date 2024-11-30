import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrosMatenimientoComponent } from './carros-matenimiento.component';

describe('CarrosMatenimientoComponent', () => {
  let component: CarrosMatenimientoComponent;
  let fixture: ComponentFixture<CarrosMatenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrosMatenimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarrosMatenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
