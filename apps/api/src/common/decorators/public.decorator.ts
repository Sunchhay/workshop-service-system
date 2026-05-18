import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// Mark a controller or route handler as publicly accessible (no auth required).
// The JWT guard (added in auth step) checks for this key before enforcing auth.
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
