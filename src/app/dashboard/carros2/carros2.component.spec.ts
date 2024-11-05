import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Carros2Component } from './carros2.component';

describe('Carros2Component', () => {
  let component: Carros2Component;
  let fixture: ComponentFixture<Carros2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Carros2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Carros2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
