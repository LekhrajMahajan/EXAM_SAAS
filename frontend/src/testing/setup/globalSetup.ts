/**
 * Global Test Setup.
 * Use this file to set up global environment variables, timezone mocks, 
 * or seed any temporary database before any test suite executes.
 */
export async function setup() {
  process.env.TZ = 'UTC';
  // process.env.VITE_API_URL = 'http://localhost:3000/api';
}

export async function teardown() {
  // Cleanup
}
