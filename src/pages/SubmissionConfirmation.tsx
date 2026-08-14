import {Link,Navigate} from 'react-router-dom';

const RECEIPT_KEY='bancassurance.submission.received';

export default function SubmissionConfirmation(){
  const received=sessionStorage.getItem(RECEIPT_KEY)==='true';
  if(!received)return <Navigate to="/" replace/>;
  return <main className="grid min-h-screen place-items-center px-4 py-10"><section className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-7 text-center shadow-sm sm:p-10"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-3xl font-bold text-emerald-700" aria-hidden="true">✓</div><p className="mt-6 text-sm font-bold uppercase tracking-wider text-accent">Évaluation transmise</p><h1 className="mt-3 text-2xl font-bold text-navy sm:text-3xl">Nous avons bien reçu votre évaluation</h1><p className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">Merci pour votre collaboration. Vos réponses ont été enregistrées et seront consultées par l’équipe Finasure.</p><p className="mt-3 text-sm text-slate-500">Vous pouvez maintenant fermer cette page.</p><Link to="/" onClick={()=>sessionStorage.removeItem(RECEIPT_KEY)} className="mt-7 inline-flex min-h-11 items-center justify-center rounded bg-navy px-6 font-semibold text-white hover:bg-slate-700">Retour à l’accueil</Link></section></main>;
}
