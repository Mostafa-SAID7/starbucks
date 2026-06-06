import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { LUCIDE_ICONS, LucideIconProvider } from 'lucide-angular';
import {
  LayoutDashboard, ShoppingBag, Package, ChartBarBig,
  Bell, Search, Settings, LogOut, Menu, X,
  ChevronLeft, ChevronRight, Coffee, TrendingUp,
  Users, DollarSign, ShoppingCart, UserCheck, Boxes,
  ArrowUp, ArrowDown, Eye, Pencil, Trash2,
  Filter, Download, Calendar, Plus, CheckCircle,
  Clock, XCircle, AlertCircle, Star, Sparkles
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({
        LayoutDashboard, ShoppingBag, Package, ChartBarBig,
        Bell, Search, Settings, LogOut, Menu, X,
        ChevronLeft, ChevronRight, Coffee, TrendingUp,
        Users, DollarSign, ShoppingCart, UserCheck, Boxes,
        ArrowUp, ArrowDown, Eye, Pencil, Trash2,
        Filter, Download, Calendar, Plus, CheckCircle,
        Clock, XCircle, AlertCircle, Star, Sparkles
      })
    }
  ]
};
