# Art Intelligence

An AI-powered art analysis platform that provides insights into artwork styles, periods, and connections.

## Features

- Upload artwork images for AI analysis
- Get detailed insights about artistic style and period
- Visualize connections between artworks, artists, and movements
- Interactive force-directed graph visualization
- Dark mode support

## Tech Stack

- Frontend: React + TypeScript + Vite
- Backend: Express.js
- Database: PostgreSQL with Drizzle ORM
- AI: Google's Generative AI
- Visualization: D3.js
- Styling: Tailwind CSS + Radix UI

## Prerequisites

- Node.js 20+
- PostgreSQL 16+
- Environment variables:
  - `DATABASE_URL`: PostgreSQL connection string
  - (Additional environment variables to be configured)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd art-intelligence
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type check with TypeScript

## Project Structure

```
art-intelligence/
├── client/           # Frontend code
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   └── pages/
├── server/           # Backend code
├── db/               # Database schema and migrations
└── public/          # Static assets
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
