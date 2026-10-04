// Shields.io endpoint for the README "tools" badge:
// https://img.shields.io/endpoint?url=https://awesome-devops.xyz/badge/tools.json
import { getSite } from '../../lib/site.mjs';

export function GET() {
  const { tools } = getSite();
  return new Response(JSON.stringify({
    schemaVersion: 1,
    label: 'tools',
    message: String(tools.length),
    color: '3f6fc0',
    labelColor: '141518',
  }), { headers: { 'Content-Type': 'application/json' } });
}
