import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../services/vehicle.service';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
})
export class AddVehicleComponent {
  vehicleForm: FormGroup;

  constructor(private fb: FormBuilder, private vehicleService: VehicleService) {
    this.vehicleForm = this.fb.group({
      name: ['', Validators.required],
      mark: ['', Validators.required],
      model: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      mileage: [0, [Validators.required, Validators.min(0)]],
      firstRegistration: ['', Validators.required],
      fuelType: ['', Validators.required],
      power: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      category: ['Car', Validators.required],
      image: [''],  //soll ein string sein
      isSold: [false],
      sellerId: [0],
      location: [''],
      doors: [4],
      seats: [5],
      vehicleType: [''],
      condition: [''],
      warranty: [false],
      transmission: [''],
      drive: [''],
      color: [''],
      batteryCapacity: [null],
      range: [null],
    });
  }

  onSubmit() {
    if (this.vehicleForm.valid) {
      let formData = this.vehicleForm.value;
  
      // Falls das Bild ein Array ist, wandle es in einen String um (falls nötig)
      if (Array.isArray(formData.image)) {
        formData.image = formData.image.length > 0 ? formData.image[0] : ''; // Nur das erste Bild speichern
      }
  
      console.log('📤 Sende Formulardaten:', formData); // Debugging
  
      this.vehicleService.addVehicle(formData).subscribe({
        next: (response) => {
          console.log('✅ Fahrzeug hinzugefügt:', response);
          alert('Fahrzeug erfolgreich hinzugefügt!');
          this.vehicleForm.reset();
        },
        error: (err) => {
          console.error('❌ Fehler beim Hinzufügen:', err);
          alert(`Fehler beim Hinzufügen: ${err.message}`);
        }
      });
    } else {
      alert('Bitte füllen Sie alle erforderlichen Felder aus.');
    }
  }
  
}
