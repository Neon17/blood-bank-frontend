// hooks/useFormattedUsername.ts
import { useMemo } from 'react';

export function useFormattedUsername(name?: string | null): string {
  return useMemo(() => {
    if (!name) return 'User';
    
    const firstName = name.split(' ')[0];
    let processedName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    
    return processedName.length > 8 ? processedName.substring(0, 6) + '...' : processedName;
  }, [name]);
}