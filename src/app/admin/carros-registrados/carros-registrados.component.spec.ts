import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrosRegistradosComponent } from './carros-registrados.component';

describe('CarrosRegistradosComponent', () => {
  let component: CarrosRegistradosComponent;
  let fixture: ComponentFixture<CarrosRegistradosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrosRegistradosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarrosRegistradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
