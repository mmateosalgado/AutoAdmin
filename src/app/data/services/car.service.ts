import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import cars from "C:/Users/Usuario/AutoAdmin/src/app/temp-data/autos.json";

@Injectable({ providedIn: 'root' })
export class CarsService {
  private cars = [...cars];
  private carsSubject = new BehaviorSubject<any[]>(this.cars);
  cars$ = this.carsSubject.asObservable();

  getCars() {
    return this.cars$;
  }

  addCar(newCar: any) {
    this.cars.push(newCar);
    this.carsSubject.next([...this.cars]); // emitir nueva referencia
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
