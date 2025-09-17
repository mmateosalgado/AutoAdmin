import { Injectable } from '@angular/core';
import cars from "C:/Users/Usuario/AutoAdmin/src/app/temp-data/autos.json";

@Injectable({ providedIn: 'root' })
export class CarsService {
  private cars = [...cars]; // copia del JSON importado

  getCars() {
    return this.cars;
  }

  addCar(newCar: any) {
    this.cars.push(newCar);
  }
}
