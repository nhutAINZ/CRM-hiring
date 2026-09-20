/**
 * Recruitment Search URL Builders
 * 
 * Provides official search URLs for Facebook & LinkedIn groups.
 * Prevents 404, private group lock, and invalid vanity slug errors.
 */

export function getFacebookGroupSearchUrl(query) {
  const safeQuery = (query || 'tuyển dụng việc làm').trim();
  return `https://www.facebook.com/search/groups/?q=${encodeURIComponent(safeQuery)}`;
}

export function getLinkedinGroupSearchUrl(query) {
  const safeQuery = (query || 'Vietnam recruitment').trim();
  return `https://www.linkedin.com/search/results/groups/?keywords=${encodeURIComponent(safeQuery)}`;
}
