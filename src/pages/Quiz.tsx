import {useCallback,useEffect,useState} from 'react';
import {Navigate,useNavigate} from 'react-router-dom';
import {attemptId,loadAnswers,loadAttempt,loadQuestions,saveAnswer,submitAttempt} from '../lib/api';
import type {Answers,AttemptRemote,OptionId,Question} from '../types/quiz';
import ProgressBar from '../components/ProgressBar';
import Timer from '../components/Timer';
import QuestionCard from '../components/QuestionCard';
import NavigationBar from '../components/NavigationBar';

export default function QuizPage(){
  const nav=useNavigate(),id=attemptId();
  const [questions,setQuestions]=useState<Question[]>([]);
  const [attempt,setAttempt]=useState<AttemptRemote|null>(null);
  const [answers,setAnswers]=useState<Answers>({});
  const [current,setCurrent]=useState(0);
  const [error,setError]=useState('');
  const [confirm,setConfirm]=useState(false);
  const [loaded,setLoaded]=useState(false);

  useEffect(()=>{
    if(!id){setLoaded(true);return}
    Promise.all([loadQuestions(),loadAttempt(id),loadAnswers(id)])
      .then(([q,a,r])=>{setQuestions(q);setAttempt(a);setAnswers(r)})
      .catch(e=>setError(e instanceof Error?e.message:'Erreur de chargement'))
      .finally(()=>setLoaded(true));
  },[id]);

  const finish=useCallback(async()=>{
    if(id)try{await submitAttempt(id);nav('/results')}
    catch(e){setError(e instanceof Error?e.message:'Soumission impossible')}
  },[id,nav]);

  if(!id)return <Navigate to="/" replace/>;
  if(error)return <main className="mx-auto max-w-3xl p-6"><p role="alert" className="rounded bg-red-50 p-4 text-red-800">{error}</p><button className="mt-4 min-h-11 rounded bg-navy px-5 text-white" onClick={()=>nav('/')}>Revenir à l’accueil</button></main>;
  if(!loaded)return <p className="p-8 text-center">Chargement de l’évaluation…</p>;
  if(!questions.length)return <main className="mx-auto max-w-3xl p-6"><p role="alert" className="rounded bg-amber-50 p-4 text-amber-900">Aucune question n’est disponible. L’administrateur doit exécuter le fichier seed.sql dans Supabase.</p><button className="mt-4 min-h-11 rounded bg-navy px-5 text-white" onClick={()=>nav('/')}>Revenir à l’accueil</button></main>;
  if(!attempt)return <Navigate to="/" replace/>;

  const question=questions[current],selected=answers[question.id]??[];
  const choose=async(option:OptionId)=>{
    const values=question.type==='single'?[option]:selected.includes(option)?selected.filter(x=>x!==option):[...selected,option];
    setAnswers(v=>({...v,[question.id]:values}));
    try{await saveAnswer(id,question.id,values);if(question.type==='single'&&current<questions.length-1)setCurrent(n=>n+1)}
    catch(e){setAnswers(v=>({...v,[question.id]:selected}));setError(e instanceof Error?e.message:'Sauvegarde impossible')}
  };
  const unanswered=questions.filter(q=>!(answers[q.id]?.length)).length;

  return <main className="mx-auto max-w-4xl px-4 pb-10"><header className="sticky top-0 z-10 -mx-4 mb-5 border-b bg-slate-50/95 px-4 py-3"><div className="mb-2 flex justify-between"><div><p className="text-sm font-semibold text-accent">{question.section}</p><p className="font-bold text-navy">Question {current+1} / {questions.length}</p></div><Timer expiresAt={attempt.expires_at} onExpire={finish}/></div><ProgressBar value={current+1} max={questions.length}/></header><QuestionCard question={question} selected={selected} onSelect={choose}/><NavigationBar current={current} total={questions.length} answered={Object.entries(answers).filter(([,v])=>v.length).map(([k])=>Number(k))} canNext={selected.length>0} canFinish={!unanswered} onGo={setCurrent} onPrevious={()=>setCurrent(n=>n-1)} onNext={()=>selected.length&&setCurrent(n=>n+1)} onFinish={()=>!unanswered&&setConfirm(true)}/>{confirm&&<div role="dialog" aria-modal="true" className="fixed inset-0 z-20 grid place-items-center bg-slate-900/60 p-4"><div className="rounded-lg bg-white p-6"><h2 className="text-xl font-bold">Terminer l’évaluation ?</h2><p className="my-4">Toutes les réponses sont enregistrées.</p><button className="mr-3 min-h-11 rounded border px-4" onClick={()=>setConfirm(false)}>Continuer</button><button className="min-h-11 rounded bg-accent px-4 text-white" onClick={finish}>Valider</button></div></div>}</main>;
}
