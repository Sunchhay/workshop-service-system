import {
  BarChart3,
  CreditCard,
  Cpu,
  LayoutDashboard,
  MoreHorizontal,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  User,
  Users,
  Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import type { TranslationKey } from '@/lib/i18n/TranslationContext';

export type NavItem = {
  labelKey: TranslationKey;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
};

export function isActiveRoute(
  pathname: string,
  href: string,
  exact = false,
): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + '/');
}

// Desktop sidebar — primary section
export const MAIN_NAV: NavItem[] = [
  { labelKey: 'nav.dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { labelKey: 'nav.customers', href: '/admin/customers', icon: Users },
  { labelKey: 'nav.machineModels', href: '/admin/machine-models', icon: Cpu },
  { labelKey: 'nav.services', href: '/admin/services', icon: Wrench },
  { labelKey: 'nav.products', href: '/admin/products', icon: Package },
  { labelKey: 'nav.priceCatalog', href: '/admin/price-catalog', icon: Tag },
  { labelKey: 'nav.salesHistory', href: '/admin/sales/history', icon: CreditCard },
  { labelKey: 'nav.reports', href: '/admin/reports', icon: BarChart3 },
  { labelKey: 'nav.settings', href: '/admin/settings', icon: Settings },
];

// Desktop sidebar — management section
export const MANAGEMENT_NAV: NavItem[] = [];

// Mobile bottom tabs (4 items + More button)
export const MOBILE_BOTTOM_NAV: NavItem[] = [
  { labelKey: 'nav.dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { labelKey: 'nav.carts', href: '/admin/carts', icon: ShoppingCart },
  { labelKey: 'nav.salesHistory', href: '/admin/sales/history', icon: CreditCard },
  { labelKey: 'nav.customers', href: '/admin/customers', icon: Users },
];

// Placeholder so the More tab icon is accessible from navConfig if needed
export const MORE_ICON = MoreHorizontal;

// Mobile More sheet — all secondary items
export const MORE_MENU_NAV: NavItem[] = [
  { labelKey: 'nav.services', href: '/admin/services', icon: Wrench },
  { labelKey: 'nav.products', href: '/admin/products', icon: Package },
  { labelKey: 'nav.machineModels', href: '/admin/machine-models', icon: Cpu },
  { labelKey: 'nav.priceCatalog', href: '/admin/price-catalog', icon: Tag },
  { labelKey: 'nav.reports', href: '/admin/reports', icon: BarChart3 },
  { labelKey: 'nav.settings', href: '/admin/settings', icon: Settings },
];

// All items combined — used for active-title lookup
export const ALL_NAV: NavItem[] = [
  ...MAIN_NAV,
  ...MANAGEMENT_NAV,
  { labelKey: 'nav.carts', href: '/admin/carts', icon: ShoppingCart, exact: true },
  { labelKey: 'nav.profile', href: '/admin/profile', icon: User, exact: true },
  { labelKey: 'auth.changePassword', href: '/admin/profile/change-password', icon: User },
];
