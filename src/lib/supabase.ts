import {createClient} from '@supabase/supabase-js';
const defaultUrl='https://tmhqunivgfzjnxlkvhgf.supabase.co';
const defaultPublishableKey='sb_publishable_65dwAoYCbnLDLcugbIZ0AQ_WOVC8ZyJ';
const url=(import.meta.env.VITE_SUPABASE_URL as string|undefined)??defaultUrl;
const key=(import.meta.env.VITE_SUPABASE_ANON_KEY as string|undefined)??(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string|undefined)??defaultPublishableKey;
export const hasSupabaseConfig=Boolean(url&&key);
export const supabase=createClient(url,key);
