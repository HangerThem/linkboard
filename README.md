# LinkBoard

![GitHub Repo Size](https://img.shields.io/github/repo-size/hangerthem/linkboard)
![GitHub Issues](https://img.shields.io/github/issues/hangerthem/linkboard)
![GitHub Stars](https://img.shields.io/github/stars/hangerthem/linkboard)
![GitHub Forks](https://img.shields.io/github/forks/hangerthem/linkboard)

LinkBoard is a self-hosted web application that allows you to create a personalized link board to share your important links with others. Built with Next.js 16 and Prisma, it features a visual editor for easy customization.

## Features

- **Visual Editor**: Edit your profile, links, and settings through an intuitive web interface (development mode)
- **Profile Management**: Customize your name, bio, and avatar
- **Two Link Types**:
  - **Top Links**: Icon-only social links displayed prominently
  - **Normal Links**: Full links with titles, icons, and optional grouping
- **Link Groups**: Organize your links into collapsible groups
- **Drag & Drop**: Reorder links and groups with ease
- **Multiple Themes**: Choose from `default`, `dark`, `light`, or `neo-brutalism`
- **Density Settings**: Adjust link spacing (compact, comfortable, spacious)
- **Share Bar**: Built-in social sharing functionality
- **Responsive Design**: Works seamlessly on all screen sizes
- **SQLite Database**: Simple, file-based database with Prisma ORM

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Styling**: Tailwind CSS 4
- **Forms**: React Hook Form + Zod validation
- **Icons**: React Bootstrap Icons
- **Animations**: Motion (Framer Motion)
- **Drag & Drop**: SortableJS

## Installation

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Setup

1. Clone this repository:

```bash
git clone https://github.com/hangerthem/LinkBoard.git
cd LinkBoard
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up the database:

```bash
pnpm prisma migrate dev
```

4. (Optional) Seed the database with sample data:

```bash
pnpm prisma db seed
```

5. Start the development server:

```bash
pnpm dev
```

6. Visit `http://localhost:3000` to see your LinkBoard

## Usage

### Development Mode

In development mode, you'll see an editor button (pencil icon) in the bottom-right corner. Click it to access the visual editor where you can:

- **Profile Tab**: Update your name, bio, and upload an avatar
- **Top Links Tab**: Add/edit icon-only social links
- **Normal Links Tab**: Add/edit links with titles and organize them into groups
- **Settings Tab**: Change theme, density, and toggle features

### Single Mode (Production)

Set the environment variable to run in single/production mode:

```bash
LINKBOARD_MODE=single
```

In this mode, the editor is disabled and only the public LinkBoard is displayed.

### Environment Variables

| Variable         | Description                       | Default         |
| ---------------- | --------------------------------- | --------------- |
| `LINKBOARD_MODE` | Set to `single` to disable editor | -               |
| `DATABASE_URL`   | SQLite database path              | `file:./dev.db` |

## Project Structure

```
├── app/                   # Next.js App Router
│   ├── page.tsx           # Main LinkBoard page
│   ├── (editor)/          # Editor routes (dev only)
│   └── api/               # API routes for saving data
├── components/            # React components
│   ├── forms/             # Form components for editor
│   ├── links/             # Link display components
│   ├── modal/             # Modal components
│   └── ui/                # Reusable UI components
├── prisma/                # Prisma schema & migrations
├── themes/                # CSS theme files
└── types/                 # TypeScript type definitions
```

## Themes

LinkBoard includes 4 built-in themes:

- `default` - Clean, modern design
- `dark` - Dark mode theme
- `light` - Light mode theme
- `neo-brutalism` - Bold, brutalist design

Themes are defined in the `themes/` directory and can be customized or extended.

## Database Schema

- **Profile**: Name, bio, avatar
- **TopLink**: Icon-only links (social icons)
- **NormalLink**: Full links with title, URL, icon, and optional group
- **LinkGroup**: Groups for organizing normal links
- **Setting**: Theme, density, share bar, and source visibility

## Deployment

### Build for Production

```bash
pnpm build
pnpm start
```

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hangerthem/linkboard)

> **Note**: For Vercel deployment, you may need to configure a persistent database solution as SQLite files are ephemeral on serverless platforms.

## Contributing

I welcome contributions from the community. If you'd like to contribute to this project, please follow the [Contribution Guidelines](CONTRIBUTING).

## License

This project is licensed under the AGPLv3 License. For more information, please refer to the [LICENSE](LICENSE) file.

## Contact

- **Frank Borisjuk**
  - Email: [f.borisjuk@hangerthem.com](mailto:f.borisjuk@hangerthem.com)

Feel free to reach out if you have any questions, suggestions, or need assistance.

_Happy LinkBoarding!_
