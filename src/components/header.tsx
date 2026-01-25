'use client';
import { InfoIcon } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import Image from 'next/image';
import Link from 'next/link';
import { ModeToggle } from './mode-toggle';

const Separator = () => (
  <div className='inline-block mx-3 my-2 w-0.5 self-stretch bg-neutral-100 dark:bg-white/10' />
);

export const Header = () => {
  return (
    <header className='bg-background sticky top-0 z-50 w-full'>
      <div className='lg:px-10 md:px-20 sm:px-5 py-2.5 flex flex-row w-full'>
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href='/'>
                  <Image
                    src='/file.svg'
                    alt='logo'
                    priority
                    width={25}
                    height={25}
                  />
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href='/leaderboards'>Leaderboards</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Data</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className='grid w-50 gap-2'>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link href='#'>Weekly</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href='#'>All Time</Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className='grow flex justify-end items-center'>
          <a
            target='_blank'
            href='https://github.com/colby-chan26/reddit-stock-tracker-web-app'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='25'
              height='25'
              fill='currentColor'
              className='bi bi-github'
              viewBox='0 0 16 16'
            >
              <path d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8' />
            </svg>
          </a>
          <Separator />
          <Link href=''>
            <InfoIcon width='25' height='25' />
          </Link>
          <Separator />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};
