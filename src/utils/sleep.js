export default (intervalMs = 1000) =>
  new Promise(resolve => setTimeout(resolve, intervalMs));
