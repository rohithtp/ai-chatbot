'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Icons } from './icons';
import { StarIcon } from 'lucide-react';

interface Server {
  id: string;
  name: string;
  title: string;
  description: string;
  stars: number;
  tags: string[];
  icon: string;
  iconUrl: string;
  categories: string[];
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

  const primaryCategory = server.categories[0] || 'plugin';
  const Icon = Icons[primaryCategory as keyof typeof Icons] || Icons.plugin;

  return (
    <Card className="flex flex-col h-full overflow-hidden w-full">
      <div className="relative p-4 sm:p-6 flex items-center justify-center bg-muted w-full">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
          {server.icon || server.iconUrl ? (
            <img
              src={server.icon || server.iconUrl}
              alt={server.title || server.name}
              className="object-contain max-w-full max-h-full"
              width={128}
              height={128}
            />
          ) : (
            <Icon className="w-12 h-12 sm:w-16 sm:h-16 text-muted-foreground" />
          )}
        </div>
      </div>
      <CardContent className="flex-grow p-4 sm:p-6 w-full">
        <div className="flex justify-between items-start mb-1 sm:mb-2">
          <h3 className="font-semibold text-lg sm:text-xl line-clamp-1">{server.title || server.name}</h3>
          <div className="flex items-center text-amber-500">
            <StarIcon className="w-4 h-4 mr-1" />
            <span className="text-xs font-medium">{server.stars}</span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3">{server.description}</p>
        <div className="mt-3 flex flex-wrap gap-1">
          {server.tags && server.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {server.categories.map((category) => (
            <span key={category} className="text-xs px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full">
              {category}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 sm:p-6 pt-0 w-full">
        <Button
          className="w-full"
          variant={isInstalled ? "outline" : "default"}
          onClick={handleInstall}
          disabled={isInstalling || isInstalled}
          size="sm"
        >
          {isInstalled ? 'Installed' : isInstalling ? 'Installing...' : 'Install'}
        </Button>
      </CardFooter>
    </Card>
  );
} 