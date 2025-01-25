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
    isSold:boolean,
    sellerId:string,
    location:string,
    private _engineCapacity: number,
    private _cylinders: number,
    private _vehicleType: 'Cafe Racer' | 'Enduro' | 'JetSki' | 'Moped' | 'Naked Bike' | 'Roller',
    private _condition: 'Gebrauchtwagen' | 'Jahreswagen' | 'Neuwagen' | 'Unfallwagen',
    private _batteryCapacity?: number,
    private _range?: number
  ) {
    super(id,name, mark, model, price, mileage, firstRegistration, fuelType, power, description, image,isSold, sellerId, location,'Motorcycle');
  }

  getVehicleType(): string {
    return `Motorcycle (${this._vehicleType})`;
  }

  get engineCapacity(): number {
    return this._engineCapacity;
  }
  set engineCapacity(value: number) {
    this._engineCapacity = value;
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
