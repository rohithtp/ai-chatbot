'use client';

export const AppStoreIcon = ({ size = 16 }: { size?: number }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
    >
      <desc>Shopping Cart User 4 Streamline Icon: https://streamlinehq.com</desc>
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M25.875 39.29166666666667h9.583333333333334l5.75 -15.333333333333334h3.8333333333333335" />
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M39.770833333333336 27.791666666666668H23l1.9166666666666667 7.666666666666667h11.979166666666668" />
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="m8.625 4.791666666666667 5.6905833333333335 3.8333333333333335H23.958333333333336" />
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="M20.125 37.375H0.9583333333333334v-11.5l15.333333333333334 -3.8333333333333335 8.623083333333334 2.15625" />
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="m23.958333333333336 16.291666666666668 -7.666666666666667 3.8333333333333335 -7.666666666666667 -3.8333333333333335v-11.5l7.666666666666667 -3.8333333333333335 7.666666666666667 3.8333333333333335v11.5Z" />
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m26.82375 42.645833333333336 0.9583333333333334 0.9583333333333334 -0.9583333333333334 0.9583333333333334" />
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m26.82375 42.645833333333336 -0.9583333333333334 0.9583333333333334 0.9583333333333334 0.9583333333333334" />
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m34.50958333333333 42.645833333333336 0.9583333333333334 0.9583333333333334 -0.9583333333333334 0.9583333333333334" />
      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m34.50958333333333 42.645833333333336 -0.9583333333333334 0.9583333333333334 0.9583333333333334 0.9583333333333334" />
    </svg>
  );
};

export const Icons = {
  chat: ({ className, ...props }: { className?: string }) => (
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
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  ai: ({ className, ...props }: { className?: string }) => (
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
      <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
      <path d="M12 16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z" />
      <path d="M20 12a2 2 0 0 1-2-2 2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-2z" />
      <path d="M4 12a2 2 0 0 1-2-2 2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 2 2 0 0 1-2 2H4z" />
      <path d="M17.657 6.343a2 2 0 0 1 0 2.828l-1.414 1.414a2 2 0 0 1-2.828 0 2 2 0 0 1 0-2.828l1.414-1.414a2 2 0 0 1 2.828 0z" />
      <path d="M6.343 17.657a2 2 0 0 1 0-2.828l1.414-1.414a2 2 0 0 1 2.828 0 2 2 0 0 1 0 2.828l-1.414 1.414a2 2 0 0 1-2.828 0z" />
      <path d="M17.657 17.657a2 2 0 0 1-2.828 0l-1.414-1.414a2 2 0 0 1 0-2.828 2 2 0 0 1 2.828 0l1.414 1.414a2 2 0 0 1 0 2.828z" />
      <path d="M6.343 6.343a2 2 0 0 1 2.828 0l1.414 1.414a2 2 0 0 1 0 2.828 2 2 0 0 1-2.828 0L6.343 9.171a2 2 0 0 1 0-2.828z" />
    </svg>
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
  tools: ({ className, ...props }: { className?: string }) => (
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
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
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