import { Vehicle } from './Vehicle';

export class Caravan extends Vehicle {
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
    private _vehicleType: 'Alkoven' | 'Kastenwagen' | 'Teilintegriertes Wohnmobil' | 'Wohnkabine' | 'Wohnwagen',
    private _condition: 'Gebrauchtwagen' | 'Jahreswagen' | 'Neuwagen' | 'Unfallwagen',
    private _warranty: boolean,
    private _color: string
  ) {
    super(id, name,mark, model, price, mileage, firstRegistration, fuelType, power, description, image);
  }

  getVehicleType(): string {
    return `Caravan (${this._vehicleType})`;
  }

  get vehicleType(): string {
    return this._vehicleType;
  }
  set vehicleType(value: string) {
    this._vehicleType = value as any;
  }

  get condition(): string {
    return this._condition;
  }
  set condition(value: string) {
    this._condition = value as any;
  }

  get warranty(): boolean {
    return this._warranty;
  }
  set warranty(value: boolean) {
    this._warranty = value;
  }

  get color(): string {
    return this._color;
  }
  set color(value: string) {
    this._color = value;
  }
}
