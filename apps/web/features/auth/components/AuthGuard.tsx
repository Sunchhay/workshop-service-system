'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { logout, setAuthenticatedUser } from '@/features/auth/authSlice';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';

import { useGetMeQuery } from '../api';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, accessToken, isHydrated } = useAppSelector(
    (s) => s.auth,
  );

  // Only call /auth/me if hydrated, has a token, but not yet authenticated
  const { data, error, isLoading } = useGetMeQuery(undefined, {
    skip: !isHydrated || isAuthenticated || !accessToken,
  });

  // /auth/me succeeded — mark user as authenticated
  useEffect(() => {
    if (data?.data) {
      dispatch(setAuthenticatedUser(data.data));
    }
  }, [data, dispatch]);

  // /auth/me failed — token is invalid or expired
  useEffect(() => {
    if (error) {
      dispatch(logout());
      router.replace('/login');
    }
  }, [error, dispatch, router]);

  // No token after hydration — send to login
  useEffect(() => {
    if (isHydrated && !accessToken) {
      router.replace('/login');
    }
  }, [isHydrated, accessToken, router]);

  // Waiting for localStorage hydration (resolves within one render cycle)
  if (!isHydrated) return null;

  // No token — redirect in flight
  if (!accessToken) return null;

  // Token exists, waiting for /auth/me response
  if (!isAuthenticated && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  // /auth/me returned but dispatch not yet reflected (edge case)
  if (!isAuthenticated) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  return <>{children}</>;
}
