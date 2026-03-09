import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ContactData {
  name: string;
  email: string;
  company?: string;
  budget: string;
  project: string;
  message: string;
}

export interface ChatMessage {
  sessionId?: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  // Contact API
  submitContact(contactData: ContactData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/contact`,
      contactData,
      { headers: this.getHeaders() },
    );
  }

  getAllContacts(
    status?: string,
    page: number = 1,
    limit: number = 10,
  ): Observable<ApiResponse<any>> {
    const params: any = { page, limit };
    if (status) params.status = status;

    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/contact`, {
      headers: this.getHeaders(),
      params,
    });
  }

  // Chatbot API
  sendChatMessage(chatData: ChatMessage): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.apiUrl}/chatbot/message`,
      chatData,
      { headers: this.getHeaders() },
    );
  }

  getChatHistory(sessionId: string): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/chatbot/history/${sessionId}`,
      { headers: this.getHeaders() },
    );
  }

  // Health check
  healthCheck(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/health`, {
      headers: this.getHeaders(),
    });
  }
}
