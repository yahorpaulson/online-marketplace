import { TestBed } from '@angular/core/testing';

import { VehicleFactoryService } from './vehicle-factory.service';

describe('VehicleFactoryService', () => {
  let service: VehicleFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VehicleFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
