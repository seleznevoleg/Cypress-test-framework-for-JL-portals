

export const getPortalUrls = (portals, { types = [], names = [], random = false } = {}) => {
    let filteredPortals = portals;
  
    // Filter by types if provided
    if (types.length > 0) {
      filteredPortals = filteredPortals.filter(portal => types.includes(portal.type));
    }
  
    // Filter by names if provided
    if (names.length > 0) {
      filteredPortals = filteredPortals.filter(portal => names.includes(portal.name));
    }
  
    // Return a random portal if random is true
    if (random) {
      const randomIndex = Math.floor(Math.random() * filteredPortals.length);
      return [filteredPortals[randomIndex].url];
    }
  
    // Return URLs of the filtered portals
    return filteredPortals.map(portal => portal.url);
  };
  