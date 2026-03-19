import { Component, signal, inject, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiService, ChatMessage } from '../../../../core/services/ai.service';

@Component({
  selector: 'app-chat-bubble',
  imports: [FormsModule, DatePipe],
  templateUrl: './chat-bubble.html',
})
export class ChatBubble implements AfterViewChecked {
  private aiService = inject(AiService);

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  open = signal(false);
  messages = signal<ChatMessage[]>([]);
  loading = signal(false);
  suggestions = this.aiService.getSuggestedQuestions();

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  toggle() {
    this.open.set(!this.open());
  }

  selectSuggestion(question: string) {
    if (this.loading()) return;

    this.messages.update((msgs) => [
      ...msgs,
      {
        role: 'user',
        content: question,
        timestamp: new Date(),
      },
    ]);

    this.loading.set(true);

    this.aiService.query(question).subscribe({
      next: (res) => {
        this.messages.update((msgs) => [
          ...msgs,
          {
            role: 'assistant',
            content: res.data,
            timestamp: new Date(),
          },
        ]);
        this.loading.set(false);
      },
      error: () => {
        this.messages.update((msgs) => [
          ...msgs,
          {
            role: 'assistant',
            content: 'Ocurrió un error al consultar el asistente.',
            timestamp: new Date(),
          },
        ]);
        this.loading.set(false);
      },
    });
  }

  private scrollToBottom() {
    try {
      const el = this.messagesContainer?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    } catch {}
  }
}
