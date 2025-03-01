'use client';

import type { User } from 'next-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { PlusIcon } from '@/components/icons';
import { SidebarHistory } from '@/components/sidebar-history';
import { SidebarUserNav } from '@/components/sidebar-user-nav';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  // Debug: Log user status
  console.log('User status:', user ? 'Logged in' : 'Not logged in');
  if (user) {
    console.log('User details:', user);
  }

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row justify-between items-center">
              <Link
                href="/"
                onClick={() => {
                  setOpenMobile(false);
                }}
                className="flex flex-row gap-3 items-center"
              >
                <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
                  Chatbot
                </span>
              </Link>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    type="button"
                    className="p-2 h-fit"
                    onClick={() => {
                      setOpenMobile(false);
                      router.push('/');
                      router.refresh();
                    }}
                  >
                    <PlusIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent align="end">New Chat</TooltipContent>
              </Tooltip>
            </div>

            {/* Debug info */}
            <div className="px-2 py-1 text-xs text-muted-foreground">
              Auth Status: {user ? 'Logged In' : 'Not Logged In'}
            </div>

            {/* AppStore Link */}
            <Link
              href="/appstore"
              onClick={() => {
                setOpenMobile(false);
              }}
              className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                width={16}
                height={16}
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 1v4" />
                <path d="M3.5 7h9" />
                <path d="M3.5 11h9" />
                <path d="M8 11v4" />
              </svg>
              <span>App Store</span>
            </Link>

            {/* Debug: User Details */}
            {user && (
              <div className="px-2 py-1 text-xs text-muted-foreground break-all">
                <div>Email: {user.email}</div>
                <div>Name: {user.name}</div>
                <div>ID: {user.id}</div>
              </div>
            )}
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarHistory user={user} />
      </SidebarContent>
      <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter>
    </Sidebar>
  );
} 