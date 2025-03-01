'use client';

import { useEffect, useState } from 'react';
import ServerCard from '../components/appstore/ServerCard';
import SearchFilter from '../components/appstore/SearchFilter';
import { toast } from 'sonner';

interface Server {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  categories: string[];
  configData: Record<string, any>;
}

export default function AppStorePage() {
  const [servers, setServers] = useState<Server[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await fetch('/api/appstore/servers');
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setServers(data.servers);
      } catch (error) {
        console.error('Error fetching servers:', error);
        toast.error('Failed to load servers');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServers();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredServers = servers.filter(server => {
    const matchesSearch = server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || server.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 overflow-auto">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-8">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredServers.map((server) => (
              <ServerCard key={server.id} server={server} />
            ))}
            {filteredServers.length === 0 && (
              <div className="col-span-full text-center py-8 sm:py-12 text-muted-foreground">
                No servers found matching your criteria
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 