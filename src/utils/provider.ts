import { createClient } from '@supabase/supabase-js';

export const ProviderService = {
  provide: 'SUPABASE_CLIENT',
  useFactory: () => {
    console.log('process.env.SUPABASE_URL', process.env.SUPABASE_URL);
    return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  },
};
