import { Vehicle } from './Vehicle';

export class Motorcycle extends Vehicle {
  constructor(
    id: number,
    name:string,
    mark: string,
    model: string,
    price: number,
    mileage: number,
    firstRegistration: Date,
    fuelType: string,
    power: number,
    description:string,
    image:string[],
    private _displacement: number,
    private _cylinders: number,
    private _vehicleType: 'Cafe Racer' | 'Enduro' | 'JetSki' | 'Moped' | 'Naked Bike' | 'Roller',
    private _batteryCapacity?: number,
    private _range?: number
  ) {
    super(id,name, mark, model, price, mileage, firstRegistration, fuelType, power, description, image);
  }

  getVehicleType(): string {
    return `Motorcycle (${this._vehicleType})`;
  }

  get displacement(): number {
    return this._displacement;
  }
  set displacement(value: number) {
    this._displacement = value;
  }

  get cylinders(): number {
    return this._cylinders;
  }
  set cylinders(value: number) {
    this._cylinders = value;
  }

  get vehicleType(): string {
    return this._vehicleType;
  }
  set vehicleType(value: string) {
    this._vehicleType = value as any;
  }

  get batteryCapacity(): number | undefined {
    return this._batteryCapacity;
  }
  set batteryCapacity(value: number | undefined) {
    this._batteryCapacity = value;
  }

  get range(): number | undefined {
    return this._range;
  }
  set range(value: number | undefined) {
    this._range = value;
  }
}
