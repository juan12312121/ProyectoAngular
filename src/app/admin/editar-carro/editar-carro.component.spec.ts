import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCarroComponent } from './editar-carro.component';

describe('EditarCarroComponent', () => {
  let component: EditarCarroComponent;
  let fixture: ComponentFixture<EditarCarroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarCarroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarCarroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
