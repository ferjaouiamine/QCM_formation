import {createClient} from '@supabase/supabase-js';
const url=import.meta.env.VITE_SUPABASE_URL as string|undefined,key=import.meta.env.VITE_SUPABASE_ANON_KEY as string|undefined;
if(!url||!key)throw new Error('Configuration Supabase absente : renseignez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY.');
export const supabase=createClient(url,key);
