# DFCU Bank HR Management System

This repository contains the backend and frontend for the DFCU Bank HR Management System. The backend is powered by Node.js, Express, Prisma, and TypeScript, while the frontend uses Next.js.

## Project Overview

- **Backend**: Handles all API requests, database operations, and business logic.
- **Frontend**: Provides the user interface for interacting with the system.

Both the frontend and backend are configured with continuous integration and deployment (CI/CD) pipelines, ensuring smooth automatic deployments.

---

## Hosted Link

(API)  
https://dfcu-bank-hr-management-system-api.onrender.com/api

## How to run

To run this project on your local machine, ensure the following prerequisites are installed:

- [ ] **Node.js** installed on your computer ([MacOS](https://nodejs.org/en/download/), [Windows](https://nodejs.org/en/download/), [Linux](https://nodejs.org/en/download/))
- [ ] **PostgreSQL** database ([PostgreSQL Installation](https://www.postgresql.org/download/))
- [ ] **Git** installed on your computer

### Steps to Get Started

Use the following commands to set up the project on your local machine:

```bash
git clone https://github.com/sendistephen/dfcu-bank-hr-management-system.git
cd dfcu-bank-hr-management-system
npm install or yarn install
npm run dev

#### Create a .env file
DATABASE_URL="your_postgresql_database_url"
DATABASE_URL_UNPOOLED="uncomment next line in prisma schema if you use Prisma <5.10"
JWT_ACCESS_TOKEN_SECRET="your_jwt_secret"
PORT="your port"
ADMIN_USERNAME="your admin name"
ADMIN_PASSWORD="your passowrd"
JWT_ACCESS_TOKEN_SECRET="your secret"
JWT_REFRESH_TOKEN_SECRET="your secret"
JWT_ACCESS_TOKEN_EXPIRY="any"
JWT_REFRESH_TOKEN_EXPIRY="any"

### Other scripts and their usages
- `npm run build` is used to build the production ready version of the projects.
Used during deployment

### Create Seed file:
- `npx prisma db seed`

## Technologies

To successfully navigate the codebase of the project, you will need undertanding
of the following technologies that are being used to develop this application:

- Nodejs
- Expressjs
- Typescript
- JWT
- Prisma
- Relational Database e.g(PostgreSQL) -> Hosted or Local
```
