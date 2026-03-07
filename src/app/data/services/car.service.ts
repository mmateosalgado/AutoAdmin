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
        let totalIg = 0;

        for (const car of cars) {
          if (car.status !== 'vendido') {
            totalPrice += car.price;

            if (car.publishStatus?.some(p => p.platform === 'ML' && p.status === 'enabled')) totalMeli++;
            if (car.publishStatus?.some(p => p.platform === 'FB' && p.status === 'enabled')) totalFb++;
            if (car.publishStatus?.some(p => p.platform === 'IG' && p.status === 'enabled')) totalIg++;
          }
        }

        return {
          totalPrice,
          totalMeli,
          totalFb,
          totalIg,
          totalCars: cars.length
        };
      })
    );
  }

  // ==============================
  // ADD
  // ==============================
  addCar(dto: CreateCarDto): Observable<any> {
    const body: CreateCarDto = {
      ...dto,
      patent: dto.patent.toUpperCase()
    };

    return this.http.post(this.apiUrl, body, { responseType: 'text' }).pipe(
      tap(() => {
        this.getCars().subscribe();
      })
    );
  }


  publishOn(carId: number, platform: string, status: 'enabled' | 'disabled'): Observable<any> {
    const body: PublishCarDto = {
      status,
      platform
    };

    return this.http.put(`${this.apiUrl}/publication/${carId}`, body, { responseType: 'text' }).pipe(
      tap(() => {
        this.getCars().subscribe();
      })
    );
  }

  // ==============================
  // DELETE
  // ==============================
  deleteCar(id: number): Observable<void> {

    var url = `${this.apiUrl}/${id}`;

    return this.http.delete<void>(url).pipe(
      tap(response => {
        const updated = [...this.carsSubject.value].filter(car => car.id !== id);
        this.carsSubject.next(updated);
      })
    );
  }

  // ==============================
  // EDIT's
  // ==============================

  updateCar(updatedCar: Car): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${updatedCar.id}`,
      updatedCar,
      { responseType: 'text' }
    ).pipe(
      tap(() => {
        this.getCars().subscribe();
      })
    );
  }

  editCarStatus(id: number, newStatus: 'vendido' | 'reservado' | 'disponible'): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/status/${id}/${newStatus}`,
      {},
      { responseType: 'text' }
    ).pipe(
      tap(() => {
        this.getCars().subscribe();
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
