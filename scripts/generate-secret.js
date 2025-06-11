#!/usr/bin/env node

/**
 * Generate a secure secret for Better Auth
 * Run this script to generate a random secret for your .env.local file
 */

const crypto = require('crypto');

function generateSecret(length = 64) {
  return crypto.randomBytes(length).toString('hex');
}

const secret = generateSecret();

console.log('Generated Better Auth Secret:');
console.log('================================');
console.log(`BETTER_AUTH_SECRET="${secret}"`);
console.log('================================');
console.log('\nAdd this to your .env.local file!');
console.log('\nNote: Keep this secret secure and never commit it to version control.'); 