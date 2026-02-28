import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { CreateCarDto } from '../dtos/create-car.dto';
import { PublishCarDto } from '../dtos/publish-car.dto';
import { EditCarPublishDto } from '../dtos/edit-car-publish.dto';

@Injectable({ providedIn: 'root' })
export class CarsService {

  private apiUrl = `${environment.apiUrl}/car`;
  private carsSubject = new BehaviorSubject<Car[]>([]);
  cars$ = this.carsSubject.asObservable();

  constructor(private http: HttpClient) { }

  // ==============================
  // RETRIEVE DATA
  // ==============================
  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.apiUrl).pipe(
      tap(cars => this.carsSubject.next(cars))
    );
  }

  countDataCars(): Observable<CountData> {
    return this.cars$.pipe(
      map(cars => {
        let totalPrice = 0;
        let totalMeli = 0;
        let totalFb = 0;
        let totalWeb = 0;

        for (const car of cars) {
          if (car.status !== 'vendido') {
            totalPrice += car.price;

            if (car.publishStatus?.some(p => p.platform === 'ML' && p.status === 'enabled')) totalMeli++;
            if (car.publishStatus?.some(p => p.platform === 'FB' && p.status === 'enabled')) totalFb++;
            if (car.publishStatus?.some(p => p.platform === 'WEB' && p.status === 'enabled')) totalWeb++;
          }
        }

        return {
          totalPrice,
          totalMeli,
          totalFb,
          totalWeb,
          totalCars: cars.length
        };
      })
    );
  }

  // ==============================
  // ADD
  // ==============================
  addCar(dto: CreateCarDto): Observable<Car> {

    const body: CreateCarDto = {
      ...dto,
      patent: dto.patent.toUpperCase()
    };

    return this.http.post<Car>(this.apiUrl, body).pipe(
      tap(createdCar => {
        const current = this.carsSubject.value;
        this.carsSubject.next([...current, createdCar]);
      })
    );
  }


  publishOn(carId: number, platform: string, status: 'enabled' | 'disabled'): Observable<Car> {

    const body: PublishCarDto = {
      carId,
      platform,
      status
    };

    return this.http.patch<Car>(`${this.apiUrl}/publish`, body).pipe(
      tap(updatedCar => {
        const updated = this.carsSubject.value.map(car =>
          car.id === updatedCar.id ? updatedCar : car
        );
        this.carsSubject.next(updated);
      })
    );
  }

  // ==============================
  // DELETE
  // ==============================
  deleteCar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        const updated = this.carsSubject.value.filter(car => car.id !== id);
        this.carsSubject.next(updated);
      })
    );
  }

  // ==============================
  // EDIT's
  // ==============================

  updateCar(updatedCar: Car): Observable<Car> {
    return this.http.put<Car>(
      `${this.apiUrl}/${updatedCar.id}`,
      updatedCar
    ).pipe(
      tap(carFromBackend => {
        const updated = this.carsSubject.value.map(car =>
          car.id === carFromBackend.id ? carFromBackend : car
        );
        this.carsSubject.next(updated);
      })
    );
  }

  editCarStatus(id: number, newStatus: 'Vendido' | 'Reservado' | 'Disponible'): Observable<Car> {
    return this.http.put<Car>(
      `${this.apiUrl}/status/${id}/${newStatus}`,
      {}
    ).pipe(
      tap(updatedCar => {
        const updated = this.carsSubject.value.map(car =>
          car.id === updatedCar.id ? updatedCar : car
        );
        this.carsSubject.next(updated);
      })
    );
  }

  editCarPublish(
    carId: number,
    platform: string,
    status: 'enabled' | 'disabled'
  ): Observable<Car> {

    const body: EditCarPublishDto = {
      platform,
      status
    };

    return this.http.put<Car>(
      `${this.apiUrl}/publication/${carId}`,
      body
    ).pipe(
      tap(updatedCar => {
        const updated = this.carsSubject.value.map(car =>
          car.id === updatedCar.id ? updatedCar : car
        );
        this.carsSubject.next(updated);
      })
    );
  }
}
