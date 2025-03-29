import logging
from my_mcp_module.mcp_client import MCPClient

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    # Create an MCP client instance with a specific session ID
    session_id = "6b7f3bf5-ee3a-4a12-8429-d3f754950924"
    
    logger.info(f"Starting test with session ID: {session_id}")
    
    client = MCPClient(session_id=session_id)
    try:
        # Get available tools
        tools = client.get_tools()
        logger.info("Successfully retrieved tools:")
        
        for tool in tools:
            logger.info(f"\nTool: {tool.name}")
            logger.info(f"Description: {tool.description}")
            logger.info(f"Parameters: {tool.parameters}")
            logger.info(f"Required parameters: {tool.required_params}")
            
    except Exception as e:
        logger.error(f"Error occurred: {str(e)}", exc_info=True)
        raise

if __name__ == "__main__":
    main() 