import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'
import { VehicleService } from '../services/vehicle.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.css'],
  imports: [CommonModule,ReactiveFormsModule]
})
export class AddVehicleComponent implements OnInit {
  vehicleForm: FormGroup;
  categories = ['Car', 'Truck', 'Motorcycle', 'Caravan']; // Fahrzeugkategorien
  brands: any[] = []; // Gefilterte Marken
  models: any[] = []; // Gefilterte Modelle
  allBrands: any[] = []; // Alle Marken
  allModels: any[] = []; // Alle Modelle
  firstRegistrationYears: number[] = [];
  fuelTypes: string[] = ['Diesel', 'Benzin', 'Gas']; // Treibstoffarten
  powerOptions: number[] = [];

  constructor(private fb: FormBuilder, private vehicleService: VehicleService) {
    this.vehicleForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required], // Neue Kategorieauswahl
      brand: ['', Validators.required],
      model: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      mileage: [0, [Validators.required, Validators.min(0)]],
      firstRegistration: ['', Validators.required],
      fuelType: ['', Validators.required],
      power: [0, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
      image: [''],
      isSold: [false],
      sellerId: [0, Validators.required],
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

  ngOnInit() {
    this.loadBrands();
    this.loadFirstRegistrationYears();
    this.generatePowerOptions();
  }

  generatePowerOptions() {
    for (let i = 50; i <= 150; i += 10) {
      this.powerOptions.push(i);
    }
  }

  loadBrands() {
    this.vehicleService.getBrands().subscribe({
      next: (data) => {
        console.log('✅ Alle Marken geladen:', data);
        this.allBrands = data;
      },
      error: (err) => console.error('❌ Fehler beim Laden der Marken:', err),
    });
  }

 
loadModels(brandId: number) {
  if (!brandId) {
    this.models = []; 
    return;
  }

  this.vehicleService.getModels(brandId).subscribe({
    next: (data) => {
      console.log(`Modelle für Marke ${brandId} geladen:`, data);
      this.models = data;
    },
    error: (err) => console.error('Fehler beim Laden der Modelle:', err),
  });
}

loadFirstRegistrationYears() {
  this.vehicleService.getFirstRegistrationYears().subscribe({
    next: (data) => this.firstRegistrationYears = data,
    error: (err) => console.error('Error loading first registration years:', err)
  });
}


  
  onCategoryChange() {
    const selectedCategory = this.vehicleForm.get('category')?.value;
    this.brands = this.allBrands.filter((brand) => brand.category === selectedCategory);
    this.models = []; // Modelle zurücksetzen
    this.vehicleForm.get('brand')?.setValue('');
    this.vehicleForm.get('model')?.setValue('');
  }

  
  onBrandChange() {
    const selectedBrandId = this.vehicleForm.get('brand')?.value;
    console.log('Gewählte Marke ID:', selectedBrandId);
  
    this.loadModels(selectedBrandId); 
  }
  

  onSubmit() {
    if (this.vehicleForm.valid) {
      let formData = this.vehicleForm.value;
  
      // Finde die ausgewählte Marke
      const selectedBrand = this.allBrands.find(b => b.id === Number(formData.brand));
      const selectedModel = this.models.find(m => m.id === Number(formData.model));
  
      if (!selectedBrand || !selectedModel) {
        alert("Ungültige Marke oder Modell ausgewählt.");
        return;
      }
  
      // Erstelle ein neues Objekt für die API-Anfrage
      const vehicleData = {
        ...formData,
        brandId: selectedBrand.id,   
        brand: selectedBrand.name,   
        modelId: selectedModel.id,   
        model: selectedModel.name,   
        firstRegistration: parseInt(formData.firstRegistration, 10), 
        power: parseInt(formData.power, 10) 
      };
  
      console.log('Sende Fahrzeugdaten:', vehicleData);
  
      this.vehicleService.addVehicle(vehicleData).subscribe({
        next: (response) => {
          console.log('Fahrzeug hinzugefügt:', response);
          alert('Fahrzeug erfolgreich hinzugefügt!');
          this.vehicleForm.reset();
        },
        error: (err) => {
          console.error('Fehler beim Hinzufügen:', err);
          alert(`Fehler beim Hinzufügen: ${err.message}`);
        },
      });
    } else {
      alert('Bitte füllen Sie alle erforderlichen Felder aus.');
    }
  }
  
}
