import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { UsersService, AdminUser } from '../../services/users.service';

@Component({
  selector: 'app-users',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  loading = true;
  search = '';
  roleFilter = '';
  users: AdminUser[] = [];

  private svc = inject(UsersService);

  get filtered(): AdminUser[] {
    return this.users.filter(u =>
      (!this.search ||
        u.name.toLowerCase().includes(this.search.toLowerCase()) ||
        u.email.toLowerCase().includes(this.search.toLowerCase())) &&
      (!this.roleFilter || u.role === this.roleFilter)
    );
  }

  get totalActive():   number { return this.users.filter(u => u.status === 'Active').length; }
  get totalDisabled(): number { return this.users.filter(u => u.status === 'Disabled').length; }
  get totalAdmins():   number { return this.users.filter(u => u.role === 'Admin' || u.role === 'SuperAdmin').length; }

  ngOnInit() {
    this.svc.getUsers().subscribe({
      next: users => { this.users = users; this.loading = false; },
      error: ()    => { this.loading = false; }
    });
  }

  disableUser(user: AdminUser) {
    const action = user.status === 'Active' ? 'Disable' : 'Enable';
    if (!confirm(`${action} account for ${user.name}?`)) return;
    this.svc.disableUser(user.id).subscribe(() => {
      user.status = user.status === 'Active' ? 'Disabled' : 'Active';
    });
  }

  changeRole(user: AdminUser, role: string) {
    if (!confirm(`Promote ${user.name} to ${role}?`)) return;
    this.svc.changeRole(user.id, role).subscribe(() => {
      user.role = role;
    });
  }

  getStatusClass(status: string): string {
    return status === 'Active'
      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
      : 'bg-red-50 text-red-700 ring-1 ring-red-200';
  }

  getRoleClass(role: string): string {
    const map: Record<string, string> = {
      SuperAdmin: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
      Admin:      'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
      Customer:   'bg-gray-100 text-gray-600',
    };
    return map[role] ?? 'bg-gray-100 text-gray-600';
  }

  initials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
