'use client';

import { useEffect, useState } from 'react';
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
  const [isInstalled, setIsInstalled] = useState(server.isInstalled || false);

  useEffect(() => {
    console.log('Initial installed state:', server.isInstalled);
  }, [server.isInstalled]);

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
      <div className="p-4 flex items-center gap-4">
        <div className="p-4 flex items-center gap-4">
          {server.icon || server.iconUrl ? (
            <img
              src={server.icon || server.iconUrl}
              alt={server.title || server.name}
              className="object-contain max-w-full max-h-full"
            />
          ) : (
            <div className="flex items-center gap-4">
              <div className="text-black">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="6" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="18" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="6" cy="18" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="18" cy="18" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                  <line
                    x1="11.1"
                    y1="10.9"
                    x2="7.1"
                    y2="6.9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="12.9"
                    y1="10.9"
                    x2="16.9"
                    y2="6.9"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="11.1"
                    y1="13.1"
                    x2="7.1"
                    y2="17.1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <line
                    x1="13.1"
                    y1="13.1"
                    x2="17.1"
                    y2="17.1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-mono">{server.title || server.name}</h2>
            </div>
          )}
        </div>
        <h2 className="text-xl sm:text-2xl font-mono">{server.title || server.name}</h2>

      </div>
      <CardContent className="flex-grow p-4 sm:p-6 w-full">

        <div className="px-6 pb-4">
          <p className="font-mono leading-relaxed">{server.description}</p>
        </div>


        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex items-center text-amber-500">
            <StarIcon className="w-4 h-4 mr-1" />
            <span className="text-xs font-medium">{server.stars}</span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1">
            {server.tags && server.tags.map((tag) => (
              <span key={tag} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>



      </CardContent>
      <CardFooter className="p-4 sm:p-6 pt-0 w-full">
        <Button
          className="w-full font-mono"
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