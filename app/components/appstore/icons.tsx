'use client';

export const Icons = {
  chat: ({ className, ...props }: { className?: string }) => (
    <img
      src="/icons/chat.png"
      alt="Chat"
      className={className}
      width={24}
      height={24}
      {...props}
    />
  ),
  ai: ({ className, ...props }: { className?: string }) => (
    <img
      src="/icons/ai.png"
      alt="AI"
      className={className}
      width={24}
      height={24}
      {...props}
    />
  ),
  tools: ({ className, ...props }: { className?: string }) => (
    <img
      src="/icons/tools.png"
      alt="Tools"
      className={className}
      width={24}
      height={24}
      {...props}
    />
  ),
  productivity: ({ className, ...props }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  plugin: ({ className, ...props }: { className?: string }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M12 3v5" />
      <path d="M5 10h14" />
      <path d="M5 16h14" />
      <path d="M12 16v5" />
    </svg>
  ),
}; 