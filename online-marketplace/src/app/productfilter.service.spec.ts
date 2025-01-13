import { TestBed } from '@angular/core/testing';

import { ProductfilterService } from './productfilter.service';

describe('ProductfilterService', () => {
  let service: ProductfilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductfilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
