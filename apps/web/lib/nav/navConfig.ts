import {
  BarChart3,
  BookOpen,
  Cpu,
  DollarSign,
  History,
  LayoutDashboard,
  MoreHorizontal,
  Package,
  Settings,
  ShoppingCart,
  Tag,
  Tags,
  TrendingDown,
  Truck,
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

// Desktop sidebar — main section
export const MAIN_NAV: NavItem[] = [
  { labelKey: 'nav.dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { labelKey: 'nav.cart', href: '/admin/carts', icon: ShoppingCart },
  { labelKey: 'nav.sales', href: '/admin/sales', icon: History },
];

// Desktop sidebar — management section
export const MANAGEMENT_NAV: NavItem[] = [
  { labelKey: 'nav.customers', href: '/admin/customers', icon: Users },
  { labelKey: 'nav.machineModels', href: '/admin/machine-models', icon: Cpu },
  { labelKey: 'nav.services', href: '/admin/services', icon: Wrench },
  { labelKey: 'nav.servicePrices', href: '/admin/service-prices', icon: Tag },
  { labelKey: 'nav.products', href: '/admin/products', icon: Package },
  { labelKey: 'nav.productPrices', href: '/admin/product-prices', icon: Tags },
  { labelKey: 'nav.suppliers', href: '/admin/suppliers', icon: Truck },
  { labelKey: 'nav.productSupplierPrices', href: '/admin/product-supplier-prices', icon: DollarSign },
];

// Desktop sidebar — operations section
export const OPERATIONS_NAV: NavItem[] = [
  { labelKey: 'nav.expenses', href: '/admin/expenses', icon: TrendingDown },
  { labelKey: 'nav.referenceBook', href: '/admin/reference-book', icon: BookOpen },
];

// Desktop sidebar — system section
export const SYSTEM_NAV: NavItem[] = [
  { labelKey: 'nav.reports', href: '/admin/reports', icon: BarChart3 },
  { labelKey: 'nav.users', href: '/admin/users', icon: UserCog },
  { labelKey: 'nav.settings', href: '/admin/settings', icon: Settings },
];

// Mobile bottom tabs (4 items + More button)
export const MOBILE_BOTTOM_NAV: NavItem[] = [
  { labelKey: 'nav.dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
  { labelKey: 'nav.cart', href: '/admin/carts', icon: ShoppingCart },
  { labelKey: 'nav.customers', href: '/admin/customers', icon: Users },
  { labelKey: 'nav.sales', href: '/admin/sales', icon: History },
];

// Placeholder so the More tab icon is accessible from navConfig if needed
export const MORE_ICON = MoreHorizontal;

// Mobile More sheet — all secondary items
export const MORE_MENU_NAV: NavItem[] = [
  { labelKey: 'nav.machineModels', href: '/admin/machine-models', icon: Cpu },
  { labelKey: 'nav.services', href: '/admin/services', icon: Wrench },
  { labelKey: 'nav.servicePrices', href: '/admin/service-prices', icon: Tag },
  { labelKey: 'nav.products', href: '/admin/products', icon: Package },
  { labelKey: 'nav.productPrices', href: '/admin/product-prices', icon: Tags },
  { labelKey: 'nav.suppliers', href: '/admin/suppliers', icon: Truck },
  { labelKey: 'nav.productSupplierPrices', href: '/admin/product-supplier-prices', icon: DollarSign },
  { labelKey: 'nav.expenses', href: '/admin/expenses', icon: TrendingDown },
  { labelKey: 'nav.referenceBook', href: '/admin/reference-book', icon: BookOpen },
  { labelKey: 'nav.reports', href: '/admin/reports', icon: BarChart3 },
  { labelKey: 'nav.users', href: '/admin/users', icon: UserCog },
  { labelKey: 'nav.settings', href: '/admin/settings', icon: Settings },
];

// All items combined — used for active-title lookup
export const ALL_NAV: NavItem[] = [
  ...MAIN_NAV,
  ...MANAGEMENT_NAV,
  ...OPERATIONS_NAV,
  ...SYSTEM_NAV,
];
