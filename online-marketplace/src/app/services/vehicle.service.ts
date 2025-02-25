import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { VehicleFactoryService } from './vehicle-factory.service';
import { Vehicle } from '../models/Vehicle';
import { VehicleData } from '../models/VehicleData';
import { camelToSnake, snakeToCamel } from '../utality/snakeToCamel';

@Injectable({
  providedIn: 'root',
})
export class VehicleService {
  private apiUrl = 'http://localhost:4000/api'; // API-Endpunkt

  constructor(
    private http: HttpClient,
    private vehicleFactory: VehicleFactoryService
  ) {}

  /**
   * Get all vehicles from the API and map them to specific vehicle instances.
   * @returns Observable of Vehicle array
   */
  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<VehicleData[]>(`${this.apiUrl}/vehicles`).pipe(
      map((vehicleDataArray) =>
        vehicleDataArray.map((data) => snakeToCamel(data)) 
      ),
      map((camelCaseVehicles) =>
        camelCaseVehicles.map((data) => this.vehicleFactory.createVehicleInstance(data)) 
      )
    );
  }
  

  getVehicleById(id: number): Observable<Vehicle> {
    return this.http.get<VehicleData>(`${this.apiUrl}/vehicles/${id}`).pipe(
      map((data) => {
        console.log("🚗 API Response before mapping:", data);
  
        const mappedData = snakeToCamel(data); 
        console.log("Mapped Vehicle in getVehicleById:", mappedData);
  
        return this.vehicleFactory.createVehicleInstance(mappedData);
      })
    );
  }
  
  addVehicle(vehicleData: VehicleData): Observable<VehicleData> {
    console.log('Sende Fahrzeugdaten an Backend (Camel Case):', vehicleData); 
    
    const snakeCaseData = camelToSnake(vehicleData); 
    console.log('Konvertierte Fahrzeugdaten (Snake Case):', snakeCaseData);

    return this.http.post<VehicleData>('http://localhost:4000/api/vehicles', snakeCaseData).pipe(
      map((data) => {
        console.log('Server Response:', data);
        return snakeToCamel(data); // Rückgabe als VehicleData, nicht als Vehicle
      })
    );
}

  

  updateVehicle(id: number, vehicleData: VehicleData): Observable<Vehicle> {
    return this.http.put<VehicleData>(`${this.apiUrl}/${id}`, vehicleData).pipe(
      map((data) => this.vehicleFactory.createVehicleInstance(data))
    );
  }

  deleteVehicle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


  getUserVehicles(userId: number): Observable<Vehicle[]> {
    return this.http.get<VehicleData[]>(`${this.apiUrl}/vehicles/user/${userId}`).pipe(
      map((vehicleDataArray) =>
        vehicleDataArray.map((data) => this.vehicleFactory.createVehicleInstance(snakeToCamel(data))) 
      )
    );
  }
  



  getBrands(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/brands`);
  }

  getModels(brandId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/models?brandId=${brandId}`);
  }

  
}
