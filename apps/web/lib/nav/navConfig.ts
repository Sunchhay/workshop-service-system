import {
  BarChart3,
  BookOpen,
  ClipboardList,
  Cpu,
  CreditCard,
  FileText,
  LayoutDashboard,
  MoreHorizontal,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  TrendingDown,
  User,
  UserCog,
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
  { labelKey: 'nav.serviceJobs', href: '/admin/service-jobs', icon: ClipboardList },
  { labelKey: 'nav.customers', href: '/admin/customers', icon: Users },
  { labelKey: 'nav.products', href: '/admin/products', icon: Package },
  { labelKey: 'nav.invoices', href: '/admin/invoices', icon: FileText },
  { labelKey: 'nav.payments', href: '/admin/payments', icon: CreditCard },
];

// Desktop sidebar — management section
export const MANAGEMENT_NAV: NavItem[] = [
  { labelKey: 'nav.services', href: '/admin/services', icon: Wrench },
  { labelKey: 'nav.priceCatalog', href: '/admin/price-catalog', icon: Tag },
  { labelKey: 'nav.machineModels', href: '/admin/machine-models', icon: Cpu },
  { labelKey: 'nav.referenceBook', href: '/admin/reference-book', icon: BookOpen },
  { labelKey: 'nav.directSales', href: '/admin/sales', icon: ShoppingCart },
  { labelKey: 'nav.expenses', href: '/admin/expenses', icon: TrendingDown },
  { labelKey: 'nav.reports', href: '/admin/reports', icon: BarChart3 },
  { labelKey: 'nav.settings', href: '/admin/settings', icon: Settings },
  { labelKey: 'nav.users', href: '/admin/users', icon: UserCog },
];

// Mobile bottom tabs (4 items + More button)
export const MOBILE_BOTTOM_NAV: NavItem[] = [
  { labelKey: 'nav.dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { labelKey: 'nav.serviceJobs', href: '/admin/service-jobs', icon: ClipboardList },
  { labelKey: 'nav.customers', href: '/admin/customers', icon: Users },
  { labelKey: 'nav.products', href: '/admin/products', icon: Package },
];

// Placeholder so the More tab icon is accessible from navConfig if needed
export const MORE_ICON = MoreHorizontal;

// Mobile More sheet — all secondary items
export const MORE_MENU_NAV: NavItem[] = [
  { labelKey: 'nav.services', href: '/admin/services', icon: Wrench },
  { labelKey: 'nav.priceCatalog', href: '/admin/price-catalog', icon: Tag },
  { labelKey: 'nav.machineModels', href: '/admin/machine-models', icon: Cpu },
  { labelKey: 'nav.referenceBook', href: '/admin/reference-book', icon: BookOpen },
  { labelKey: 'nav.invoices', href: '/admin/invoices', icon: FileText },
  { labelKey: 'nav.payments', href: '/admin/payments', icon: CreditCard },
  { labelKey: 'nav.directSales', href: '/admin/sales', icon: ShoppingCart },
  { labelKey: 'nav.expenses', href: '/admin/expenses', icon: TrendingDown },
  { labelKey: 'nav.reports', href: '/admin/reports', icon: BarChart3 },
  { labelKey: 'nav.settings', href: '/admin/settings', icon: Settings },
  { labelKey: 'nav.users', href: '/admin/users', icon: UserCog },
];

// All items combined — used for active-title lookup
export const ALL_NAV: NavItem[] = [
  ...MAIN_NAV,
  ...MANAGEMENT_NAV,
  { labelKey: 'nav.profile', href: '/admin/profile', icon: User, exact: true },
  { labelKey: 'auth.changePassword', href: '/admin/profile/change-password', icon: User },
];
