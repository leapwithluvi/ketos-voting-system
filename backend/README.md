# Voting Backend

Backend API untuk sistem voting kandidat.  
Dibangun menggunakan **Express.js**, **TypeScript**, **Prisma**, dan **MongoDB**.

## Prerequisites

- Node.js (v16 atau higher)  
- MongoDB Atlas atau local MongoDB  
- npm  

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
   - Copy the example environment file:
     ```bash
     cp .env.example .env
     ```

   - Update the `.env` file with your configuration:
   ``` bash
    DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/dbname"
    FE_URL="http://localhost:3000"
    PORT=5000
    NODE_ENV="development"
    SESSION_SECRET="secret-key"
     ```

4. **Database Setup with Prisma**
``` bash
# Generate Prisma client
npm run prisma:generate

# Seed the database (optional)
npm run seed
```

## Development

Start the development server:
```bash
npm run dev
```
The server will run on `http://localhost:3000` (or your configured PORT).

## Technologies

- **Node.js & Express.js** – Backend server  
- **TypeScript** – Strongly typed language support  
- **Prisma** – ORM for relational database  
- **MongoDB & Mongoose** – NoSQL database  
- **Multer** – File upload (candidate photo)  
- **bcrypt** – Password hashing  
- **express-session** – Session management  
- **dotenv** – Environment configuration  
- **ESLint & Prettier** – Linting and code formatting  

## Available Scripts
Update this going on
- `npm run dev` – Start development server with hot reload using nodemon  
- `npm run start` – Start production server (after build)  
- `npm run build` – Compile TypeScript to JavaScript  
- `npm run prisma:generate` – Generate Prisma client  
- `npm run seed` – Seed initial database data  
- `npx prisma studio` – Open Prisma Studio database browser  
- `npm run check-db` – Check database connection

## Features
- Authentication & Authorization
    - User login & logout
    - Session validation with express-session

- Voting
    - Vote for candidates
    - Prevent multiple votes by the same user

- Candidates
    - CRUD operations (Create, Read, Update, Delete)
    - File upload (candidate photo) using Multer

- Database
    - Prisma for relational data
    - MongoDB for users & votes


## API Endpoints

### Auth

| Method | Endpoint        | Access | Description  |
|--------|-----------------|--------|--------------|
| POST   | `/auth/login`   | Public | User/Admin login |
| POST   | `/logout`       | Auth   | Logout current user |

---

### Candidates

| Method | Endpoint            | Access | Description |
|--------|---------------------|--------|-------------|
| GET    | `/candidates`       | Public | Get all candidates |
| GET    | `/candidates/:id`   | Admin  | Get candidate by ID |
| POST   | `/candidates`       | Admin  | Create candidate (with photo upload) |
| PATCH  | `/candidates/:id`   | Admin  | Update candidate (with optional new photo) |
| DELETE | `/candidates/:id`   | Admin  | Delete candidate |

---

### Votes

| Method | Endpoint          | Access | Description |
|--------|------------------|--------|-------------|
| POST   | `/vote`          | Auth   | Vote for a candidate |
| GET    | `/vote`          | Admin  | Get all votes (admin only) |
| GET    | `/vote/:id`      | Admin  | Get vote by ID |
| DELETE | `/vote/:id`      | Admin  | Delete a vote |

---

### Results

| Method | Endpoint    | Access | Description |
|--------|-------------|--------|-------------|
| GET    | `/results`  | Admin  | Get real-time voting results |