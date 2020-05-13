import { TestBed } from '@angular/core/testing';

import { D3DataService } from './d3-data.service';

describe('D3DataService', () => {
  let service: D3DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(D3DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
