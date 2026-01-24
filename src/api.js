/**
 * PlaceCal GraphQL API client
 */

export async function fetchPartner(endpoint, partnerId) {
  const query = `{
    partner(id: ${partnerId}) {
      id
      name
      summary
      description
      logo
      url
      facebookUrl
      twitterUrl
      instagramUrl
      contact {
        name
        email
        telephone
      }
      address {
        streetAddress
        postalCode
        addressLocality
        addressRegion
      }
    }
  }`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const { data, errors } = await response.json();
  if (errors) {
    throw new Error(`GraphQL error: ${errors[0].message}`);
  }
  if (!data.partner) {
    throw new Error(`Partner ${partnerId} not found`);
  }

  return data.partner;
}

export async function fetchEvents(endpoint, partnerId, futureDays = 90) {
  const now = new Date();
  const future = new Date(now.getTime() + futureDays * 24 * 60 * 60 * 1000);

  const formatDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${mins}`;
  };

  const query = `{
    eventsByFilter(
      fromDate: "${formatDate(now)}"
      toDate: "${formatDate(future)}"
    ) {
      id
      name
      summary
      description
      startDate
      endDate
      publisherUrl
      address {
        streetAddress
        postalCode
        addressLocality
      }
      organizer {
        id
        name
      }
    }
  }`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const { data, errors } = await response.json();
  if (errors) {
    throw new Error(`GraphQL error: ${errors[0].message}`);
  }

  // Filter events by partner ID and sort by start date
  const partnerEvents = (data.eventsByFilter || [])
    .filter(event => event.organizer && event.organizer.id === partnerId)
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  return partnerEvents;
}
