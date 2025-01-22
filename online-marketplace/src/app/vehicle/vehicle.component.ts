import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Import der Modellklassen
import { Car } from '../models/Car';
import { Truck } from '../models/Truck';
import { Motorcycle } from '../models/Motorcycle';
import { Caravan } from '../models/Caravan';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent {
  searchTerm: string = ''; // Variable für Two-Way-Datenbindung

  // Fahrzeuge als Objekte der Modellklassen
  cars: Car[] = [
    new Car(1, 'BMW', 'X5', 60000, 20000, new Date(2019, 5, 10), 'Diesel', 300, 'Luxury SUV', '/assets/bmw-x5.jpg', 4, 5, 'SUV', 'Gebrauchtwagen', true, 'Automatik', 'Allrad', 'Schwarz'),
    new Car(2, 'Mercedes', 'C-Class', 45000, 15000, new Date(2020, 3, 15), 'Benzin', 200, 'Elegant Sedan', '/assets/mercedes-c-class.jpg', 4, 5, 'Limousine', 'Gebrauchtwagen', true, 'Automatik', 'Heckantrieb', 'Weiß'),
    new Car(3, 'Tesla', 'Model S', 80000, 10000, new Date(2021, 1, 20), 'Elektro', 500, 'Electric Performance Car', '/assets/tesla-model-s.jpg', 4, 5, 'Limousine', 'Neuwagen', true, 'Automatik', 'Allrad', 'Rot', 100, 600)
  ];

  trucks: Truck[] = [
    new Truck(1, 'Volvo', 'FH16', 120000, 50000, new Date(2018, 8, 5), 'Diesel', 750, 'Heavy Duty Truck', '/assets/volvo-fh16.jpg', 'LKW über 3,5t', 'Gebrauchtwagen', true, 'Manuell', 'Allrad', 'Blau'),
    new Truck(2, 'MAN', 'TGX', 110000, 40000, new Date(2019, 10, 12), 'Diesel', 640, 'Efficient Truck', '/assets/man-tgx.jpg', 'Transporter', 'Jahreswagen', true, 'Manuell', 'Heckantrieb', 'Silber')
  ];
  
  motorcycles: Motorcycle[] = [
    new Motorcycle(1, 'Ducati', 'Panigale V4', 25000, 5000, new Date(2021, 2, 8), 'Benzin', 214, 'Sport Motorcycle', '/assets/ducati-panigale.jpg', 1103, 4, 'Cafe Racer'),
    new Motorcycle(2, 'Yamaha', 'MT-09', 10000, 10000, new Date(2020, 6, 15), 'Benzin', 117, 'Naked Bike', '/assets/yamaha-mt09.jpg', 847, 3, 'Naked Bike')
  ];
  

  caravans: Caravan[] = [
    new Caravan(1, 'Hymer', 'B-Class', 90000, 30000, new Date(2017, 4, 22), 'Diesel', 200, 'Luxury Motorhome', '/assets/hymer-b-class.jpg', 'Teilintegriertes Wohnmobil', 'Gebrauchtwagen', true, 'Weiß'),
    new Caravan(2, 'Adria', 'Twin Plus', 75000, 25000, new Date(2018, 9, 18), 'Diesel', 150, 'Compact Campervan', '/assets/adria-twin-plus.jpg', 'Kastenwagen', 'Gebrauchtwagen', true, 'Grau')
  ];

  // Filtered Arrays
  filteredCars = [...this.cars];
  filteredTrucks = [...this.trucks];
  filteredMotorcycles = [...this.motorcycles];
  filteredCaravans = [...this.caravans];

  filterVehicles() {
    this.filteredCars = this.cars.filter(vehicle =>
      vehicle.brand.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this.filteredTrucks = this.trucks.filter(vehicle =>
      vehicle.brand.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this.filteredMotorcycles = this.motorcycles.filter(vehicle =>
      vehicle.brand.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    this.filteredCaravans = this.caravans.filter(vehicle =>
      vehicle.brand.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
