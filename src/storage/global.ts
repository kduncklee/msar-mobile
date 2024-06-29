/* eslint-disable prefer-const */
/* eslint-disable import/no-mutable-exports */
import type { location } from '@/types/location';

export let selectedLocation: location = null;
export let currentCredentials: { username: string; token: string } = null;
