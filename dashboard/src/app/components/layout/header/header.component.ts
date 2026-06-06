import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-header',
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Output() menuToggle = new EventEmitter<void>();

  notifOpen = false;

  toggle() {
    this.menuToggle.emit();
  }
}
