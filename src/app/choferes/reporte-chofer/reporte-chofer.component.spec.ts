import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteChoferComponent } from './reporte-chofer.component';

describe('ReporteChoferComponent', () => {
  let component: ReporteChoferComponent;
  let fixture: ComponentFixture<ReporteChoferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteChoferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteChoferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
