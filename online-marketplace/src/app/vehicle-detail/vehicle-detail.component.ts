import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VehicleService } from '../services/vehicle.service';
import { Vehicle } from '../models/Vehicle';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessageService } from '../services/message.service';
import { Message } from '../models/message.model';
import { AuthserviceService } from '../authservice.service';

@Component({
  selector: 'app-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
  styleUrls: ['./vehicle-detail.component.css'],
  imports:[CommonModule]
})
export class VehicleDetailComponent implements OnInit {
  vehicle: Vehicle | null = null;
  loading: boolean = true;
  errorMessage: string | null = null;
  isChatOpen: boolean = true;
  chatMessages: Message[] = [];
  currentUser!: number;
  

  constructor(
    private route: ActivatedRoute,
    private vehicleService: VehicleService,
    private router:Router,
    private messageService: MessageService,
    public authService: AuthserviceService,
  ) {}

  ngOnInit(): void {
    this.loadVehicleDetail();
    
    this.currentUser = this.authService.getUserId()!;
    if (!this.currentUser) {
      console.error('User ID is not defined');
      return;
    }
  }

  private loadVehicleDetail(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.vehicleService.getVehicleById(+id).subscribe({
        next: (data) => {
          console.log("🔥 Vehicle received from service in VehicleDetailComponent:", data); // Debugging
          
          
          if (!data.sellerId) {
            console.error("sellerId is MISSING in received data:", data);
          }
  
          this.vehicle = data;
  
          console.log("Vehicle assigned in VehicleDetailComponent:", this.vehicle);
        },
        error: (err) => {
          console.error('Error loading vehicle details:', err);
        }
      });
    } else {
      console.error('Invalid vehicle ID.');
    }
  }
  
  
  closeChat(): void {
      this.isChatOpen = false;
      this.chatMessages = [];
    }
  
    sendMessage(input: HTMLInputElement): void {
      const trimmedValue = input.value.trim();
    
      if (!this.vehicle?.sellerId) {
        console.error('Seller ID is undefined:', this.vehicle);
        alert('Cannot send message: Vehicle owner information is missing.');
        return;
      }
    
      if (trimmedValue !== '') {
        const newMessage: Message = {
          vehicle_id: this.vehicle.id,  
          sender_id: this.currentUser,
          receiver_id: this.vehicle.sellerId,
          content: trimmedValue,
          message_type: 'vehicle'
        };
    
        this.messageService.sendMessage(newMessage).subscribe({
          next: (savedMessage) => {
            this.chatMessages.push(savedMessage);
            input.value = '';
            console.log("Vehicle message sent:", savedMessage);
          },
          error: (err) => {
            console.error('Failed to send vehicle message:', err);
            alert('Failed to send the message. Please try again later.');
          },
        });
      } else {
        console.warn('Message is empty');
      }
    }
    
    
    
    isProductOwner(): boolean {
      const ownerId = this.vehicle?.sellerId;
      return this.currentUser === ownerId;
    }
  goBack(): void {
    this.router.navigate(['/vehicleMarket/vehicles']); // Adjust the route as needed
  }
}
