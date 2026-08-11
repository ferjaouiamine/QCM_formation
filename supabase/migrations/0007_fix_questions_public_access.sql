-- La vue security_invoker applique la RLS de la table source.
-- Cette politique autorise les lignes, tandis que les privilèges de colonnes
-- continuent d'interdire correct et explanation.
drop policy if exists questions_public_rows on public.questions;
create policy questions_public_rows
on public.questions
for select
to anon, authenticated
using (true);

revoke all on public.questions from anon, authenticated;
grant select (id, section, type, text, options, points)
on public.questions
to anon, authenticated;

grant select on public.questions_public to anon, authenticated;
