import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleReservaComponent } from './detalle-reserva.component';

describe('DetalleReservaComponent', () => {
  let component: DetalleReservaComponent;
  let fixture: ComponentFixture<DetalleReservaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleReservaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleReservaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
