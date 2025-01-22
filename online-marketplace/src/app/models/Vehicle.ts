export abstract class Vehicle {
  constructor(
    private _id: number,
    private _brand: string,
    private _model: string,
    private _price: number,
    private _mileage: number,
    private _firstRegistration: Date,
    private _fuelType: string,
    private _power: number,
    private _description:string,
    private _image:string

  ) {}

  // Abstract method
  abstract getVehicleType(): string;

  // Getters and setters
  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  get brand(): string {
    return this._brand;
  }
  set brand(value: string) {
    this._brand = value;
  }

  get model(): string {
    return this._model;
  }
  set model(value: string) {
    this._model = value;
  }

  get price(): number {
    return this._price;
  }
  set price(value: number) {
    this._price = value;
  }

  get mileage(): number {
    return this._mileage;
  }
  set mileage(value: number) {
    this._mileage = value;
  }

  get firstRegistration(): Date {
    return this._firstRegistration;
  }
  set firstRegistration(value: Date) {
    this._firstRegistration = value;
  }

  get fuelType(): string {
    return this._fuelType;
  }
  set fuelType(value: string) {
    this._fuelType = value;
  }

  get power(): number {
    return this._power;
  }
  set power(value: number) {
    this._power = value;
  }

  get description():string{
    return this._description
  }
  set description(value:string){
    this.description=value;
  }
  get image():string{
    return this._image;
  }
  set image(value:string){
    this._image= value;
  }
}
