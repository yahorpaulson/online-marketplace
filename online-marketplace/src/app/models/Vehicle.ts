export abstract class Vehicle {
  constructor(
    private _id: number,
    private _name: string,
    private _brandId: number,  
    private _brand: string,   
    private _modelId: number,  
    private _model: string,    
    private _price: number,
    private _mileage: number,
    private _firstRegistration: number,
    private _fuelType: string,
    private _power: number,
    private _description: string,
    private _image: string[],
    private _isSold: boolean,
    private _sellerId: number,
    private _location: string,
    public category: 'Car' | 'Truck' | 'Motorcycle' | 'Caravan'
  ) {}

  // Abstract method
  abstract getVehicleType(): string;

  // ✅ Getters & Setters für brandId und modelId
  get brandId(): number {
    return this._brandId;
  }
  set brandId(value: number) {
    this._brandId = value;
  }

  get brand(): string {
    return this._brand;
  }
  set brand(value: string) {
    this._brand = value;
  }

  get modelId(): number {
    return this._modelId;
  }
  set modelId(value: number) {
    this._modelId = value;
  }

  get model(): string {
    return this._model;
  }
  set model(value: string) {
    this._model = value;
  }

  // Andere Getter und Setter bleiben unverändert
  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
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

  get firstRegistration(): number {
    return this._firstRegistration;
  }
  set firstRegistration(value: number) {
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

  get description(): string {
    return this._description;
  }
  set description(value: string) {
    this._description = value;
  }

  get image(): string[] {
    return this._image;
  }
  set image(value: string[]) {
    this._image = value;
  }

  get name(): string {
    return this._name;
  }
  set name(value: string) {
    this._name = value;
  }

  public get location(): string {
    return this._location;
  }
  public set location(value: string) {
    this._location = value;
  }

  public get sellerId(): number {
    return this._sellerId;
  }
  public set sellerId(value: number) {
    this._sellerId = value;
  }

  public get isSold(): boolean {
    return this._isSold;
  }
  public set isSold(value: boolean) {
    this._isSold = value;
  }
}
