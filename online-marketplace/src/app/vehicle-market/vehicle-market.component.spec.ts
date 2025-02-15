import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleMarketComponent } from './vehicle-market.component';

describe('VehicleMarketComponent', () => {
  let component: VehicleMarketComponent;
  let fixture: ComponentFixture<VehicleMarketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleMarketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
