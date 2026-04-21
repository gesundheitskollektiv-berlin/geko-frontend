import axios from 'axios';

const DEFAULT_BASE_URL = 'http://localhost:1337';

export function createStrapiClient() {
  const baseURL = process.env.MIGRATION_BASE_URL || DEFAULT_BASE_URL;
  const token = process.env.STRAPI_MIGRATION_TOKEN;

  if (!token) {
    console.error('Error: STRAPI_MIGRATION_TOKEN is not set. Add it to your .env file.');
    process.exit(1);
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  console.log(`Strapi target: ${baseURL}`);

  return axios.create({ baseURL, headers });
}
