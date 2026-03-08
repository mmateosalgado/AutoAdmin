import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environments';
import { CloudinaryUploadResponse } from '../interfaces/cloudinary/cloudinary-upload-responce.interface';
import { UploadProgress } from '../interfaces/cloudinary/upload-progress.interface';

@Injectable({ providedIn: 'root' })
export class CloudinaryService {

  private readonly cloudName = environment.cloudinary.cloudName;
  private readonly uploadPreset = environment.cloudinary.uploadPreset;
  private readonly baseUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}`;

  constructor(private http: HttpClient) {}

  uploadImage(file: File, folder?: string): Observable<UploadProgress> {
    return this.upload(file, 'image', folder);
  }

  uploadVideo(file: File, folder?: string): Observable<UploadProgress> {
    return this.upload(file, 'video', folder);
  }

  private upload(file: File, resourceType: 'image' | 'video', folder?: string): Observable<UploadProgress> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);
    if (folder) formData.append('folder', folder);

    return this.http.post<CloudinaryUploadResponse>(
      `${this.baseUrl}/${resourceType}/upload`,
      formData,
      { reportProgress: true, observe: 'events' }
    ).pipe(
      map(event => {
        if (event.type === HttpEventType.UploadProgress) {
          const progress = event.total ? Math.round((100 * event.loaded) / event.total) : 0;
          return { progress };
        }
        if (event.type === HttpEventType.Response) {
          return { progress: 100, response: event.body as CloudinaryUploadResponse };
        }
        return { progress: 0 };
      }),
      catchError(err => {
        const message = err?.error?.error?.message || 'Error al subir el archivo';
        return throwError(() => new Error(message));
      })
    );
  }
}