import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AplicarPromocionComponent } from './aplicar-promocion.component';

describe('AplicarPromocionComponent', () => {
  let component: AplicarPromocionComponent;
  let fixture: ComponentFixture<AplicarPromocionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AplicarPromocionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AplicarPromocionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
