import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import cars from "C:/Users/Usuario/AutoAdmin/src/app/temp-data/autos.json";

@Injectable({ providedIn: 'root' })
export class CarsService {
  private cars: Car[] = [];
  private carsSubject = new BehaviorSubject<any[]>([]);
  cars$ = this.carsSubject.asObservable();

  constructor() {
    // cargar datos iniciales del json
    const stored = localStorage.getItem('cars');
    if (stored) {
      this.cars = JSON.parse(stored);
    } else {
      this.cars = [...cars]; // autos.json inicial
      localStorage.setItem('cars', JSON.stringify(this.cars));
    }
    this.carsSubject.next(this.cars);
  }

  getCars() {
    return this.cars$;
  }

  addCar(newCar: any) {
    this.cars.push(newCar);
    localStorage.setItem('cars', JSON.stringify(this.cars)); // guardar persistencia fake
    this.carsSubject.next([...this.cars]);
  }

  deleteCar(patent: number) {
    this.cars = this.cars.filter(car => car.patent !== patent);
    localStorage.setItem('cars', JSON.stringify(this.cars)); // guardar persistencia fake
    this.carsSubject.next([...this.cars]);
  }

  countDataCars(): CountData {
    let totalPrice = 0;
    let totalMeli = 0;
    let totalFb = 0;

    for (const car of this.cars) {
      totalPrice += car.price;

      if (car.publishStatus?.some(p => p.platform === 'ML' && p.status === 'enabled')) {
        totalMeli++;
      }
      if (car.publishStatus?.some(p => p.platform === 'FB' && p.status === 'enabled')) {
        totalFb++;
      }
    }

    const totalCars = this.cars.length;

    return { totalPrice, totalMeli, totalFb, totalCars };
  }
}
