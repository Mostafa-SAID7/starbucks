import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { LocationsService, Location } from '../../services/locations.service';

@Component({
  selector: 'app-locations',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {
  loading = true;
  search = '';
  cityFilter = '';
  locations: Location[] = [];

  private svc = inject(LocationsService);

  get filtered() {
    return this.locations.filter(l =>
      (!this.search || l.name.toLowerCase().includes(this.search.toLowerCase()) ||
                       l.address.toLowerCase().includes(this.search.toLowerCase())) &&
      (!this.cityFilter || l.city === this.cityFilter)
    );
  }

  get cities(): string[] {
    return [...new Set(this.locations.map(l => l.city))];
  }

  ngOnInit() {
    this.svc.getLocations().subscribe({
      next: locs => { this.locations = locs; this.loading = false; },
      error: ()   => { this.loading = false; }
    });
  }

  deleteLocation(id: string, name: string) {
    if (!confirm(`Remove "${name}"?`)) return;
    this.svc.deleteLocation(id).subscribe(() => {
      this.locations = this.locations.filter(l => l.id !== id);
    });
  }

  toggleStatus(loc: Location) {
    loc.status = loc.status === 'Open' ? 'Closed' : 'Open';
  }
}
