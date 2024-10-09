# DFCU Bank HR Management System

This repository contains the backend and frontend for the DFCU Bank HR Management System. The backend is powered by Node.js, Express, Prisma, and TypeScript, while the frontend uses Next.js.

[Backend API](https://dfcu-bank-hr-management-system-api.onrender.com/api)
[Frontend](https://dfcu-bank-hr-management-system.vercel.app/)

## Project Overview

- **Backend**: Built with Node.js, Express, Prisma, and TypeScript.
- **Frontend**: Developed using Next.js version 14 with TypeScript and Tailwind CSS.
- **Package Management**: Yarn Workspaces, allowing centralized dependency management.
- **CI/CD:** GitHub Actions for continuous integration and deployment.

### Prerequisites

Before proceeding, ensure the following tools are installed on your local machine:

- Node.js
- PostgreSQL
- Git
- Yarn

## Repository Setup

Clone the repository and navigate into the project directory:

```
git clone https://github.com/sendistephen/dfcu-bank-hr-management-system.git
cd dfcu-bank-hr-management-system
```

### Environment Configuration
Create a .env file in the backend and frontend directories with the following environment variables:

##### Backend .env:
```
DATABASE_URL='your database url'
DATABASE_URL_UNPOOLED='your database url unpooled from neon db'
PORT=8900
ADMIN_USERNAME="your admin username"
ADMIN_PASSWORD="your admin password"
JWT_ACCESS_TOKEN_SECRET='your access token secret'
JWT_REFRESH_TOKEN_SECRET='your refresh token secret'
JWT_ACCESS_TOKEN_EXPIRY='your access token expiry'    
JWT_REFRESH_TOKEN_EXPIRY='your refresh token expiry'
```

##### Frontend .env:
```
NEXT_PUBLIC_API_URL="http://localhost:8900/api"
NEXTAUTH_SECRET="your_nextauth_secret"
```
Replace placeholder values with actual values relevant to your environment.

Use the following command to install dependencies for both backend and frontend concurrently:
``
yarn install
``
## Database Setup
1.	**Prisma Migration:** Run the following commands in the backend directory to apply database migrations:
```
cd backend
yarn migrate
```
2.**Seed Database:** Populate the database with initial data (required for admin login):
```
yarn seed
```

#### Running the Backend Locally
1. Navigate to the backend directory:
```bash
cd backend
```
2. Start the backend server in development mode:
```bash
yarn dev
```
#### Running the Frontend Locally
1. Navigate to the frontend directory:
```bash
cd frontend
```
2.	Start the frontend server in development mode:
```bash
yarn dev
```
The backend will run on http://localhost:8900, and the frontend will be accessible at http://localhost:3000.


### Deployment
This project uses Render for backend hosting and Vercel for the frontend.

#### Deploying the Backend to Render
1.	Create a New Web Service:
- Go to the Render dashboard.
- Create a new Web Service and link it to the repository.
- Set the build and start commands:
  - **Build Command:** yarn install && yarn workspace backend build
  - **Start Command:** yarn workspace backend start

2.	Environment Variables: Set the environment variables in Render’s dashboard using the values from your .env file.
3.	Database Configuration: Ensure that the DATABASE_URL in the environment variables points to your hosted PostgreSQL database.

#### Deploying the Frontend to Vercel
1.	Create a New Vercel Project:
	+ Go to the Vercel dashboard.
	+ Import the frontend folder from the repository.
2.	Environment Variables: Set the environment variables in Vercel using the values from your .env file.
3.	Build and Deployment:
	+ Vercel will automatically build and deploy your Next.js application.
	+ Ensure the API URL points to the Render-hosted backend.

#### CI/CD Setup with GitHub Actions
The repository includes GitHub Actions for automating deployment:

##### Backend CI/CD (.github/workflows/backend-deploy.yml):
```yaml
# .github/workflows/backend-ci-cd.yml

name: Backend CI/CD Pipeline

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
      - develop

jobs:
  ci:
    name: Continuous Integration and Deployment
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v3

      - name: Set Up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install Dependencies
        run: yarn install

      - name: Run ESLint for Backend
        run: yarn workspace backend lint

      - name: Build the Backend
        run: yarn workspace backend build

      - name: Push Prisma Schema and Seed Data
        if: github.ref == 'refs/heads/main'
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
        run: |
          yarn workspace backend prisma generate
          yarn workspace backend prisma db push
          yarn workspace backend seed

      - name: Deploy to Render
        if: github.ref == 'refs/heads/main' && success()
        env:
          DEPLOY_URL: ${{ secrets.RENDER_DEPLOY_HOOK_URL }}
        run: |
          curl -X POST "$DEPLOY_URL" -H "Content-Type: application/json" -d '{"trigger": "ci-cd"}'

```
#### Frontend CI/CD (.github/workflows/frontend-deploy.yml):
```yaml
name: Frontend CI/CD

on:
  push:
    branches:
      - main
      - develop
  pull_request:
    branches:
      - main
      - develop

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'

      - name: Install dependencies
        run: yarn workspace frontend install

      - name: Lint code
        run: yarn workspace frontend lint

      - name: Build frontend
        run: yarn workspace frontend build

      - name: Deploy to Vercel
        run: npx vercel --token ${{ secrets.VERCEL_TOKEN }} --prod
        working-directory: frontend
```

##### Overview of CI/CD
**Backend Workflow:** Checks out code, installs dependencies, runs linting, builds the backend, applies Prisma migrations, and triggers a Render deployment.
**Frontend Workflow:** Checks out code, installs dependencies, runs linting, builds the frontend, and deploys it to Vercel.

##### Secrets Management
**Secrets Setup:** Store sensitive information like DATABASE_URL, RENDER_DEPLOY_HOOK_URL, VERCEL_PROJECT_ID,VERCEL_ORG_ID,RENDER_SERVICE_ID & VERCEL_TOKEN in GitHub secrets under the repository’s settings.

#### Post-Deployment
After deployment, ensure:

- The frontend URL points to the correct backend API.
- Monitor logs on Render and Vercel for any issues.
- Test authentication flows and cron job functionality.
