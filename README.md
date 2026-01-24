# Plaparsi

A minimal static site generator for [PlaceCal](https://placecal.org) partner pages.

Fetches partner information and events from the PlaceCal API and generates an accessible, single-page HTML site. Designed to run automatically via GitHub Actions and deploy to GitHub Pages.

## Quick Start

### Option A: GitHub-only (no coding required)

1. **Fork this repository** using the "Fork" button at the top right
2. **Edit `config.json`** directly on GitHub:
   - Click on `config.json`
   - Click the pencil icon to edit
   - Change `partnerId` to your PlaceCal partner ID
   - Update `title` and `description` for your site
   - Click "Commit changes"
3. **Enable GitHub Pages**:
   - Go to Settings > Pages
   - Under "Build and deployment", select "GitHub Actions"
4. **Done!** Your site will build automatically and be available at `https://yourusername.github.io/plaparsi`

The site rebuilds automatically every day at 6am UTC, or whenever you push changes.

### Option B: Local development

1. **Install Node.js** from [nodejs.org](https://nodejs.org) (download the LTS version)
2. **Clone this repository**:
   ```
   git clone https://github.com/yourusername/plaparsi.git
   cd plaparsi
   ```
3. **Edit `config.json`** with your partner details
4. **Build the site**:
   - Mac/Linux: `./build.sh`
   - Windows: `build.bat`
5. **Preview**: Open `dist/index.html` in your browser

## Configuration

Edit `config.json` to customise your site:

```json
{
  "api": {
    "endpoint": "https://placecal.org/api/v1/graphql",
    "partnerId": "244"
  },
  "site": {
    "title": "GFSC Events",
    "description": "Upcoming events from Geeks for Social Change",
    "language": "en-GB"
  },
  "events": {
    "futureDays": 90
  }
}
```

| Setting | Description |
|---------|-------------|
| `api.partnerId` | Your PlaceCal partner ID (find this in PlaceCal admin) |
| `site.title` | Page title (shown in browser tab) |
| `site.description` | Meta description for search engines |
| `site.language` | Language code (e.g., `en-GB`, `cy`) |
| `events.futureDays` | How many days ahead to fetch events (default: 90) |

## Customisation

### Styling

Edit `src/html.js` to change the CSS. The styles use [BEM naming](http://getbem.com/naming/), making them easy to understand and modify:

- `.header` - Top banner with logo and partner name
- `.about` - Partner description section
- `.events` - Events listing section
- `.event` - Individual event cards
- `.footer` - Bottom section with credits

### HTML structure

The HTML template is also in `src/html.js`. Key accessibility features:
- Skip link for keyboard users
- Semantic HTML5 elements (`<main>`, `<article>`, `<time>`)
- Proper heading hierarchy
- High contrast colours

## How it works

1. **Fetches data** from the PlaceCal GraphQL API
2. **Filters events** to show only those from your partner
3. **Generates HTML** with inline CSS (no external dependencies)
4. **Outputs** a single `dist/index.html` file

No npm packages are used - just Node.js 18+ built-in features.

## Requirements

- Node.js 18 or later (uses native `fetch`)
- A PlaceCal partner account with events

## License

MIT - see [LICENSE](LICENSE)

## Credits

Built by [Geeks for Social Change](https://gfsc.studio). Data provided by [PlaceCal](https://placecal.org).
