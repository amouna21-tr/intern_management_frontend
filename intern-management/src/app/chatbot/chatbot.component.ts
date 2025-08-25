// src/app/chatbot/chatbot.component.ts
import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { ChatbotService, ChatbotResponse } from '../services/chatbot.service';

interface Message {
  text: string;
  isUser: boolean;
  timestamp?: Date;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('chatMessages') chatMessages!: ElementRef;

  isOpen = false;
  showWelcome = true;
  isTyping = false;
  userMessage = '';
  messages: Message[] = [];

  constructor(private chatbotService: ChatbotService) {}

  // Scroll automatically
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  sendMessage(): void {
    const msg = this.userMessage.trim();
    if (!msg) return;

    // Add user message
    this.addMessage(msg, true);
    this.userMessage = '';
    this.showWelcome = false;

    // Show typing
    this.isTyping = true;

    // Send to backend
    this.chatbotService.sendMessage(msg).subscribe({
      next: (res: ChatbotResponse) => {
        this.isTyping = false;
        this.addMessage(res.reply || "Erreur: pas de réponse du serveur", false);
      },
      error: (err) => {
        this.isTyping = false;
        this.addMessage("⚠️ Erreur de connexion au serveur.", false);
        console.error(err);
      }
    });
  }

  addMessage(text: string, isUser: boolean): void {
    this.messages.push({ text, isUser, timestamp: new Date() });
    setTimeout(() => this.scrollToBottom(), 0);
  }

  scrollToBottom(): void {
    try {
      if (this.chatMessages) {
        const container = this.chatMessages.nativeElement;
        container.scrollTop = container.scrollHeight;
      }
    } catch (err) {
      console.error('Erreur scroll:', err);
    }
  }

  showHelp(): void {
    // Optional: implement help logic with backend if needed
    this.addMessage(
      "Je peux vous aider avec : ajouter/rechercher/modifier/supprimer un stagiaire, générer des attestations, etc.",
      false
    );
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
