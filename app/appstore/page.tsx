'use client';

import { useEffect, useState } from 'react';
import ServerCard from '../components/appstore/ServerCard';
import SearchFilter from '../components/appstore/SearchFilter';
import { toast } from 'sonner';

interface ServerConfig {
  settings: Record<string, any>;
  preferences: Record<string, any>;
}

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
  configData: ServerConfig;
  isInstalled?: boolean;
  installedAt?: string;
  lastUsed?: string;
}

export default function AppStorePage() {
  const [servers, setServers] = useState<Server[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServersAndUserConfig = async () => {
      try {
        // Fetch available servers
        const serversResponse = await fetch('/api/appstore/servers');
        const serversData = await serversResponse.json();
        if (serversData.error) {
          throw new Error(serversData.error);
        }

        // Fetch user's installed servers
        const userConfigResponse = await fetch('/api/appstore/user-servers');
        const userConfigData = await userConfigResponse.json();
        
        // Mark servers as installed if they exist in user's config
        const installedServerIds = new Set(
          Object.keys(userConfigData.installedServers || {})
        );

        const serversWithInstallState = serversData.servers.map((server: Server) => ({
          ...server,
          isInstalled: installedServerIds.has(server.id),
          installedAt: userConfigData.installedServers?.[server.id]?.installedAt,
          lastUsed: userConfigData.installedServers?.[server.id]?.lastUsed,
          configData: userConfigData.installedServers?.[server.id]?.configData || server.configData
        }));

        setServers(serversWithInstallState);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load servers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServersAndUserConfig();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleConfigureServer = (server: Server) => {
    // TODO: Implement server configuration modal/page
    console.log('Configure server:', server);
  };

  const filteredServers = servers.filter(server => {
    const matchesSearch = 
      server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      server.categories.some(cat => cat.toLowerCase() === selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col min-w-0 h-dvh bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-8 w-full">
        <div className="flex flex-col gap-2 sm:gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">App Store</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Browse and install MCP servers to enhance your chat experience
          </p>
        </div>
        
        <SearchFilter 
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          selectedCategory={selectedCategory}
        />

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
              {filteredServers.map((server) => (
                <ServerCard 
                  key={server.id} 
                  server={server}
                  onConfigureServer={handleConfigureServer}
                />
              ))}
              {filteredServers.length === 0 && (
                <div className="col-span-full text-center py-8 sm:py-12 text-muted-foreground w-full bg-muted rounded-md">
                  No servers found matching your criteria
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 