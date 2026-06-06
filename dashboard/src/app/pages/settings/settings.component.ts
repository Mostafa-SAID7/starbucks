import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from '../../lucide-angular-shim.module';
import { SettingsService, SystemSetting } from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  loading = true;
  saving: Record<string, boolean> = {};
  saved: Record<string, boolean> = {};
  settings: SystemSetting[] = [];
  editValues: Record<string, string> = {};

  private svc = inject(SettingsService);

  get groups(): string[] {
    return [...new Set(this.settings.map(s => s.group))];
  }

  byGroup(group: string): SystemSetting[] {
    return this.settings.filter(s => s.group === group);
  }

  ngOnInit() {
    this.svc.getSettings().subscribe({
      next: settings => {
        this.settings = settings;
        settings.forEach(s => this.editValues[s.key] = s.value);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  saveSetting(setting: SystemSetting) {
    const newVal = this.editValues[setting.key];
    if (newVal === setting.value) return;
    this.saving[setting.key] = true;
    this.svc.updateSetting(setting.key, newVal).subscribe(() => {
      setting.value = newVal;
      this.saving[setting.key] = false;
      this.saved[setting.key] = true;
      setTimeout(() => delete this.saved[setting.key], 2000);
    });
  }

  toggleBoolean(setting: SystemSetting) {
    this.editValues[setting.key] = this.editValues[setting.key] === 'true' ? 'false' : 'true';
    this.saveSetting(setting);
  }

  groupIcon(group: string): string {
    const map: Record<string, string> = {
      Payments: 'dollar-sign',
      Loyalty:  'star',
      System:   'wrench',
      Contact:  'phone',
    };
    return map[group] ?? 'settings';
  }
}
