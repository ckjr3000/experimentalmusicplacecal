/**
 * HTML and CSS generation for PlaceCal partner sites
 */

function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatDateTime(dateStr) {
  return `${formatDate(dateStr)} at ${formatTime(dateStr)}`;
}

function formatAddress(address) {
  if (!address) return '';
  const parts = [
    address.streetAddress,
    address.addressLocality,
    address.postalCode
  ].filter(Boolean);
  return parts.join(', ');
}

function simpleMarkdown(text) {
  if (!text) return '';
  return escapeHTML(text)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\r\n/g, '\n')
    .replace(/\n\n+/g, '</p><p>')
    .replace(/\n/g, '<br>');
}

function getStyles() {
  return `
*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  color: #1a1a1a;
  background: #fafafa;
}

a {
  color: #0066cc;
}

a:hover {
  color: #004499;
}

.skip-link {
  position: absolute;
  top: -100%;
  left: 0;
  padding: 0.5rem 1rem;
  background: #1a1a1a;
  color: #fff;
  text-decoration: none;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}

.header {
  background: #2c2c2c;
  color: #fff;
  padding: 2rem 1rem;
}

.header__inner {
  max-width: 48rem;
  margin: 0 auto;
  display: flex;
  gap: 1.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.header__logo {
  max-height: 5rem;
  width: auto;
}

.header__text {
  flex: 1;
  min-width: 200px;
}

.header__title {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
}

.header__summary {
  margin: 0.25rem 0 0;
  opacity: 0.9;
  font-size: 1.1rem;
}

.header__links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.header__links a {
  color: #fff;
  opacity: 0.8;
}

.header__links a:hover {
  opacity: 1;
}

.main {
  max-width: 48rem;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.about {
  margin-bottom: 2.5rem;
}

.about__title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.75rem;
  color: #333;
}

.about__content {
  color: #333;
}

.about__content p {
  margin: 0 0 1rem;
}

.about__content p:last-child {
  margin-bottom: 0;
}

.events {
  margin-bottom: 2rem;
}

.events__title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem;
  color: #333;
}

.events__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.events__empty {
  color: #666;
  font-style: italic;
}

.event {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #ddd;
}

.event:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.event__inner {
  display: block;
}

.event__title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.25rem;
  color: #1a1a1a;
}

.event__time {
  margin: 0 0 0.5rem;
  color: #555;
  font-weight: 500;
}

.event__summary {
  margin: 0 0 0.5rem;
  color: #333;
}

.event__location {
  margin: 0 0 0.25rem;
  color: #666;
  font-size: 0.9rem;
}

.event__link {
  margin: 0.5rem 0 0;
  font-size: 0.9rem;
}

.footer {
  background: #eee;
  padding: 1.5rem 1rem;
  text-align: center;
  margin-top: 2rem;
}

.footer__text {
  margin: 0 0 0.5rem;
  color: #555;
  font-size: 0.875rem;
}

.footer__links {
  margin: 0;
  font-size: 0.875rem;
}

@media (max-width: 600px) {
  .header__inner {
    flex-direction: column;
    text-align: center;
  }

  .header__logo {
    max-height: 4rem;
  }

  .header__links {
    justify-content: center;
  }
}
`;
}

function eventHTML(event) {
  const hasEndTime = event.endDate &&
    new Date(event.endDate).toDateString() === new Date(event.startDate).toDateString();

  return `
      <li class="event">
        <article class="event__inner">
          <h3 class="event__title">${escapeHTML(event.name)}</h3>
          <p class="event__time">
            <time datetime="${event.startDate}">${formatDateTime(event.startDate)}</time>${hasEndTime ? ` - <time datetime="${event.endDate}">${formatTime(event.endDate)}</time>` : ''}
          </p>
          ${event.summary && event.summary !== event.name ? `<p class="event__summary">${escapeHTML(event.summary)}</p>` : ''}
          ${event.address ? `<p class="event__location">${escapeHTML(formatAddress(event.address))}</p>` : ''}
          ${event.publisherUrl ? `<p class="event__link"><a href="${escapeHTML(event.publisherUrl)}">More details</a></p>` : ''}
        </article>
      </li>`;
}

export function generateHTML(partner, events, siteConfig) {
  const buildDate = new Date().toISOString();
  const buildDateFormatted = formatDate(buildDate);

  const socialLinks = [];
  if (partner.url) socialLinks.push(`<a href="${escapeHTML(partner.url)}">Website</a>`);
  if (partner.instagramUrl) socialLinks.push(`<a href="${escapeHTML(partner.instagramUrl)}">Instagram</a>`);
  if (partner.facebookUrl) socialLinks.push(`<a href="${escapeHTML(partner.facebookUrl)}">Facebook</a>`);
  if (partner.twitterUrl) socialLinks.push(`<a href="${escapeHTML(partner.twitterUrl)}">Twitter</a>`);

  return `<!DOCTYPE html>
<html lang="${siteConfig.language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${escapeHTML(siteConfig.description)}">
  <meta name="generator" content="plaparsi">
  <title>${escapeHTML(siteConfig.title)}</title>
  <style>${getStyles()}</style>
</head>
<body>
  <a href="#main" class="skip-link">Skip to main content</a>

  <header class="header">
    <div class="header__inner">
      ${partner.logo ? `<img src="${escapeHTML(partner.logo)}" alt="" class="header__logo">` : ''}
      <div class="header__text">
        <h1 class="header__title">${escapeHTML(partner.name)}</h1>
        ${partner.summary ? `<p class="header__summary">${escapeHTML(partner.summary)}</p>` : ''}
        ${socialLinks.length > 0 ? `<p class="header__links">${socialLinks.join(' ')}</p>` : ''}
      </div>
    </div>
  </header>

  <main id="main" class="main">
    ${partner.description ? `
    <section class="about">
      <h2 class="about__title">About</h2>
      <div class="about__content">
        <p>${simpleMarkdown(partner.description)}</p>
      </div>
    </section>
    ` : ''}

    <section class="events">
      <h2 class="events__title">Upcoming Events</h2>
      ${events.length === 0
        ? '<p class="events__empty">No upcoming events at the moment. Check back soon!</p>'
        : `<ul class="events__list">${events.map(eventHTML).join('')}</ul>`
      }
    </section>
  </main>

  <footer class="footer">
    <p class="footer__text">
      Data from <a href="https://placecal.org">PlaceCal</a>.
      Last updated: <time datetime="${buildDate}">${buildDateFormatted}</time>
    </p>
    ${partner.url ? `<p class="footer__links"><a href="${escapeHTML(partner.url)}">Visit ${escapeHTML(partner.name)}</a></p>` : ''}
  </footer>
</body>
</html>`;
}
