import {Navigate,Route,Routes} from 'react-router-dom';
import Home from './pages/Home';
import QuizPage from './pages/Quiz';
import SubmissionConfirmation from './pages/SubmissionConfirmation';
import {hasSupabaseConfig} from './lib/supabase';

export default function App(){
  if(!hasSupabaseConfig)return <main className="mx-auto mt-16 max-w-2xl rounded-lg border border-red-200 bg-red-50 p-6 text-red-900"><h1 className="text-xl font-bold">Configuration Supabase manquante</h1><p className="mt-2">Ajoutez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans les variables d’environnement Vercel, puis redéployez l’application.</p></main>;
  return <Routes><Route path="/" element={<Home/>}/><Route path="/quiz" element={<QuizPage/>}/><Route path="/confirmation" element={<SubmissionConfirmation/>}/><Route path="/results" element={<Navigate to="/confirmation" replace/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes>;
}