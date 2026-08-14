-- Le candidat reçoit uniquement un accusé de réception.
-- La note et la correction restent accessibles aux administrateurs Finasure.
create or replace function public.submit_attempt(p_attempt_id uuid)
returns jsonb language plpgsql security definer set search_path=public as $$
declare attempt_row public.attempts%rowtype; total numeric(4,1);
begin
  select * into attempt_row from public.attempts where id=p_attempt_id and user_id=auth.uid() for update;
  if not found then raise exception 'Attempt not found'; end if;
  if attempt_row.status<>'in_progress' then return jsonb_build_object('received',true,'attempt_id',attempt_row.id); end if;

  update public.answers answer set
    is_correct=case when jsonb_array_length(answer.selected)=0 then false when question.type='single' then answer.selected<@question.correct and answer.selected@>question.correct when not(answer.selected<@question.correct) then false else answer.selected@>question.correct end,
    is_partial=question.type='multiple' and jsonb_array_length(answer.selected)>0 and answer.selected<@question.correct and not(answer.selected@>question.correct),
    points=case when jsonb_array_length(answer.selected)=0 then 0 when question.type='single' and answer.selected<@question.correct and answer.selected@>question.correct then question.points when question.type='multiple' and answer.selected<@question.correct and answer.selected@>question.correct then question.points when question.type='multiple' and answer.selected<@question.correct then question.points/2 else 0 end
  from public.questions question where answer.attempt_id=attempt_row.id and question.id=answer.question_id;

  select coalesce(sum(points),0) into total from public.answers where attempt_id=attempt_row.id;
  update public.attempts set status='submitted',submitted_at=now(),duration_sec=least(extract(epoch from(now()-started_at))::int,1800),score=total,passed=total>=14,level=case when total>=16 then'acquis' when total>=14 then'acquis_reserves' when total>=10 then'en_cours' else'non_acquis'end where id=attempt_row.id;
  return jsonb_build_object('received',true,'attempt_id',attempt_row.id);
end$$;

create or replace function public.get_attempt_result(p_attempt_id uuid)
returns jsonb language plpgsql security definer set search_path=public as $$
declare result jsonb;
begin
  if not public.is_admin() then raise exception 'Admin access required'; end if;
  if not exists(select 1 from public.attempts where id=p_attempt_id and status='submitted') then raise exception 'Result unavailable'; end if;
  select jsonb_build_object('attempt',to_jsonb(attempt),'candidate',to_jsonb(candidate),'answers',coalesce(jsonb_agg(jsonb_build_object('question_id',question.id,'section',question.section,'type',question.type,'text',question.text,'options',question.options,'selected',answer.selected,'correct',question.correct,'explanation',question.explanation,'is_correct',answer.is_correct,'is_partial',answer.is_partial,'points',answer.points) order by question.id),'[]')) into result
  from public.attempts attempt join public.candidates candidate on candidate.id=attempt.candidate_id join public.answers answer on answer.attempt_id=attempt.id join public.questions question on question.id=answer.question_id where attempt.id=p_attempt_id group by attempt.id,candidate.id;
  return result;
end$$;

revoke all on function public.submit_attempt(uuid),public.get_attempt_result(uuid) from public;
grant execute on function public.submit_attempt(uuid),public.get_attempt_result(uuid) to authenticated;
