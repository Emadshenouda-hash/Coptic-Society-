'use client';

import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

/**
 * Checks if the current user is an administrator.
 *
 * This hook:
 * 1. Retrieves the current authenticated user via `useUser`.
 * 2. If a user is logged in, it creates a reference to their document
 *    in the `/roles_admin` collection in Firestore.
 * 3. It uses `useDoc` to check if that document exists.
 * 4. A user is considered an admin if and only if the document exists.
 *
 * @returns An object containing:
 * - `user`: The current Firebase user object, or null.
 * - `isAdmin`: A boolean indicating if the user is an admin.
 * - `isLoading`: A boolean that is true while user auth state or the admin role is being checked.
 */
export function useAdminAuth() {
  const { user, isUserLoading, userError } = useUser();
  const firestore = useFirestore();

  // Create a memoized reference to the user's role document.
  // This prevents re-running the doc subscription on every render.
  const adminRoleRef = useMemoFirebase(() => {
    if (user) {
      // The path to the document is `/roles_admin/{user.uid}`.
      return doc(firestore, 'roles_admin', user.uid);
    }
    // If there's no user, there's no role to check.
    return null;
  }, [user, firestore]);

  // Subscribe to the admin role document.
  // `useDoc` will return data if the doc exists, otherwise `data` is null.
  const { data: adminRole, isLoading: isAdminRoleLoading } = useDoc(adminRoleRef);

  // The overall loading state depends on both user authentication and the Firestore query.
  const isLoading = isUserLoading || (!!user && isAdminRoleLoading);

  // The user is an admin if their role document exists (i.e., `adminRole` is not null).
  const isAdmin = !!adminRole;

  return { user, isAdmin, isLoading, error: userError };
}
