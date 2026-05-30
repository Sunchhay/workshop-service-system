import Link from 'next/link';
import { CreditCard, Package, Receipt, ShoppingCart, Users } from 'lucide-react';

import { useTranslation } from '@/lib/i18n/TranslationContext';

const actions = [
  { labelKey: 'dashboard.cart', href: '/admin/carts', icon: ShoppingCart, color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  { labelKey: 'dashboard.newCustomer', href: '/admin/customers/create', icon: Users, color: 'bg-green-500/10 text-green-600 dark:text-green-400' },
  { labelKey: 'dashboard.newInvoice', href: '/admin/invoices/create', icon: Receipt, color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  { labelKey: 'dashboard.newExpense', href: '/admin/expenses/create', icon: CreditCard, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  { labelKey: 'dashboard.newProduct', href: '/admin/products/create', icon: Package, color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400' },
] as const;

export function DashboardQuickActions() {
  const { t } = useTranslation();

  return (
    <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap scrollbar-none">
      {actions.map((action) => (
        <Link key={action.href} href={action.href} className="shrink-0">
          <div className="flex flex-col items-center gap-1.5 w-16">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${action.color}`}>
              <action.icon className="h-5 w-5" />
            </div>
            <span className="text-xs text-center text-muted-foreground leading-tight">
              {t(action.labelKey)}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
