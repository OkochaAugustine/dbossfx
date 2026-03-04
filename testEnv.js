// testEnv.js
require('dotenv').config({ path: '.env.local' });

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);