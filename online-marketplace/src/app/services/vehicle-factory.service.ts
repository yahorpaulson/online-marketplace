import { Injectable } from '@angular/core';
import { Car } from '../models/Car';
import { Truck } from '../models/Truck';
import { Motorcycle } from '../models/Motorcycle';
import { Caravan } from '../models/Caravan';
import { Vehicle } from '../models/Vehicle';
import { VehicleData } from '../models/VehicleData';

@Injectable({
  providedIn: 'root',
})
export class VehicleFactoryService {
  createVehicleInstance(data: VehicleData): Vehicle {
    // Normalisiere die image-Eigenschaft
    const normalizedImage = Array.isArray(data.image) ? data.image : [data.image];

    switch (data.category) {
      case 'Car':
        return new Car(
          data.id,
          data.name,
          data.mark,
          data.model,
          data.price,
          data.mileage,
          new Date(data.firstRegistration),
          data.fuelType,
          data.power,
          data.description,
          normalizedImage, // Nutze das normalisierte image
          data.isSold,
          data.sellerId,
          data.location,
          data.doors ?? 0,
          data.seats ?? 0,
          data.vehicleType as
            | 'Cabrio'
            | 'Klein/Kompaktwagen'
            | 'Kleinbus'
            | 'Kombi/Family Van'
            | 'Limousine'
            | 'Sportwagen'
            | 'SUV',
          data.condition as
            | 'Gebrauchtwagen'
            | 'Jahreswagen'
            | 'Neuwagen'
            | 'Unfallwagen',
          data.warranty ?? false,
          data.transmission ?? '',
          data.drive ?? '',
          data.color,
          data.batteryCapacity,
          data.range
        );
      case 'Truck':
        return new Truck(
          data.id,
          data.name,
          data.mark,
          data.model,
          data.price,
          data.mileage,
          new Date(data.firstRegistration),
          data.fuelType,
          data.power,
          data.description,
          normalizedImage, // Nutze das normalisierte image
          data.isSold,
          data.sellerId,
          data.location,
          data.vehicleType as
            | 'Abschleppwagen'
            | 'Agrarfahrzeug'
            | 'Anhänger'
            | 'Auflieger'
            | 'Bus'
            | 'LKW über 3,5t'
            | 'Pickup'
            | 'Transporter',
          data.condition as
            | 'Gebrauchtwagen'
            | 'Jahreswagen'
            | 'Neuwagen'
            | 'Unfallwagen',
          data.warranty ?? false,
          data.transmission ?? '',
          data.drive ?? '',
          data.color
        );
      case 'Motorcycle':
        return new Motorcycle(
          data.id,
          data.name,
          data.mark,
          data.model,
          data.price,
          data.mileage,
          new Date(data.firstRegistration),
          data.fuelType,
          data.power,
          data.description,
          normalizedImage, // Nutze das normalisierte image
          data.isSold,
          data.sellerId,
          data.location,
          data.engineCapacity ?? 0,
          data.cylinders ?? 0,
          data.vehicleType as
            | 'Cafe Racer'
            | 'Enduro'
            | 'JetSki'
            | 'Moped'
            | 'Naked Bike'
            | 'Roller',
          data.condition as
            | 'Gebrauchtwagen'
            | 'Jahreswagen'
            | 'Neuwagen'
            | 'Unfallwagen'
        );
      case 'Caravan':
        return new Caravan(
          data.id,
          data.name,
          data.mark,
          data.model,
          data.price,
          data.mileage,
          new Date(data.firstRegistration),
          data.fuelType,
          data.power,
          data.description,
          normalizedImage, // Nutze das normalisierte image
          data.isSold,
          data.sellerId,
          data.location,
          data.vehicleType as
            | 'Alkoven'
            | 'Kastenwagen'
            | 'Teilintegriertes Wohnmobil'
            | 'Wohnkabine'
            | 'Wohnwagen',
          data.condition as
            | 'Gebrauchtwagen'
            | 'Jahreswagen'
            | 'Neuwagen'
            | 'Unfallwagen',
          data.warranty ?? false,
          data.color
        );
      default:
        throw new Error(`Unknown vehicle category: ${data.category}`);
    }
  }
}
