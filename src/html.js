/**
 * HTML and CSS generation for PlaceCal partner sites
 */

function escapeHTML(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateTime(dateStr) {
  return `${formatDate(dateStr)} at ${formatTime(dateStr)}`;
}

function formatAddress(address) {
  if (!address) return "";
  const parts = [
    address.streetAddress,
    address.addressLocality,
    address.postalCode,
  ].filter(Boolean);
  return parts.join(", ");
}

function simpleMarkdown(text) {
  if (!text) return "";
  return escapeHTML(text)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/\r\n/g, "\n")
    .replace(/\n\n+/g, "</p><p>")
    .replace(/\n/g, "<br>");
}

/**
 * SVG icons from Lucide (https://lucide.dev)
 * License: ISC License
 */
const icons = {
  website:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
  instagram:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>',
  facebook:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
  twitter:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>',
  // Placeholder for future icons
  youtube:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>',
  linkedin:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>',
  email:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  phone:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  mastodon:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21.58 13.913c-.29 1.469-2.592 3.121-5.238 3.396-1.379.184-2.737.368-4.185.276-2.368-.092-4.237-.551-4.237-.551 0 .184.014.459.043.643.308 2.294 2.317 2.478 4.22 2.57 1.922.092 3.635-.46 3.635-.46l.079 1.653s-1.344.734-3.738.918c-1.32.091-2.96-.092-4.869-.551-4.14-1.102-4.853-5.507-4.961-10.005-.032-1.378-.014-2.663-.014-3.763 0-4.69 3.071-6.066 3.071-6.066C6.947 1.228 9.86.92 12.877.92h.06c3.016 0 5.933.307 7.475 1.053 0 0 3.071 1.377 3.071 6.066 0 0 .039 3.456-.504 5.874z"/><path d="M17.897 8.113v5.006h-1.985v-4.86c0-1.026-.43-1.546-1.29-1.546-.953 0-1.43.617-1.43 1.837v2.66h-1.973v-2.66c0-1.22-.476-1.837-1.429-1.837-.86 0-1.29.52-1.29 1.546v4.86H6.517V8.113c0-1.025.262-1.843.787-2.45a2.71 2.71 0 0 1 2.055-.858c.946 0 1.663.365 2.136 1.092l.46.774.46-.774c.473-.727 1.19-1.092 2.135-1.092.781 0 1.478.286 2.055.858.525.607.787 1.425.792 2.45z"/></svg>',
  bluesky:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.335 5.144C4.681 6.41 3.19 8.87 3.19 11.314c0 2.96 1.7 4.472 3.765 4.98-1.063.154-2.74.622-2.74 2.387 0 2.696 3.048 2.319 4.296 2.319 3.878 0 6.14-2.965 6.489-5.022.349 2.057 2.611 5.022 6.489 5.022 1.248 0 4.296.377 4.296-2.319 0-1.765-1.677-2.233-2.74-2.387 2.065-.508 3.765-2.02 3.765-4.98 0-2.444-1.491-4.904-3.145-6.17C21.728 3.516 18.278 2 15.46 2c-1.025 0-1.92.108-2.46.212-.54-.104-1.435-.212-2.46-.212-2.818 0-6.268 1.516-4.205 3.144z"/></svg>',
};

function socialLink(url, type, label) {
  const icon = icons[type] || icons.website;
  return `<a href="${escapeHTML(url)}" class="social-link" aria-label="${label}">${icon}<span class="social-link__label">${label}</span></a>`;
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

.social-links {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 0.75rem;
  list-style: none;
  padding: 0;
}

.social-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: #fff;
  text-decoration: none;
  opacity: 0.85;
  transition: opacity 0.15s;
}

.social-link:hover,
.social-link:focus {
  opacity: 1;
  color: #fff;
}

.social-link svg {
  flex-shrink: 0;
}

.social-link__label {
  font-size: 0.9rem;
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

  .social-links {
    justify-content: center;
  }
}
`;
}

function eventHTML(event) {
  const hasEndTime =
    event.endDate &&
    new Date(event.endDate).toDateString() ===
      new Date(event.startDate).toDateString();

  return `
      <li class="event">
        <article class="event__inner">
          <h3 class="event__title">${escapeHTML(event.name)}</h3>
          <p class="event__time">
            <time datetime="${event.startDate}">${formatDateTime(event.startDate)}</time>${hasEndTime ? ` - <time datetime="${event.endDate}">${formatTime(event.endDate)}</time>` : ""}
          </p>
          ${event.summary && event.summary !== event.name ? `<p class="event__summary">${escapeHTML(event.summary)}</p>` : ""}
          ${event.address ? `<p class="event__location">${escapeHTML(formatAddress(event.address))}</p>` : ""}
          ${event.publisherUrl ? `<p class="event__link"><a href="${escapeHTML(event.publisherUrl)}">More details</a></p>` : ""}
        </article>
      </li>`;
}

export function generateHTML(partner, events, siteConfig) {
  const buildDate = new Date().toISOString();
  const buildDateFormatted = formatDate(buildDate);

  const socialLinks = [];
  if (partner.url)
    socialLinks.push(socialLink(partner.url, "website", "Website"));
  if (partner.instagramUrl)
    socialLinks.push(
      socialLink(partner.instagramUrl, "instagram", "Instagram"),
    );
  if (partner.facebookUrl)
    socialLinks.push(socialLink(partner.facebookUrl, "facebook", "Facebook"));
  if (partner.twitterUrl)
    socialLinks.push(socialLink(partner.twitterUrl, "twitter", "Twitter"));

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
      ${partner.logo ? `<img src="${escapeHTML(partner.logo)}" alt="" class="header__logo">` : ""}
      <div class="header__text">
        <h1 class="header__title">${escapeHTML(partner.name)}</h1>
        ${partner.summary ? `<p class="header__summary">${escapeHTML(partner.summary)}</p>` : ""}
        ${socialLinks.length > 0 ? `<nav aria-label="Social links"><ul class="social-links">${socialLinks.map((l) => `<li>${l}</li>`).join("")}</ul></nav>` : ""}
      </div>
    </div>
  </header>

  <main id="main" class="main">
    ${
      partner.description
        ? `
    <section class="about">
      <h2 class="about__title">About</h2>
      <div class="about__content">
        <p>${simpleMarkdown(partner.description)}</p>
      </div>
    </section>
    `
        : ""
    }

    <section class="events">
      <h2 class="events__title">Upcoming Events</h2>
      ${
        events.length === 0
          ? '<p class="events__empty">No upcoming events at the moment. Check back soon!</p>'
          : `<ul class="events__list">${events.map(eventHTML).join("")}</ul>`
      }
    </section>
  </main>

  <footer class="footer">
    <p class="footer__text">
      Data from <a href="https://placecal.org">PlaceCal</a>.
      Last updated: <time datetime="${buildDate}">${buildDateFormatted}</time>
    </p>
    ${partner.url ? `<p class="footer__links"><a href="${escapeHTML(partner.url)}">Visit ${escapeHTML(partner.name)}</a></p>` : ""}
    <p class="footer__text">Icons by <a href="https://lucide.dev">Lucide</a></p>
  </footer>
</body>
</html>`;
}
