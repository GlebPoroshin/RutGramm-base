# GeoChat Test Frontend

This is a simple React application created to test the GeoChat backend services. It provides a user interface to interact with the auth, user, and chat services through the API gateway.

## Features

- **Authentication**
  - User Registration
  - Email Verification
  - Login
  - Password Reset

- **User Management**
  - View User Profile
  - Update User Profile
  - Search Users

- **Chat Functionality**
  - Create New Chats
  - Send/Receive Messages
  - Real-time Updates via WebSocket

## Setup and Running

1. Make sure the GeoChat backend services are running:
   - API Gateway
   - Auth Service
   - User Service
   - Chat Service

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

4. The application will be available at http://localhost:3000

## Configuration

The API endpoint is configured in `src/api/axios.ts`. By default, it points to `http://localhost:8080`, which is the default port for the API gateway service. If your gateway is running on a different port, please update this value.

## Testing the Backend

This application provides the following test scenarios:

1. **Authentication Flow**
   - Register a new account
   - Verify your email with the code
   - Login with your credentials

2. **User Management**
   - Update your profile
   - Search for other users

3. **Messaging**
   - Create chats with other users
   - Send and receive messages
   - Test real-time updates

## Technologies Used

- React
- TypeScript
- React Router
- Axios
- Bootstrap

## Project Structure

- `src/api/` - API services and interfaces
- `src/components/` - Reusable UI components
- `src/contexts/` - React context providers
- `src/pages/` - Page components
