alter publication supabase_realtime add table public.attempts;
do $$begin if exists(select 1 from pg_extension where extname='pg_cron') then perform cron.schedule('expire-stale-attempts','*/15 * * * *','select public.expire_stale_attempts()');end if;end$$;
