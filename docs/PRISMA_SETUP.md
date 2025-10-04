# Prisma Setup Guide

## Installation

```bash
pnpm add prisma @prisma/client
pnpm add -D prisma
```

## Initialize Prisma (if needed)

```bash
pnpm prisma init
```

## Development Workflow

### 1. Local Development (without Supabase)
```bash
# Use local PostgreSQL or SQLite for development
DATABASE_URL="file:./dev.db"  # SQLite
# OR
DATABASE_URL="postgresql://user:pass@localhost:5432/glamease"  # Local PostgreSQL
```

### 2. Generate Prisma Client
```bash
pnpm prisma generate
```

### 3. Create and Apply Migrations
```bash
pnpm prisma migrate dev --name init
```

### 4. Seed Database (optional)
```bash
pnpm prisma db seed
```

### 5. View Database
```bash
pnpm prisma studio
```

## Supabase Integration (when ready)

### 1. Get Supabase Credentials
- Create project at https://supabase.com
- Go to Settings > Database
- Copy connection string

### 2. Update Environment Variables
```bash
# Replace in .env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

### 3. Deploy Schema to Supabase
```bash
pnpm prisma db push
```

## Key Files Created

- `prisma/schema.prisma` - Database schema
- `lib/prisma.js` - Singleton client instance
- `lib/db-service.js` - Database operations
- `.env.example` - Environment template

## Usage in API Routes

```javascript
import { userService, bookingService } from '@/lib/db-service';

// Create user
const user = await userService.create({
  email: 'user@example.com',
  name: 'John Doe',
  role: 'CLIENT'
});

// Create booking
const booking = await bookingService.create({
  clientId: user.id,
  providerId: 'provider_id',
  serviceId: 1,
  bookingDate: new Date(),
  bookingTime: new Date(),
  amount: 3500,
  commission: 525,
  providerEarning: 2975,
  pointsEarned: 35
});
```

## Benefits

1. **Singleton Pattern**: Prevents multiple Prisma instances
2. **Type Safety**: Full TypeScript support
3. **Migration System**: Version-controlled schema changes
4. **Service Layer**: Clean separation of concerns
5. **Supabase Ready**: Easy migration when credentials available

## Development Tips

- Use `prisma studio` to view/edit data
- Run `prisma generate` after schema changes
- Use `prisma db push` for quick prototyping
- Use `prisma migrate dev` for production-ready migrations