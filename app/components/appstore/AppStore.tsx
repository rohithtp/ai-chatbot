"use client"

import { useEffect, useState } from "react"
import ServerCard, { ServerCardProps } from "./ServerCard"
import SearchFilter from "./SearchFilter"
import { Input } from "@/components/ui/input"

type Server = ServerCardProps["server"]

export default function AppStore() {
  const [servers, setServers] = useState<Server[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchServersAndUserConfig = async () => {
      try {
        setIsLoading(true)
        // Fetch available servers
        const serversResponse = await fetch("/api/appstore/servers")
        const serversData = await serversResponse.json()
        if (serversData.error) {
          throw new Error(serversData.error)
        }

        // Fetch user's installed servers
        const userConfigResponse = await fetch("/api/appstore/user-servers")
        const userConfigData = await userConfigResponse.json()
        
        // Mark servers as installed if they exist in user's config
        const installedServerIds = new Set(
          Object.keys(userConfigData.installedServers || {})
        )

        const serversWithInstallState = serversData.servers.map((server: Server) => ({
          ...server,
          isInstalled: installedServerIds.has(server.id),
          installedAt: userConfigData.installedServers?.[server.id]?.installedAt,
          lastUsed: userConfigData.installedServers?.[server.id]?.lastUsed,
          configData: userConfigData.installedServers?.[server.id]?.configData || server.configData
        }))

        console.log("Fetched servers:", serversWithInstallState)
        setServers(serversWithInstallState)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchServersAndUserConfig()
  }, [])

  const handleConfigureServer: NonNullable<ServerCardProps["onConfigureServer"]> = (server) => {
    // TODO: Implement server configuration modal/page
    console.log("Configure server:", server)
  }

  const filteredServers = servers.filter((server) => {
    const matchesSearch = 
      server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      server.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === "all" || 
      (server.categories && server.categories.some(category => category.toLowerCase() === selectedCategory.toLowerCase()))

    console.log("Filtering server:", {
      server: server.name,
      selectedCategory,
      serverCategories: server.categories,
      matchesCategory,
      matchesSearch
    })

    return matchesSearch && matchesCategory
  })

  console.log("Filtered servers:", filteredServers.length)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center space-x-4 p-4 border-b">
        <Input
          placeholder="Search servers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <SearchFilter
          onSearch={(query) => setSearchQuery(query)}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>
      <div className="flex-1 p-4 overflow-auto">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServers.map((server) => (
              <ServerCard 
                key={server.id} 
                server={server}
                onConfigureServer={handleConfigureServer}
              />
            ))}
            {filteredServers.length === 0 && (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No servers found matching your criteria
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 