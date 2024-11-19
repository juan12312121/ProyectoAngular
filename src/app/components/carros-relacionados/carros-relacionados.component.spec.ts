import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrosRelacionadosComponent } from './carros-relacionados.component';

describe('CarrosRelacionadosComponent', () => {
  let component: CarrosRelacionadosComponent;
  let fixture: ComponentFixture<CarrosRelacionadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrosRelacionadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarrosRelacionadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
