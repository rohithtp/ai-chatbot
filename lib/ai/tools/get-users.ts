import { tool } from 'ai';
import { z } from 'zod';

export const getUsers = tool({
  description: 'Get the list of users from the local API',
  parameters: z.object({}),
  execute: async () => {
    const response = await fetch('http://localhost:8800/users/user');
    const usersData = await response.json();
    return usersData;
  },
}); 