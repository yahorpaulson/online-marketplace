import { Vehicle } from './Vehicle';

export class Truck extends Vehicle {
  constructor(
    id: number,
    name: string,
    brandId: number,  
    brand: string,    
    modelId: number,  
    model: string,   
    price: number,
    mileage: number,
    firstRegistration: number,
    fuelType: string,
    power: number,
    description: string,
    image: string[],
    isSold: boolean,
    sellerId: number,
    location: string,
    private _vehicleType: 'Abschleppwagen' | 'Agrarfahrzeug' | 'Anhänger' | 'Auflieger' | 'Bus' | 'LKW über 3,5t' | 'Pickup' | 'Transporter',
    private _condition: 'Gebrauchtwagen' | 'Jahreswagen' | 'Neuwagen' | 'Unfallwagen',
    private _warranty: boolean,
    private _transmission: string,
    private _drive: string,
    private _color: string
  ) {
    super(id, name, brandId, brand, modelId, model, price, mileage, firstRegistration, fuelType, power, description, image, isSold, sellerId, location, 'Truck');
  }

  
  override getVehicleType(): string {
    return 'Truck';
  }

  get condition(): 'Gebrauchtwagen' | 'Jahreswagen' | 'Neuwagen' | 'Unfallwagen' {
    return this._condition;
  }
  set condition(value: 'Gebrauchtwagen' | 'Jahreswagen' | 'Neuwagen' | 'Unfallwagen') {
    this._condition = value;
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

  get vehicleType(): 'Abschleppwagen' | 'Agrarfahrzeug' | 'Anhänger' | 'Auflieger' | 'Bus' | 'LKW über 3,5t' | 'Pickup' | 'Transporter' {
    return this._vehicleType;
  }
  set vehicleType(value: 'Abschleppwagen' | 'Agrarfahrzeug' | 'Anhänger' | 'Auflieger' | 'Bus' | 'LKW über 3,5t' | 'Pickup' | 'Transporter') {
    this._vehicleType = value;
  }
}
