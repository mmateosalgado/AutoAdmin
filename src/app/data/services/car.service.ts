import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import cars from "../../temp-data/autos.json";

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

    newCar.publishStatus = [
      { platform: 'ML', status: 'disabled' },
      { platform: 'FB', status: 'disabled' },
      { platform: 'WEB', status: 'disabled' }
    ];

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
        let totalWeb = 0;

        for (const car of cars) {

          if (car.status !== "vendido") {
            totalPrice += car.price;

            if (car.publishStatus?.some(p => p.platform === 'ML' && p.status === 'enabled')) {
              totalMeli++;
            }
            if (car.publishStatus?.some(p => p.platform === 'FB' && p.status === 'enabled')) {
              totalFb++;
            }

            if (car.publishStatus?.some(p => p.platform === 'WEB' && p.status === 'enabled')) {
              totalWeb++;
            }
          }
        }

        const totalCars = cars.length;

        return { totalPrice, totalMeli, totalFb, totalWeb, totalCars };
      })
    );
  }

  publishOn(patent: string, platform: string) {
    const carIndex = this.cars.findIndex(car => car.patent === patent);
    if (carIndex !== -1) {
      const car = this.cars[carIndex];
      if (!car.publishStatus) {
        car.publishStatus = [];
      }
      const fbStatus = car.publishStatus.find(p => p.platform === platform);
      if (fbStatus) {
        fbStatus.status = 'enabled';
      } else {
        car.publishStatus.push({ platform: platform, status: 'enabled' });
      }
      this.cars[carIndex] = car;
      localStorage.setItem('cars', JSON.stringify(this.cars));
      this.carsSubject.next([...this.cars]);
    }
  }

  updateCar(updatedCar: Car): void {
    const index = this.cars.findIndex(c => c.patent === updatedCar.patent);
    console.log('Updating car:', updatedCar);
    console.log('Found index:', index);
    if (index !== -1) {
      this.cars[index] = { ...updatedCar };  // sobreescribimos con lo nuevo
      localStorage.setItem('cars', JSON.stringify(this.cars));
      this.carsSubject.next([...this.cars]); // notifica cambios a todos los subscriptores
    }
  }

  resetPublishStatus(patent: string): Car | null {
    const index = this.cars.findIndex(c => c.patent === patent);
    if (index !== -1) {
      this.cars[index].publishStatus = [
        { platform: 'ML', status: 'disabled' },
        { platform: 'FB', status: 'disabled' },
        { platform: 'WEB', status: 'disabled' }
      ];  
      localStorage.setItem('cars', JSON.stringify(this.cars));
      this.carsSubject.next([...this.cars]);
      return this.cars[index];
    }
    return null;
  }
}
