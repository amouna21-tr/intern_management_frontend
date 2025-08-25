// src/app/services/chatbot.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatbotResponse {
  reply: string;
  timestamp?: string;
  processed?: boolean;
}

export interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {

  private apiUrl = 'http://localhost:3000/api/chatbot'; // backend URL

  constructor(private http: HttpClient) { }

  sendMessage(message: string): Observable<ChatbotResponse> {
    return this.http.post<ChatbotResponse>(this.apiUrl, { message });
  }
    getChatbotHelp(): Observable<{ message: string }> {
    return this.http.get<{ message: string }>('http://localhost:3000/api/chatbot/help');
  }

}