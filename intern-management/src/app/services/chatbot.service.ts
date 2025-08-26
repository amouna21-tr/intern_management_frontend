// src/app/services/chatbot.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatbotResponse {
  reply: string;
  timestamp?: string;
  processed?: boolean;
  error?: string;
  stagiaire?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'http://localhost:3000/api/chatbot';
  private sessionId: string;

  constructor(private http: HttpClient) {
    this.sessionId = 'angular-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  sendMessage(message: string): Observable<ChatbotResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const body = {
      message: message,
      sessionId: this.sessionId
    };

    return this.http.post<ChatbotResponse>(this.apiUrl, body, { headers });
  }
}