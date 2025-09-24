import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import cars from "C:/Users/Usuario/AutoAdmin/src/app/temp-data/autos.json";

@Injectable({ providedIn: 'root' })
export class CarsService {
  private cars: Car[] = [];
  private carsSubject = new BehaviorSubject<Car[]>([]);
  cars$ = this.carsSubject.asObservable();

  constructor() {
    const storedCars = localStorage.getItem('cars');
    if (storedCars) {
      this.cars = JSON.parse(storedCars);
    } else {
      this.cars = [...cars];
      localStorage.setItem('cars', JSON.stringify(this.cars));
    }

    this.carsSubject.next([...this.cars]);
  }

  getCars(): Observable<Car[]> {
    return this.cars$;
  }

  addCar(newCar: Car): boolean {
    const exists = this.cars.some(car => car.patent.toUpperCase() === newCar.patent);
    if (exists) return false;

    // Normalizamos patente a mayúsculas
    newCar.patent = newCar.patent.toUpperCase();

    this.cars.push(newCar);
    localStorage.setItem('cars', JSON.stringify(this.cars));
    this.carsSubject.next([...this.cars]);

    return true;
  }


  deleteCar(patent: string) {
    this.cars = this.cars.filter(car => car.patent !== patent);
    localStorage.setItem('cars', JSON.stringify(this.cars));
    this.carsSubject.next([...this.cars]); // 🔑 esto dispara la actualización en tiempo real
  }

  // 🔑 ahora retorna observable que se recalcula con cada cambio
  countDataCars(): Observable<CountData> {
    return this.cars$.pipe(
      map(cars => {
        let totalPrice = 0;
        let totalMeli = 0;
        let totalFb = 0;

        for (const car of cars) {
          totalPrice += car.price;

          if (car.publishStatus?.some(p => p.platform === 'ML' && p.status === 'enabled')) {
            totalMeli++;
          }
          if (car.publishStatus?.some(p => p.platform === 'FB' && p.status === 'enabled')) {
            totalFb++;
          }
        }

        const totalCars = cars.length;

        return { totalPrice, totalMeli, totalFb, totalCars };
      })
    );
  }
}
