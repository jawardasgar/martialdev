import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private messages$ = new BehaviorSubject<ChatMessage[]>([
    {
      id: '1',
      text: "👋 Hey there! I'm the MartialDev assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);

  private botResponses = {
    greeting: [
      'Hey! Great to have you here. What can I help you with today? 😊',
      'Hello! Welcome to MartialDev. How can I assist you?',
    ],
    services: [
      "We specialize in:\n\n💻 **Full Stack Web Development**\n📱 **Mobile Apps** (iOS & Android)\n🤖 **Custom AI Solutions**\n\nWhether you need a simple company website, an e-commerce platform, or a complex internal system — we've got you covered!\n\nWould you like to know about pricing?",
    ],
    pricing: [
      'Every project is unique, but we keep our pricing transparent:\n\n🌐 **Portfolio Sites:** From LKR 45,000+\n🛒 **E-commerce Platforms:** From LKR 230,000+\n📱 **App Solutions:** Custom pricing based on scale\n\nDrop us a message with your requirements, and we can give you a **free estimate**!\n\n💬 Would you prefer to chat on WhatsApp? Click the green button below!',
    ],
    whatsapp: [
      'Great choice! 📱\n\nClick here to chat with us on WhatsApp:\n👉 Open WhatsApp Chat\n\nWe typically reply within a few minutes during business hours!',
    ],
    timeline: [
      "It depends on the scope! Here's a rough idea:\n\n⚡ **Landing Pages:** 3–5 days\n🛒 **E-commerce Sites:** 2–4 weeks\n🔧 **Custom Software/MVPs:** 4–8 weeks\n\nThe time duration typically ranges between 2–3 weeks depending on scale. We always prioritise early delivery and continuous client feedback!\n\nWe work in sprints, so we'll show you updates every week.",
    ],
    support: [
      "Absolutely! We provide post-launch support and maintenance for all our clients 🤝\n\n✅ **1-month FREE support** after launch to fix any bugs\n✅ **Annual Maintenance Plan (AMC)** available for ongoing updates, backups, and security\n\nYou're in safe hands with us!",
    ],
    about: [
      "MartialDev is a digital studio based in Colombo, focused on building products designed to grow 🚀\n\nThe name 'Martial' reflects our approach: **disciplined, intentional, and precise.**\n\nWe don't rush builds or chase trends. Every product is shaped with long-term performance in mind.\n\nWant to know more about our process or pricing?",
    ],
    default: [
      "That's a great question! For detailed information, I'd recommend chatting with us on WhatsApp — it's much easier to discuss there.\n\n💬 Would you like me to redirect you to WhatsApp?",
    ],
  };

  constructor() {}

  getMessages(): Observable<ChatMessage[]> {
    return this.messages$.asObservable();
  }

  sendMessage(text: string): void {
    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    const currentMessages = this.messages$.value;
    this.messages$.next([...currentMessages, userMessage]);

    // Get bot response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: this.getBotResponse(text),
        sender: 'bot',
        timestamp: new Date(),
      };
      this.messages$.next([...this.messages$.value, botResponse]);
    }, 500);
  }

  private getBotResponse(message: string): string {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.match(/hello|hi|hey|greet/)) {
      return this.botResponses.greeting[0];
    }
    if (lowerMessage.match(/service|offer|do|what.*can/)) {
      return this.botResponses.services[0];
    }
    if (lowerMessage.match(/price|cost|fee|budget/)) {
      return this.botResponses.pricing[0];
    }
    if (lowerMessage.match(/whatsapp|wa|chat|message|quick/)) {
      return this.botResponses.whatsapp[0];
    }
    if (lowerMessage.match(/time|timeline|how.*long|duration|deliver/)) {
      return this.botResponses.timeline[0];
    }
    if (lowerMessage.match(/support|maintain|after|bug|update|amc/)) {
      return this.botResponses.support[0];
    }
    if (lowerMessage.match(/about|who|company|martial|you/)) {
      return this.botResponses.about[0];
    }

    return this.botResponses.default[0];
  }

  resetMessages(): void {
    this.messages$.next([
      {
        id: '1',
        text: "👋 Hey there! I'm the MartialDev assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  }
}
