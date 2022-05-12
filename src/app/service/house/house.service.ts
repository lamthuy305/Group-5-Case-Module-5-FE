import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {House} from '../../model/house';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class HouseService {

  constructor(private http: HttpClient) {
  }
  getAll(): Observable<House[]> {
    return this.http.get<House[]>(`${API_URL}/houses`);
  }

  getHouseById(id): Observable<House> {
    return this.http.get<House>(`${API_URL}/houses/${id}`);
  }

  createHouse(book) {
    return this.http.post(`${API_URL}/houses`, book);
  }

  editHouse(id, book) {
    return this.http.put<House>(`${API_URL}/houses/${id}`, book);
  }

  deleteHouse(id): Observable<House> {
    return this.http.delete<House>(`${API_URL}/houses/${id}`);
  }
}
