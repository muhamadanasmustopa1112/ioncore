# ION Broadband

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- Npm or Yarn
- Tailwind CSS 4.x
- React 19.x
- Next.js 15.3.x
- PostgreSQL 17.4.x

### Installation

To set up the project dependencies, use the `--force` flag to resolve any dependency conflicts:

```bash
npm install --force
```

### Database Deployment

This will create the necessary tables in database for user authorization and user management apps:

```bash
npx prisma db push
```

Once your schema is deployed, you need to generate the Prisma Client:

```bash
npx prisma generate
```

### Development

Start the development server:

```bash
npm run dev
```

### Setting Up the Demo Layout

Open `app/(protected)/layout.tsx` and change `Demo1Layout` to any demo, for example, `Demo5Layout` and you will switch entire app layout to the selected demo.

```bash
<Demo5Layout>
	{children}
</Demo5Layout>
```
