# UrbanStep Shoes

[cloudflarebutton]

A full-stack web application built with Cloudflare Workers, featuring a modern React frontend with shadcn/ui components, Tailwind CSS, and Durable Objects for scalable, multi-tenant data storage. This demo showcases users, chat boards, and real-time messaging with indexed entity listing, concurrent-safe mutations, and production-ready patterns.

## Features

- **Serverless Backend**: Cloudflare Workers with Hono routing and custom Durable Objects for entity storage (Users, Chats, Messages).
- **Indexed Entities**: Automatic indexing for efficient listing/pagination with cursors.
- **Concurrent Safety**: CAS-based optimistic updates with bounded retries.
- **Modern UI**: React 18, TypeScript, shadcn/ui, Tailwind CSS, dark mode, responsive design.
- **State Management**: TanStack Query for data fetching, caching, and mutations.
- **Demo Data**: Seeded mock users, chats, and messages on first access.
- **Error Handling**: Global error boundaries, client error reporting to API.
- **Development Tools**: Vite for fast HMR, Bun for package management, Wrangler for deployment.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Lucide React, TanStack Query, React Router, Framer Motion, Sonner (toasts).
- **Backend**: Cloudflare Workers, Hono, Durable Objects (custom multi-entity storage).
- **Data**: Typed entities with versioning, prefix indexes, transactional batches.
- **Tools**: Bun, Wrangler, ESLint, TypeScript (strict mode).

## Prerequisites

- [Bun](https://bun.sh/) installed (≥1.0).
- [Cloudflare Account](https://dash.cloudflare.com/) with Workers enabled.
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-update/) (installed via `bunx wrangler` or globally).

## Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   bun install
   ```
3. (Optional) Generate Worker types:
   ```bash
   bun run cf-typegen
   ```

## Development

1. Start the development server:
   ```bash
   bun dev
   ```
   - Frontend: http://localhost:3000 (Vite).
   - Backend: Automatically deployed to preview Worker (Wrangler handles proxying).

2. Edit frontend in `src/` and backend routes in `worker/user-routes.ts` (auto-reloads).

3. Seed data automatically loads on first API calls (e.g., `/api/users`).

## Usage Examples

### API Endpoints

All endpoints under `/api/`:

- `GET /api/users?cursor=&limit=10` - List users (paginated).
- `POST /api/users` - Create user `{ "name": "John" }`.
- `DELETE /api/users/:id` - Delete user.
- `POST /api/users/deleteMany` - Bulk delete `{ "ids": ["id1", "id2"] }`.

- `GET /api/chats?cursor=&limit=10` - List chats.
- `POST /api/chats` - Create chat `{ "title": "My Chat" }`.
- `GET /api/chats/:chatId/messages` - List messages.
- `POST /api/chats/:chatId/messages` - Send message `{ "userId": "u1", "text": "Hello" }`.

- `GET /api/health` - Health check.
- `POST /api/client-errors` - Report frontend errors.

Use `src/lib/api-client.ts` for typed fetches:
```ts
import { api } from '@/lib/api-client';

const users = await api<User[]>('/api/users');
```

### Frontend Customization

- Replace `src/pages/HomePage.tsx` with your app.
- Use `AppLayout` for sidebar layout: `import { AppLayout } from '@/components/layout/AppLayout'`.
- Theme toggle: `useTheme()` hook.
- Components: All shadcn/ui primitives available in `src/components/ui/`.

## Build & Preview

```bash
bun run build    # Build frontend assets
bun run preview  # Local preview server
```

## Deployment

1. Login to Cloudflare:
   ```bash
   wrangler login
   ```

2. Deploy:
   ```bash
   bun run deploy
   ```
   - Builds frontend, bundles Worker, deploys to your Cloudflare account.
   - Assets served via SPA mode (single-page-application).
   - Durable Objects auto-migrate via `wrangler.jsonc`.

[cloudflarebutton]

**Note**: Update `wrangler.jsonc` for custom domains/bindings. Preview deployments use your account's default zone.

## Project Structure

```
├── shared/          # Shared types & mocks
├── src/             # React frontend (Vite)
├── worker/          # Cloudflare Worker (Hono + DOs)
├── wrangler.jsonc   # Deployment config
└── package.json     # Bun workspaces
```

## Contributing

1. Fork & PR.
2. Follow TypeScript strict mode, ESLint rules.
3. Add tests if extending core utils (`worker/core-utils.ts` - DO NOT MODIFY).
4. Update `worker/entities.ts` & `worker/user-routes.ts` for new entities/routes.

## License

MIT. See [LICENSE](LICENSE) for details.

---

⭐ &nbsp; Star on GitHub &middot; 🐙 &nbsp; [Issues](https://github.com/yourusername/urbanstep-shoes-ugq2epa5v0ovduo6en-e0/issues) &middot; 💬 &nbsp; [Discussions](https://github.com/yourusername/urbanstep-shoes-ugq2epa5v0ovduo6en-e0/discussions)