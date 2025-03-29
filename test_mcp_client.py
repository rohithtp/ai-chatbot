from my_mcp_module.mcp_client import MCPClient

def main():
    # Create an MCP client instance
    with MCPClient() as client:
        try:
            # Get available tools
            tools = client.get_tools()
            print("Available tools:")
            for tool in tools:
                print(f"\nTool: {tool.name}")
                print(f"Description: {tool.description}")
                print(f"Required parameters: {tool.required_params}")
                
        except Exception as e:
            print(f"Error occurred: {e}")

if __name__ == "__main__":
    main() 