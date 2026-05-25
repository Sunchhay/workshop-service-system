import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/proxy',
    prepareHeaders: (headers, { getState }) => {
      const token = (
        getState() as { auth: { accessToken: string | null } }
      ).auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Customer', 'Service', 'PriceCatalog', 'MachineModel', 'ReferenceBook', 'ServiceJob', 'Product', 'Invoice', 'Payment', 'Sale', 'Expense', 'Setting', 'ReportSummary', 'ReportServiceJob', 'ReportInvoice', 'ReportPayment', 'ReportSale', 'ReportExpense', 'ReportProfit', 'ReportUnpaidBalance', 'ReportProduct', 'ReportLowStock'],
  endpoints: () => ({}),
});
