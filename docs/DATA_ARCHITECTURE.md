# Data Persistence Architecture

## Overview

The Nexus app now uses a hybrid data persistence architecture that combines **Supabase** (cloud) with **SQLite** (local) for offline-first functionality.

## Architecture Components

### 1. Supabase (Primary Storage)
- Cloud-based PostgreSQL database
- Row Level Security (RLS) for data isolation
- Real-time subscriptions
- Multi-device synchronization

### 2. SQLite (Local Fallback)
- Offline-first capability
- Fast local queries
- Cache layer for Supabase data
- Queue for offline operations

### 3. Data Services (`/lib/data/`)
- **supabase.service.ts**: Direct Supabase operations
- **sqlite.service.ts**: Local database operations (TODO)
- **sync.service.ts**: Synchronization logic (TODO)

### 4. Custom Hooks (`/hooks/data/`)
- **useAccounts()**: Manage accounts data
- **useTransactions()**: Manage transactions (TODO)
- More hooks for each entity

## Using the Data Hooks

### Example: useAccounts

```typescript
import { useAccounts } from '@/hooks/data/useAccounts';

function MyComponent() {
  const {
    accounts,        // Account[]
    summary,         // AccountSummary | null
    recentTransactions, // AccountTransaction[]
    isLoading,       // boolean
    error,           // Error | null
    addAccount,      // (account) => Promise<void>
    updateAccount,   // (id, updates) => Promise<void>
    deleteAccount,   // (id) => Promise<void>
    refresh          // () => Promise<void>
  } = useAccounts();

  // Handle loading state
  if (isLoading) return <Loader />;

  // Handle error state
  if (error) return <ErrorMessage error={error} />;

  // Handle empty state
  if (accounts.length === 0) return <EmptyState />;

  // Render data
  return <AccountsList accounts={accounts} />;
}
```

## Database Schema

### Accounts Table
```sql
CREATE TABLE accounts (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  balance DECIMAL(15, 2),
  ...
);
```

See `supabase/migrations/20260127_money_module_schema.sql` for full schema.

## Environment Variables

Add to `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

## Migration from Mock Data

### Before
```typescript
import { mockAccountsData } from '../data/mockAccountsData';

function Accounts() {
  const data = mockAccountsData;
  return <div>{data.accounts.map(...)}</div>;
}
```

### After
```typescript
import { useAccounts } from '@/hooks/data/useAccounts';

function Accounts() {
  const { accounts, isLoading, error } = useAccounts();
  
  if (isLoading) return <Loader />;
  if (error) return <Error />;
  if (accounts.length === 0) return <EmptyState />;
  
  return <div>{accounts.map(...)}</div>;
}
```

## Creating New Hooks

Follow this pattern for other entities:

1. **Define types** in `/modules/[module]/types/`
2. **Create Supabase service** in `/lib/data/supabase.service.ts`
3. **Create custom hook** in `/hooks/data/use[Entity].ts`
4. **Create form component** in `/modules/[module]/components/forms/`
5. **Create empty state** in `/modules/[module]/components/empty-states/`
6. **Update screen** to use the hook

## Next Steps

1. ✅ Accounts (DONE)
2. ⏳ Transactions
3. ⏳ Budget
4. ⏳ Cards
5. ⏳ Subscriptions
6. ⏳ Debts
7. ⏳ Investments
8. ⏳ Financial Goals

## Offline Support (TODO)

SQLite integration for offline-first:
- Local cache of Supabase data
- Offline queue for write operations
- Automatic sync when online
- Conflict resolution

## Testing

1. **Create account**: Click "Nova Conta" → Fill form → Save
2. **View accounts**: Data loads from Supabase
3. **Empty state**: Delete all accounts to see empty state
4. **Error handling**: Disconnect internet to test error state

## Troubleshooting

### "Missing Supabase environment variables"
- Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to `.env`

### "User not authenticated"
- Implement authentication flow
- User must be logged in to create/view data

### "Permission denied"
- Check RLS policies in Supabase
- Ensure user_id matches authenticated user
