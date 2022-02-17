# OffBrand Chirp

An attempt at a twitter-adjecent clone.

## Development

```sh
npx prisma db push
node --require esbuild-register prisma/seed.ts
npm run dev
```

This will generate a dev.db file, and populate it with seed data and run dev server.
