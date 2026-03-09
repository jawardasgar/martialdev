import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatbotService, ChatMessage } from '../../core/services/chatbot';

@Component({
  standalone: true,
  selector: 'app-chatbot',
  templateUrl: './chatbot.html',
  styleUrls: ['./chatbot.scss'],
  imports: [NgIf, NgFor, NgClass, FormsModule],
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  isOpen = false;
  messages: ChatMessage[] = [];
  inputValue = '';

  quickReplies = [
    { label: 'Services', message: 'What services do you offer?' },
    { label: 'Pricing', message: 'How much does it cost?' },
    { label: 'Timeline', message: 'How long will it take?' },
    { label: 'Support', message: 'Do you provide support after launch?' },
  ];

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit(): void {
    this.chatbotService.getMessages().subscribe((messages) => {
      this.messages = messages;
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  closeChat(): void {
    this.isOpen = false;
  }

  sendMessage(): void {
    if (this.inputValue.trim()) {
      this.chatbotService.sendMessage(this.inputValue);
      this.inputValue = '';
    }
  }

  sendQuickReply(reply: { label: string; message: string }): void {
    this.chatbotService.sendMessage(reply.message);
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      try {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      } catch (err) {}
    });
  }

  openWhatsApp(): void {
    const whatsappUrl = 'https://wa.me/94758804830';
    window.open(whatsappUrl, '_blank');
  }
}
