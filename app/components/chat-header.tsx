'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWindowSize } from 'usehooks-ts';

import { ModelSelector } from '@/components/model-selector';
import { SidebarToggle } from '@/components/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { memo, useEffect } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { VisibilityType, VisibilitySelector } from '@/components/visibility-selector';

// Debug log when the module is loaded
console.log('ChatHeader module loaded');

function PureChatHeader({
  chatId,
  selectedModelId,
  selectedVisibilityType,
  isReadonly,
}: {
  chatId: string;
  selectedModelId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}) {
  // Debug log when the component is rendered
  console.log('ChatHeader component rendering', {
    chatId,
    selectedModelId,
    selectedVisibilityType,
    isReadonly
  });

  const router = useRouter();
  const { open } = useSidebar();

  const { width: windowWidth } = useWindowSize();

  // Debug logging for isReadonly
  useEffect(() => {
    console.log('ChatHeader - isReadonly:', isReadonly);
  }, [isReadonly]);

  return (
    <header className="sticky top-0 z-50 flex h-14 w-full shrink-0 items-center justify-between gap-4 border-b bg-background px-4 dark:border-zinc-800">
      <div className="flex flex-1 items-center gap-2">
        {!open && <SidebarToggle />}
        {!isReadonly && (
          <ModelSelector
            selectedModelId={selectedModelId}
          />
        )}
      </div>

      <div className="flex items-center gap-2">
        {!isReadonly && (
          <VisibilitySelector
            selectedVisibilityType={selectedVisibilityType}
            chatId={chatId}
          />
        )}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="order-2 md:order-1 md:px-2 px-2 md:h-fit"
              onClick={() => {
                router.push('/appstore');
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M12 3v5" />
                <path d="M5 10h14" />
                <path d="M5 16h14" />
                <path d="M12 16v5" />
              </svg>
              <span className="md:sr-only">App Store</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>App Store</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}

export const ChatHeader = memo(PureChatHeader); 