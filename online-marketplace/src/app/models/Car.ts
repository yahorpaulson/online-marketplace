import { Vehicle } from "./Vehicle";

export class Car extends Vehicle {
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
    image:string [],
    isSold:boolean,
    sellerId:number,
    location:string,
    private _doors: number,
    private _seats: number,
    private _vehicleType: 'Cabrio' | 'Klein/Kompaktwagen' | 'Kleinbus' | 'Kombi/Family Van' | 'Limousine' | 'Sportwagen' | 'SUV',
    private _condition: 'Gebrauchtwagen' | 'Jahreswagen' | 'Neuwagen' | 'Unfallwagen',
    private _warranty: boolean,
    private _transmission: string,
    private _drive: string,
    private _color: string,
    private _batteryCapacity?: number,
    private _range?: number
  ) {
    super(id,name, mark, model, price, mileage, firstRegistration, fuelType, power, description, image,isSold, sellerId, location,'Car');
  }

  getVehicleType(): string {
    return `Car (${this._vehicleType})`;
  }

  // Getters and setters
  get doors(): number {
    return this._doors;
  }
  set doors(value: number) {
    this._doors = value;
  }

  get seats(): number {
    return this._seats;
  }
  set seats(value: number) {
    this._seats = value;
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
