import { TestBed } from '@angular/core/testing';

import { RaitingService } from './raiting.service';

describe('RaitingService', () => {
  let service: RaitingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RaitingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
