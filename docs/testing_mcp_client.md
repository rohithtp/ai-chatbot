# Testing the MCP Client

This document provides step-by-step instructions for testing the MCP client implementation.

## Prerequisites

1. Ensure you have Python 3.8+ installed
2. Make sure the MCP server is running locally on port 3000
3. Install `uv` (the fast Python package installer):
   ```bash
   # On macOS/Linux using Homebrew
   brew install uv

   # Using pip
   pip install uv

   # On other systems, see: https://github.com/astral-sh/uv
   ```

## Virtual Environment Setup

1. Create and activate a virtual environment using `uv`:
   ```bash
   # Create a new virtual environment
   uv venv .venv

   # Activate the virtual environment
   # On macOS/Linux:
   source .venv/bin/activate
   # On Windows:
   .venv\Scripts\activate
   ```

2. Install dependencies using `uv`:
   ```bash
   # For basic usage (install only required packages)
   uv pip install -r python_modules/my_mcp_module/requirements.txt

   # For development (install all development tools)
   uv pip install -r python_modules/my_mcp_module/requirements-dev.txt

   # For development, also install the package in editable mode
   uv pip install -e python_modules/my_mcp_module
   ```

## Environment Setup

1. Create or update your `.env` file in the project root with the following configuration:
   ```
   MCP_SERVER_URL=http://localhost:3000
   ```

## Running the Tests

1. Navigate to the project root directory:
   ```bash
   cd /path/to/ai-chatbot
   ```

2. Ensure your virtual environment is activated:
   ```bash
   # Check if virtual environment is active (should show python from .venv)
   which python
   ```

3. Run the test script:
   ```bash
   # Basic test run
   python test_mcp_client.py

   # With increased logging level
   python -W ignore test_mcp_client.py
   ```

## Expected Behavior

The test script will:
1. Initialize an MCP client with a new session ID
2. Connect to the SSE stream for real-time updates
3. Send an initialize request with protocol version and capabilities
4. Send an initialized notification
5. Attempt to retrieve the list of available tools
6. Properly close the connection

## Development Tips

1. **Fast Package Updates**
   ```bash
   # Update single package
   uv pip install --upgrade package-name

   # Update all packages (basic requirements)
   uv pip install --upgrade -r requirements.txt

   # Update all packages (including dev requirements)
   uv pip install --upgrade -r requirements-dev.txt
   ```

2. **Managing Virtual Environment**
   ```bash
   # Deactivate virtual environment when done
   deactivate

   # Remove virtual environment if needed
   rm -rf .venv

   # Create a fresh environment with only production dependencies
   uv venv .venv && source .venv/bin/activate && uv pip install -r requirements.txt

   # Create a fresh environment with development dependencies
   uv venv .venv && source .venv/bin/activate && uv pip install -r requirements-dev.txt
   ```

3. **Type Checking**
   ```bash
   # Run mypy type checker
   mypy python_modules/my_mcp_module/src

   # Run type checker with strict mode
   mypy --strict python_modules/my_mcp_module/src
   ```

   Note: Type checking for `python-dotenv` is currently limited as type stubs are not available.
   You may see some type-related warnings which can be safely ignored for this package.

4. **Package Compatibility**
   - Core dependencies are kept minimal for production use
   - Development tools are separated in requirements-dev.txt
   - Type checking is supported for most packages except python-dotenv
   - All package versions are pinned to ensure compatibility

## Troubleshooting

If you encounter any issues:

1. **408 Request Timeout**
   - Verify that the MCP server is running and accessible
   - Check the server logs for any connection issues
   - Ensure the SSE connection is established before sending requests

2. **404 Not Found**
   - Confirm the correct server URL in your `.env` file
   - Verify that all endpoints are properly configured on the server

3. **Connection Issues**
   - Check your network connectivity
   - Verify that no firewall rules are blocking the connection
   - Ensure the server is accepting connections on the specified port

4. **Virtual Environment Issues**
   - Ensure you're using the correct Python version
   - Try recreating the virtual environment if packages are conflicting
   - Check that all dependencies are properly installed with `uv pip list`

## Logging

The MCP client uses Python's built-in logging module. To see detailed logs during testing:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Test Output Examples

### Successful Test
```
INFO:my_mcp_module.mcp_client:Initialized MCP client with server URL: http://localhost:3000 and session ID: [UUID]
INFO:my_mcp_module.mcp_client:Updated session ID to: [NEW_UUID]
INFO:my_mcp_module.mcp_client:Connection initialized successfully
INFO:my_mcp_module.mcp_client:Successfully retrieved tools list
```

### Failed Test
```
ERROR:my_mcp_module.mcp_client:Failed to establish SSE connection
ERROR:my_mcp_module.mcp_client:Timed out waiting for response
```

## Contributing

When making changes to the MCP client:
1. Update the tests to cover new functionality
2. Run the test suite before submitting changes
3. Document any new test cases or requirements
4. Ensure all tests pass in a clean virtual environment 