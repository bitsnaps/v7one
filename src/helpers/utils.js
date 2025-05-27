
// Add helper function
const getApiBaseUrl = () => {
  if (import.meta.env.DEV) {
    return 'http://localhost:3000';
  }
  // In production, use same origin or configured URL
  return import.meta.env.VITE_API_BASE_URL || window.location.origin;
};

// export helper function
export { getApiBaseUrl };
