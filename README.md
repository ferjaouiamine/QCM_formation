# QCM — La bancassurance en Tunisie

## Architecture Supabase

La notation, le chronomètre et la correction font autorité dans PostgreSQL. Le navigateur ne reçoit les bonnes réponses qu’après `submit_attempt()`. Les migrations sont dans `supabase/migrations`, le seed pédagogique dans `supabase/seed.sql`, les tests pgTAP dans `supabase/tests` et l’export sécurisé dans `supabase/functions/export-csv`.

Prérequis : Docker et Supabase CLI. Copiez `.env.example` vers `.env.local`, puis :

```bash
supabase start
supabase db reset
supabase test db
supabase gen types typescript --local > packages/types/database.ts
```

Les types de base ne sont volontairement pas écrits à la main : la dernière commande doit être relancée après chaque modification du schéma. Pour déployer : `supabase db push`, puis `supabase functions deploy export-csv`.

Le dashboard est dans `apps/admin` et utilise les vues agrégées SQL et Realtime. Il se lance avec `npm run dev --prefix apps/admin` après installation de ses dépendances.

### Exemple PostgREST

Après une connexion anonyme (`POST /auth/v1/signup` avec l’en-tête `apikey`), utiliser le JWT retourné :

```bash
curl "$SUPABASE_URL/rest/v1/rpc/start_attempt" \
  -H "apikey: $SUPABASE_ANON_KEY" -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"p_full_name":"Amira Ben Salah","p_agency":"Tunis Centre"}'

curl "$SUPABASE_URL/rest/v1/answers?attempt_id=eq.$ATTEMPT_ID&question_id=eq.1" \
  -X PATCH -H "apikey: $SUPABASE_ANON_KEY" -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" -d '{"selected":["b"]}'

curl "$SUPABASE_URL/rest/v1/rpc/submit_attempt" \
  -H "apikey: $SUPABASE_ANON_KEY" -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" -d "{\"p_attempt_id\":\"$ATTEMPT_ID\"}"
```

Application front-end de formation permettant de passer un QCM chronométré, de reprendre une tentative locale et de consulter ou imprimer une correction détaillée.

## Installation et lancement

```bash
npm install
npm run dev
```

Ouvrir ensuite l’adresse indiquée par Vite. Pour contrôler le projet :

```bash
npm test
npm run build
```

## Structure

- `src/data/questions.ts` contient le dataset typé du QCM.
- `src/types/quiz.ts` définit les modèles métier.
- `src/lib/scoring.ts` contient la notation pure et `storage.ts` la persistance locale.
- `src/components` regroupe les éléments d’interface accessibles et réutilisables.
- `src/pages` contient les trois routes : accueil, quiz et résultats.
- `tests` couvre les cas limites de notation et un parcours complet.

Pour ajouter un QCM, créer un nouvel objet conforme à l’interface `Quiz`. Chaque question doit avoir quatre options identifiées de `a` à `d`, une liste `correct`, un type `single` ou `multiple`, une justification et un nombre de points. La logique de notation ne dépend ni de React ni du dataset.

## Dépendances

Les seules dépendances d’exécution sont React et React Router. Vite, Tailwind CSS, TypeScript, Vitest et Testing Library assurent respectivement la compilation, le style, le typage et les tests conformément au cahier des charges.
