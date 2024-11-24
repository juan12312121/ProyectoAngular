import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnadirPromocionComponent } from './anadir-promocion.component';

describe('AnadirPromocionComponent', () => {
  let component: AnadirPromocionComponent;
  let fixture: ComponentFixture<AnadirPromocionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnadirPromocionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnadirPromocionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
