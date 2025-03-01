'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Icons } from './icons';

interface Server {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  category: string;
  configData: Record<string, any>;
  isInstalled?: boolean;
}

interface ServerCardProps {
  server: Server;
}

export default function ServerCard({ server }: ServerCardProps) {
  const [isInstalling, setIsInstalling] = useState(false);
  const [isInstalled, setIsInstalled] = useState(server.isInstalled);

  const handleInstall = async () => {
    try {
      setIsInstalling(true);
      const response = await fetch('/api/appstore/install', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ serverId: server.id }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Installation failed');
      }

      setIsInstalled(true);
      toast.success('Server installed successfully');
    } catch (error) {
      console.error('Installation failed:', error);
      toast.error(error instanceof Error ? error.message : 'Installation failed');
    } finally {
      setIsInstalling(false);
    }
  };

  const Icon = Icons[server.category as keyof typeof Icons] || Icons.plugin;

  return (
    <Card className="flex flex-col h-full">
      <div className="relative aspect-square p-6 flex items-center justify-center bg-muted">
        <div className="relative w-32 h-32 flex items-center justify-center">
          {server.iconUrl ? (
            <img
              src={server.iconUrl}
              alt={server.name}
              className="object-contain"
              width={128}
              height={128}
            />
          ) : (
            <Icon className="w-16 h-16 text-muted-foreground" />
          )}
        </div>
      </div>
      <CardContent className="flex-grow p-6">
        <h3 className="font-semibold text-xl mb-2">{server.name}</h3>
        <p className="text-sm text-muted-foreground">{server.description}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button
          className="w-full"
          variant={isInstalled ? "outline" : "default"}
          onClick={handleInstall}
          disabled={isInstalling || isInstalled}
        >
          {isInstalled ? 'Installed' : isInstalling ? 'Installing...' : 'Install'}
        </Button>
      </CardFooter>
    </Card>
  );
} 