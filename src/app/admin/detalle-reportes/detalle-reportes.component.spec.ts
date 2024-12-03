import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleReportesComponent } from './detalle-reportes.component';

describe('DetalleReportesComponent', () => {
  let component: DetalleReportesComponent;
  let fixture: ComponentFixture<DetalleReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleReportesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
