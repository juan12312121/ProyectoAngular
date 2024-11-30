import { TestBed } from '@angular/core/testing';

import { ManteniService } from './manteni.service';

describe('ManteniService', () => {
  let service: ManteniService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManteniService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
