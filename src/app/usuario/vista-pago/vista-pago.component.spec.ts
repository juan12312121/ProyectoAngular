import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaPagoComponent } from './vista-pago.component';

describe('VistaPagoComponent', () => {
  let component: VistaPagoComponent;
  let fixture: ComponentFixture<VistaPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VistaPagoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VistaPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
