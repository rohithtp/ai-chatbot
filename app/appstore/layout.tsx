import { AppSidebar } from '@/components/app-sidebar';
import { auth } from '@/app/(auth)/auth';
import { SidebarProvider } from '@/components/ui/sidebar';

export default async function AppStoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SidebarProvider>
      <div className="relative flex h-screen">
        <AppSidebar user={session?.user} />
        <main className="flex flex-1 flex-col bg-muted/50">{children}</main>
      </div>
    </SidebarProvider>
  );
} 