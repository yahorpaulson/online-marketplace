import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VehicleFactoryService } from './vehicle-factory.service';
import { Vehicle } from '../models/Vehicle';
import { VehicleData } from '../models/VehicleData';
import { snakeToCamel } from './snakeToCamel';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private apiUrl = 'http://localhost:4000/api/vehicles'; // API-Endpunkt
  private apiUrl1 = 'http://localhost:4000/api'; // API-Endpunkt
  private brandsUrl = 'http://localhost:4000/api/brands'; // API-Endpunkt für Marken
  private modelsUrl = 'http://localhost:4000/api/models'; // API-Endpunkt für Modelle


  constructor(
    private http: HttpClient,
    private vehicleFactory: VehicleFactoryService
  ) {}

  /**
   * Get all vehicles from the API and map them to specific vehicle instances.
   * @returns Observable of Vehicle array
   */
  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<VehicleData[]>(this.apiUrl).pipe(
      map((vehicleDataArray) =>
        vehicleDataArray.map((data) => this.vehicleFactory.createVehicleInstance(data))
      )
    );
  }

  /**
   * Get a single vehicle by ID from the API.
   * @param id - The ID of the vehicle
   * @returns Observable of a specific Vehicle instance
   */
  getVehicleById(id: number): Observable<Vehicle> {
    return this.http.get<VehicleData>(`${this.apiUrl}/${id}`).pipe(
      map((data) => {
        console.log("🚗 API Response before mapping:", data);
  
        const mappedData = snakeToCamel(data); 
        console.log("Mapped Vehicle in getVehicleById:", mappedData);
  
        return this.vehicleFactory.createVehicleInstance(mappedData);
      })
    );
  }
  
  

  /**
   * Add a new vehicle to the system.
   * @param vehicleData - Data for the new vehicle
   * @returns Observable of the created vehicle
   */
  addVehicle(vehicleData: VehicleData): Observable<Vehicle> {
    console.log('Sende Fahrzeugdaten an Backend:', vehicleData); // Debugging
  
    return this.http.post<VehicleData>('http://localhost:4000/api/vehicles', vehicleData).pipe(
      map((data) => {
        console.log('Server Response:', data); // Antwort des Servers loggen
        return this.vehicleFactory.createVehicleInstance(data);
      })
    );
  }
  

  
  

  /**
   * Update an existing vehicle.
   * @param id - The ID of the vehicle to update
   * @param vehicleData - Updated data for the vehicle
   * @returns Observable of the updated vehicle
   */
  updateVehicle(id: number, vehicleData: VehicleData): Observable<Vehicle> {
    return this.http.put<VehicleData>(`${this.apiUrl}/${id}`, vehicleData).pipe(
      map((data) => this.vehicleFactory.createVehicleInstance(data))
    );
  }

  /**
   * Delete a vehicle by ID.
   * @param id - The ID of the vehicle to delete
   * @returns Observable of void
   */
  deleteVehicle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getBrands(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl1}/brands`);
  }

  getModels(brandId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl1}/models?brandId=${brandId}`);
  }

  getFirstRegistrationYears(): Observable<number[]> {
    return this.http.get<{ year: number }[]>('http://localhost:4000/api/first-registrations')
      .pipe(map(data => data.map(entry => entry.year))); // Nur die Jahre extrahieren
  }
  
}
