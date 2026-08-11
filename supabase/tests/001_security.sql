begin;select plan(6);
select has_column_privilege('anon','public.questions','correct','SELECT') is false as "anon cannot read correct";
select has_column_privilege('authenticated','public.questions','explanation','SELECT') is false as "authenticated cannot read explanation";
select has_column_privilege('authenticated','public.attempts','score','UPDATE') is false as "candidate cannot update score";
select has_column_privilege('authenticated','public.answers','points','UPDATE') is false as "candidate cannot update answer points";
select has_column_privilege('authenticated','public.answers','selected','UPDATE') as "candidate can update selected";
select results_eq($$select column_name::text from information_schema.columns where table_schema='public' and table_name='questions_public' order by ordinal_position$$,$$values('id'),('section'),('type'),('text'),('options'),('points')$$,'public view has no secret fields');
select * from finish();rollback;
