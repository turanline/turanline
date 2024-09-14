import {createSharedPathnamesNavigation} from 'next-intl/navigation';
 
export const locales = ['ru', 'en', 'es', 'fr','de', 'it', 'pt'] as const;
export const localePrefix = 'always'; 
 
export const {Link, redirect, usePathname, useRouter} =
  createSharedPathnamesNavigation({locales, localePrefix});