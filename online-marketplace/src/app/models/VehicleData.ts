export interface VehicleData {
    id: number;
    name: string;
    mark: string;
    model: string;
    price: number;
    mileage: number;
    firstRegistration: string;
    fuelType: string;
    power: number;
    description: string;
    image: string[];
    isSold: boolean;
    sellerId: number;
    location: string;
    category: 'Car' | 'Truck' | 'Motorcycle' | 'Caravan';
    doors?: number; // Nur für Autos
    seats?: number; // Nur für Autos
    vehicleType?: string; // Fahrzeugtyp für alle
    condition?: string; // Zustand für alle
    warranty?: boolean; // Nur für Autos
    transmission?: string; // Nur für Autos
    drive?: string; // Antrieb für Autos/Trucks
    batteryCapacity?: number; // Optional für Elektrofahrzeuge
    range?: number; // Optional für Elektrofahrzeuge
    payloadCapacity?: number; // Nur für Trucks
    axles?: number; // Nur für Trucks
    engineCapacity?: number; // Nur für Motorräder
    cylinders?: number; // Nur für Motorräder
    color:string
  }
  