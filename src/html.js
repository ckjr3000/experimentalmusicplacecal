/**
 * HTML generation for PlaceCal partner sites
 * Uses Mustache-style templates
 */

import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { getIcon } from "./icons.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load template, styles, and scripts once
const template = readFileSync(join(__dirname, "template.html"), "utf-8");
const styles = readFileSync(join(__dirname, "styles.css"), "utf-8");
const themeScript = readFileSync(join(__dirname, "theme.js"), "utf-8");

/**
 * Simple Mustache-style template renderer
 * Supports: {{var}}, {{{unescaped}}}, {{#section}}...{{/section}}, {{^inverted}}...{{/inverted}}
 */
function render(tmpl, data) {
  // Handle sections {{#key}}...{{/key}}
  tmpl = tmpl.replace(
    /\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g,
    (_, key, content) => {
      const value = data[key];
      if (!value) return "";
      if (Array.isArray(value)) {
        return value
          .map((item) => {
            if (typeof item === "string") {
              return render(content.replace(/\{\{\.\}\}/g, item), data);
            }
            return render(content, { ...data, ...item });
          })
          .join("");
      }
      return render(content, data);
    },
  );

  // Handle inverted sections {{^key}}...{{/key}}
  tmpl = tmpl.replace(
    /\{\{\^(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g,
    (_, key, content) => {
      return data[key] ? "" : render(content, data);
    },
  );

  // Handle unescaped {{{var}}}
  tmpl = tmpl.replace(/\{\{\{(\w+)\}\}\}/g, (_, key) => {
    return data[key] ?? "";
  });

  // Handle escaped {{var}}
  tmpl = tmpl.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return escapeHTML(data[key] ?? "");
  });

  return tmpl;
}

function escapeHTML(str) {
  if (!str) return "";
  return String(str)
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
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDateShort(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function formatEventTime(startDate, endDate) {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  const dateStr = formatDateShort(startDate);
  const startTime = formatTime(startDate);

  // If same day and has end time
  if (end && start.toDateString() === end.toDateString()) {
    const endTime = formatTime(endDate);
    return `${dateStr} · ${startTime} – ${endTime}`;
  }

  return `${dateStr} · ${startTime}`;
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

  // Unescape backslash-escaped quotes from API data
  text = text.replace(/\\'/g, "'").replace(/\\"/g, '"');

  // Collect links to replace later with null-byte delimited placeholders
  const links = [];
  const placeholder = (url, linkText) => {
    const idx = links.length;
    links.push({ url, text: linkText });
    return `\x00${idx}\x00`;
  };

  // Extract reference-style link definitions [1]: url
  const refs = {};
  let processed = text.replace(/^\[(\d+)\]:\s*(.+)$/gm, (_, id, url) => {
    refs[id] = url.trim();
    return "";
  });

  // Remove separator lines (with optional surrounding whitespace)
  processed = processed.replace(/^\s*---+\s*$/gm, "");

  // Reference links [text][1] - process first to capture before URL regex
  processed = processed.replace(/\[([^\]]+)\]\[(\d+)\]/g, (_, linkText, id) => {
    const url = refs[id];
    return url ? placeholder(url, linkText) : linkText;
  });

  // Inline links [text](url)
  processed = processed.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_, linkText, url) => {
      return placeholder(url, linkText);
    },
  );

  // Plain URLs (not inside placeholders - \x00 marks placeholder boundaries)
  processed = processed.replace(
    /(?<!\x00)(https?:\/\/[^\s<>\[\]\x00]+)/g,
    (url) => {
      return placeholder(url, url);
    },
  );

  // Escape the text (placeholders use \x00 which won't be affected)
  processed = escapeHTML(processed);

  // Restore links from placeholders
  processed = processed.replace(/\x00(\d+)\x00/g, (_, idx) => {
    const link = links[parseInt(idx)];
    return `<a href="${escapeHTML(link.url)}">${escapeHTML(link.text)}</a>`;
  });

  // Line breaks
  processed = processed
    .replace(/\r\n/g, "\n")
    .replace(/\n\n+/g, "</p><p>")
    .replace(/\n/g, "<br>");

  // Clean up empty paragraphs
  processed = processed.replace(/<br>\s*<br>/g, "</p><p>");
  processed = processed.replace(/<p>\s*<\/p>/g, "");
  processed = processed.replace(/^\s*<\/p>/g, "");
  processed = processed.replace(/<p>\s*$/g, "");

  return processed.trim();
}

function socialLink(url, type, label) {
  const icon = getIcon(type);
  return `<a href="${escapeHTML(url)}" class="social-link" aria-label="${label}">${icon}<span class="social-link__label">${label}</span></a>`;
}

export function generateHTML(partner, events, siteConfig) {
  const buildDate = new Date().toISOString();

  // Build social links
  const links = [];
  if (partner.url) links.push(socialLink(partner.url, "website", "Website"));
  if (partner.instagramUrl)
    links.push(socialLink(partner.instagramUrl, "instagram", "Instagram"));
  if (partner.facebookUrl)
    links.push(socialLink(partner.facebookUrl, "facebook", "Facebook"));
  if (partner.twitterUrl)
    links.push(socialLink(partner.twitterUrl, "twitter", "Twitter"));
  if (partner.contact?.email)
    links.push(socialLink(`mailto:${partner.contact.email}`, "email", "Email"));

  // Format events for template
  const formattedEvents = events.map((event) => {
    return {
      name: event.name,
      startDate: event.startDate,
      timeFormatted: formatEventTime(event.startDate, event.endDate),
      summary:
        event.summary && event.summary !== event.name ? event.summary : "",
      description: event.description ? simpleMarkdown(event.description) : "",
      location: formatAddress(event.address),
      publisherUrl: event.publisherUrl,
    };
  });

  // Build template data
  const data = {
    // Site config
    language: siteConfig.language,
    title: siteConfig.title,
    description: siteConfig.description,
    styles,

    // Partner info
    partnerId: partner.id,
    partnerName: partner.name,
    partnerUrl: partner.url,
    logo: partner.logo,
    summary: partner.summary,
    about: partner.description
      ? `<p>${simpleMarkdown(partner.description)}</p>`
      : "",

    // Social links
    socialLinks: links.length > 0,
    links,

    // Events
    hasEvents: formattedEvents.length > 0,
    events: formattedEvents,

    // Build info
    buildDate,
    buildDateFormatted: formatDate(buildDate),

    // Theme toggle
    iconMoon: getIcon("moon"),
    iconSun: getIcon("sun"),
    themeScript,
  };

  return render(template, data);
}
