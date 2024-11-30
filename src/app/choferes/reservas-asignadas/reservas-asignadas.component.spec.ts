import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservasAsignadasComponent } from './reservas-asignadas.component';

describe('ReservasAsignadasComponent', () => {
  let component: ReservasAsignadasComponent;
  let fixture: ComponentFixture<ReservasAsignadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasAsignadasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservasAsignadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
