import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SanitizationService {

  constructor() { }
  sanitizeInput(input: string): string {
    if (!input) return ''; // Falls leer, einfach zurückgeben
    return input.replace(/['";`%<>]/g, ''); // Entfernt potenziell gefährliche Zeichen
  }
}
