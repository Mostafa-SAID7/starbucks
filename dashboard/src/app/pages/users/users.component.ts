import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from '../../lucide-angular-shim.module';
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
  statusFilter = '';
  users: AdminUser[] = [];

  private svc = inject(UsersService);

  get filtered(): AdminUser[] {
    return this.users.filter(u =>
      (!this.search || u.name.toLowerCase().includes(this.search.toLowerCase()) || u.email.toLowerCase().includes(this.search.toLowerCase())) &&
      (!this.roleFilter   || u.role   === this.roleFilter) &&
      (!this.statusFilter || u.status === this.statusFilter)
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
    this.svc.changeRole(user.id, role).subscribe(() => { user.role = role; });
  }

  getStatusClass(status: string): string {
    return status === 'Active' ? 'badge badge-success' : 'badge badge-danger';
  }

  getRoleClass(role: string): string {
    const map: Record<string, string> = {
      SuperAdmin: 'badge badge-purple',
      Admin:      'badge badge-info',
      Customer:   'badge badge-muted',
    };
    return map[role] ?? 'badge badge-muted';
  }

  initials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }
}
