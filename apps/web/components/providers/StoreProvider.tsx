'use client';

import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';

import { hydrateAuth } from '@/features/auth/authSlice';
import { type AppDispatch, store } from '@/lib/store/store';

function HydrateAuth({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem('workshop_access_token');
    dispatch(hydrateAuth(token));
  }, [dispatch]);

  return <>{children}</>;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <HydrateAuth>{children}</HydrateAuth>
    </Provider>
  );
}
