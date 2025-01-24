import { Vehicle } from './Vehicle';

export class Truck extends Vehicle {
  override getVehicleType(): string {
    throw new Error('Method not implemented.');
  }
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
    description: string,
    image: string[],
    isSold:boolean,
    sellerId:string,
    location:string,
    private _vehicleType: 'Abschleppwagen' | 'Agrarfahrzeug' | 'Anhänger' | 'Auflieger' | 'Bus' | 'LKW über 3,5t' | 'Pickup' | 'Transporter',
    private _condition: 'Gebrauchtwagen' | 'Jahreswagen' | 'Neuwagen' | 'Unfallwagen',
    private _warranty: boolean,
    private _transmission: string,
    private _drive: string,
    private _color: string
  ) {
    super(id, name,mark, model, price, mileage, firstRegistration, fuelType, power, description, image,isSold, sellerId, location);
  }

  get condition(): string {
    return this._condition;
  }
  set condition(value: string) {
    this._condition = value as any;
  }

  get transmission(): string {
    return this._transmission;
  }
  set transmission(value: string) {
    this._transmission = value;
  }

  get drive(): string {
    return this._drive;
  }
  set drive(value: string) {
    this._drive = value;
  }

  get color(): string {
    return this._color;
  }
  set color(value: string) {
    this._color = value;
  }
  get warranty(): boolean {
    return this._warranty;
  }
  set warranty(value: boolean) {
    this._warranty = value;
  }

  get vehicleType(): string {
    return this._vehicleType;
  }
  set vehicleType(value: string) {
    this._vehicleType = value as any;
  }
}
