import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResenasHechasComponent } from './resenas-hechas.component';

describe('ResenasHechasComponent', () => {
  let component: ResenasHechasComponent;
  let fixture: ComponentFixture<ResenasHechasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResenasHechasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResenasHechasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
