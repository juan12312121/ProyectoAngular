import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleRentaComponent } from './detalle-renta.component';

describe('DetalleRentaComponent', () => {
  let component: DetalleRentaComponent;
  let fixture: ComponentFixture<DetalleRentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleRentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleRentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
