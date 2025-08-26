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

  // 🔹 Quick reply options
  quickReplies: string[] = ["⚡ Services", "📞 Contact", "📧 Email"];

  // 🔹 Feedback system
  feedbackEnabled = false;
  feedbackMessageIndex: number | null = null;

  constructor(private chatbotService: ChatbotService) {}

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  sendMessage(): void {
    const msg = this.userMessage.trim();
    if (!msg) return;

    this.addMessage(msg, true);
    this.userMessage = '';
    this.showWelcome = false;

    this.isTyping = true;

    this.chatbotService.sendMessage(msg).subscribe({
      next: (res: ChatbotResponse) => {
        this.isTyping = false;
        this.handleBotReply(res.reply || "Erreur: pas de réponse du serveur");
      },
      error: (err) => {
        this.isTyping = false;
        this.handleBotReply("⚠️ Erreur de connexion au serveur.");
        console.error(err);
      }
    });
  }

  // 🔹 Quick reply handler
  sendQuickReply(option: string): void {
    this.addMessage(option, true);
    this.showWelcome = false;

    if (option.includes("Services")) {
      this.handleBotReply("Nos services incluent l’électricité, le gaz et l’assistance technique.");
    } else if (option.includes("Contact")) {
      this.handleBotReply("📞 Appelez 71 341 311 pour contacter STEG.");
    } else if (option.includes("Email")) {
      this.handleBotReply("Vous pouvez nous écrire à: dpsc@steg.com.tn📧");
    }
  }

  // 🔹 Handle bot reply and enable feedback
  private handleBotReply(reply: string): void {
    this.addMessage(reply, false);
    this.feedbackEnabled = true;
    this.feedbackMessageIndex = this.messages.length - 1;
  }

  // 🔹 Feedback handler
  sendFeedback(isPositive: boolean): void {
    if (this.feedbackMessageIndex === null) return;

    const lastBotMessage = this.messages[this.feedbackMessageIndex];
    const feedbackText = isPositive ? "👍 Merci pour votre retour !" : "👎 Merci pour votre retour !";

    this.addMessage(feedbackText, false);
    console.log("Feedback:", { message: lastBotMessage.text, positive: isPositive });

    this.feedbackEnabled = false;
    this.feedbackMessageIndex = null;
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
