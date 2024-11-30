import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarChoferComponent } from './sidebar-chofer.component';

describe('SidebarChoferComponent', () => {
  let component: SidebarChoferComponent;
  let fixture: ComponentFixture<SidebarChoferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarChoferComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarChoferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
