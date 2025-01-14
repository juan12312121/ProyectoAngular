import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private baseUrl = 'https://backend-2-f5qo.onrender.com//api/gemini'; // URL del backend

  constructor(private http: HttpClient) {}

  generateResponse(inputMessage: string): Observable<any> {
    const url = `${this.baseUrl}/generate`;

    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const body = { inputMessage };

    return this.http.post(url, body, { headers });
  }
}
