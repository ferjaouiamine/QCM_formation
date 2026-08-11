-- Autorise tout candidat authentifié anonymement à commencer immédiatement,
-- y compris après une tentative déjà soumise. Aucune validation admin requise.
create or replace function public.start_attempt(
  p_full_name text,
  p_agency text
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  candidate_uuid uuid;
  attempt_uuid uuid;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if trim(p_full_name) = '' or trim(p_agency) = '' then
    raise exception 'Name and agency required';
  end if;

  insert into public.candidates (full_name, agency)
  values (trim(p_full_name), trim(p_agency))
  on conflict (full_name, agency)
  do update set full_name = excluded.full_name
  returning id into candidate_uuid;

  -- Reprend seulement la tentative active de cette même session.
  select id into attempt_uuid
  from public.attempts
  where user_id = auth.uid()
    and candidate_id = candidate_uuid
    and status = 'in_progress'
    and now() < expires_at
  order by started_at desc
  limit 1;

  -- Sinon, crée immédiatement une nouvelle tentative sans accord admin.
  if attempt_uuid is null then
    insert into public.attempts (candidate_id, user_id)
    values (candidate_uuid, auth.uid())
    returning id into attempt_uuid;

    insert into public.answers (attempt_id, question_id)
    select attempt_uuid, id from public.questions
    on conflict do nothing;
  end if;

  return attempt_uuid;
end;
$$;

revoke all on function public.start_attempt(text, text) from public;
grant execute on function public.start_attempt(text, text) to authenticated;
