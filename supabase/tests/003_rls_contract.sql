begin;select plan(5);
select isnt((select relrowsecurity from pg_class where oid='public.questions'::regclass),false,'questions RLS enabled');
select isnt((select relrowsecurity from pg_class where oid='public.attempts'::regclass),false,'attempts RLS enabled');
select isnt((select relrowsecurity from pg_class where oid='public.answers'::regclass),false,'answers RLS enabled');
select ok((select coalesce(reloptions,'{}') @> array['security_invoker=true'] from pg_class where oid='public.questions_public'::regclass),'public view uses invoker security');
select ok(not has_function_privilege('anon','public.submit_attempt(uuid)','EXECUTE'),'anon cannot submit without an authenticated session');
select * from finish();rollback;
