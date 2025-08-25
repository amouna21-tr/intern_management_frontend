import { Component, ElementRef, ViewChild } from '@angular/core';

interface Message { text: string; isUser: boolean; }

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  @ViewChild('chatMessages') chatMessages!: ElementRef;

  userMessage = '';
  messages: Message[] = [];
  showWelcome = true;
  isTyping = false;
  isOpen = false;  // Start closed

  botResponses = [
    "C'est intéressant ! Parlez-m'en plus.",
    "Je comprends ce que vous dites. Comment puis-je vous aider davantage ?",
    "Bonne question ! Laissez-moi réfléchir à cela un instant...",
    "Je suis là pour vous aider avec toutes vos questions.",
    "Merci de partager ces informations avec moi.",
    "J'apprécie votre contribution. Y a-t-il quelque chose de spécifique que vous aimeriez savoir ?",
    "C'est un bon point. Que souhaitez-vous faire ensuite ?",
    "J'apprends toujours de nos conversations. Quoi d'autre vous préoccupe ?"
  ];

  sendMessage() {
    const msg = this.userMessage.trim();
    if (!msg) return;

    this.addMessage(msg, true);
    this.userMessage = '';
    this.showWelcome = false;
    this.showTypingIndicator();

    setTimeout(() => {
      this.hideTypingIndicator();
      this.addMessage(this.getBotResponse(msg), false);
    }, 1500 + Math.random() * 1000);
  }

  addMessage(text: string, isUser: boolean) {
    this.messages.push({ text, isUser });
    setTimeout(() => this.scrollToBottom(), 0);
  }

  getBotResponse(msg: string): string {
    const m = msg.toLowerCase();
    if (m.includes('bonjour') || m.includes('salut') || m.includes('coucou')) return "Bonjour ! Comment allez-vous aujourd'hui ?";
    if (m.includes('aide') || m.includes('aider')) return "Je suis là pour vous aider ! De quoi avez-vous besoin ?";
    if (m.includes('merci')) return "Je vous en prie ! Y a-t-il autre chose que je puisse faire pour vous ?";
    if (m.includes('au revoir') || m.includes('bye')) return "Au revoir ! N'hésitez pas à revenir si vous avez d'autres questions.";
    return this.botResponses[Math.floor(Math.random() * this.botResponses.length)];
  }

  showTypingIndicator() { this.isTyping = true; this.scrollToBottom(); }
  hideTypingIndicator() { this.isTyping = false; }

  scrollToBottom() {
    if (this.chatMessages) {
      const native = this.chatMessages.nativeElement;
      native.scrollTop = native.scrollHeight;
    }
  }

  toggleChat() { this.isOpen = !this.isOpen; }
}
