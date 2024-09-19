# intelli-casino

intelli-casino is a real-time quiz platform built with Next.js and GraphQL. It allows users to create, play, and bet on quiz games seamlessly.

## Table of Contents

- [Introduction](#introduction)
<!-- - [Features](#features) -->
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Architecture](#architecture)
- [Challenges](#challenges)
- [Contributing](#contributing)
- [License](#license)

## Introduction

intelli-casino aims to simplify the process of managing various types of games by providing a robust backend powered by GraphQL and a responsive frontend built with Next.js. It supports real-time updates, allowing spctators to monitor active games, bet on players or on the casino or create new quiz games and play them.


## Technologies Used

- **Next.js:** React framework for building server-side rendered and statically generated web applications.
- **TypeScript:** Superset of JavaScript that adds static types for improved developer experience and code reliability.
- **GraphQL:** Query language for APIs, enabling efficient data fetching and real-time updates.
- **Apollo Server:** GraphQL server implementation for handling queries, mutations, and subscriptions.
- **Tailwind CSS:** Utility-first CSS framework for rapid UI development.
- **Node.js:** JavaScript runtime built on Chrome's V8 engine for building scalable network applications.
- **PostgreSQL:** Relational database for storing game data and user information.

## Installation

Follow these steps to set up the intelli-casino project locally:

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/dmitryjum/intelli-casino.git
    ```

2. **Navigate to the Project Directory:**

    ```bash
    cd intelli-casino
    ```

3. **Install Dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

4. **Set Up Environment Variables:**

    Create a `.env.local` file in the root directory and add the following environment variables:

    ```env
    DATABASE_URL=postgres://user:password@localhost:5432/intelli-casino
    NEXT_PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4000/graphql
    ```

5. **Set Up the Database:**

    Ensure you have PostgreSQL installed and running. Then, run migrations to set up the database schema.

    ```bash
    npx prisma db push
    ```

6. **Run the Development Server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

7. **Access the Application:**

    Open [http://localhost:3000](http://localhost:3000) in your browser to view intelli-casino.

## Usage

After setting up the project, you can perform the following actions:

- **View Active Games:**
  
  Access the dashboard to see a list of all active games along with their statuses.

- **Create a New Game:**
  
  Click on the "Create Game" button, fill in the game details, and submit to add a new game to the system.

- **Manage Game Status:**
  
  Change the status of a game (OPEN, CLOSED, FINISHED) using the status control buttons.

- **Real-Time Updates:**
  
  Any changes to game statuses are updated in real-time across all connected clients.

### Example: Opening a Game via GraphQL Mutation
```
graphql
  mutation {
    openGame(gameId: "12345") {
      id
      status
      openAt
    }
  }
```

### Example: Subscribing to Active Games Updates
```
graphql
  subscription {
    activeGamesUpdated {
      id
      status
      openAt
    }
  }
```

## Architecture

Intelli Casino follows a modern web application architecture with the following components:

- **Frontend:** Built with Next.js and React, providing a responsive and interactive user interface. Tailwind CSS is used for styling, ensuring a consistent and modern design.

- **Backend:** Powered by Apollo Server with GraphQL, handling all API requests, including queries, mutations, and subscriptions. The backend interacts with a PostgreSQL database to store and retrieve game data.

- **Real-Time Communication:** Utilizes GraphQL subscriptions to push real-time updates to the frontend, ensuring that users have the most up-to-date information without needing to refresh the page.

- **State Management:** Managed through Apollo Client on the frontend, facilitating efficient data fetching and state synchronization with the backend.

## Challenges

Developing intelli-casino involved overcoming several challenges to ensure a robust and scalable solution:

- **Real-Time Data Handling:**
  
  Implementing efficient real-time updates using GraphQL subscriptions was complex. Ensuring that subscriptions scale with the number of users required careful consideration of server resources and connection management.

- **State Synchronization:**
  
  Maintaining consistent state between the client and server, especially during high-traffic periods, was challenging. Utilizing Apollo Client's caching mechanisms and optimistic UI updates helped address these issues.

- **Database Schema Design:**
  
  Designing a flexible and scalable database schema to accommodate various game types and statuses required thorough planning. Leveraging Prisma ORM facilitated easier schema migrations and interactions with the PostgreSQL database.

- **Authentication and Authorization:**
  
  Ensuring secure access to game management features involved implementing robust authentication and role-based authorization mechanisms. Integrating libraries like NextAuth.js streamlined this process.

- **Performance Optimization:**
  
  Optimizing the performance of both frontend and backend components to handle multiple concurrent users and game sessions was essential. Techniques such as code splitting, caching strategies, and efficient query handling were employed.

## Contributing

Contributions are welcome! To get started, follow these steps:

1. **Fork the Repository.**

2. **Create a New Branch:**

    ```bash
    git checkout -b feature/YourFeature
    ```

3. **Make Your Changes and Commit Them:**

    ```bash
    git commit -m "Add some feature"
    ```

4. **Push to the Branch:**

    ```bash
    git push origin feature/YourFeature
    ```

5. **Open a Pull Request.**

Please ensure your code follows the project's coding standards and passes all tests.

## License

This project is licensed under the [MIT License](LICENSE).
