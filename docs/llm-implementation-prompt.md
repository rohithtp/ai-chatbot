# LLM Prompt for AppStore Implementation

```
I need you to help me implement the "AppStore for Agents" feature in our NextJS React application. This feature allows users to browse and install curated MCP Servers. Here are the specific requirements:

## Feature Overview
- Create a new feature in the existing branch called `appstore`
- Add an "App Store" link in the top navigation bar (visible only to logged-in users)
- Implement a grid-based interface showing available MCP Servers as cards
- Allow users to install servers, which adds them to their user-specific config.json file

## Technical Details
1. Navigation Component:
   - Modify the existing navigation bar to include the "App Store" link
   - Link should navigate to the `/appstore` route
   - Use authentication context to ensure visibility only for logged-in users

2. AppStore Page:
   - Create a new page component at `pages/appstore.js` or `app/appstore/page.js` (depending on our NextJS version)
   - Implement a responsive grid layout for server cards
   - Include search and filtering functionality

3. Server Card Component:
   - Display server name, description, and image
   - Include an "Install" button that changes to "Installed" after installation
   - Handle installation status based on user's current configuration

4. Installation Logic:
   - Create an API endpoint for installing servers
   - Update the user's config.json with the new server details
   - Ensure proper error handling and success notifications

5. Data Management:
   - Fetch the curated list of servers from our backend
   - Track user-specific installations in their config
   - Implement user isolation for security

## Design Requirements
- Follow our application's existing design system
- Create a modern, card-based grid layout similar to application marketplaces
- Use appropriate loading states and transitions
- Implement responsive design for all screen sizes

Please provide the necessary components, API endpoints, and styling to implement this feature. Include comments explaining your implementation decisions and any potential edge cases that should be considered.
```