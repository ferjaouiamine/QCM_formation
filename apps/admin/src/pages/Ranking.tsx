import {useQuery} from '@tanstack/react-query';
import {Link} from 'react-router-dom';
import {supabase} from '../lib/supabase';

type Candidate={full_name:string;agency:string};
type Attempt={id:string;candidate_id:string;score:number;duration_sec:number|null;submitted_at:string;level:string;passed:boolean;candidates:Candidate|Candidate[]};
const fmt=(value:number)=>Number(value).toLocaleString('fr-FR',{maximumFractionDigits:1});
const levelLabel:Record<string,string>={acquis:'Acquis',acquis_reserves:'Acquis avec réserves',en_cours:'En cours d’acquisition',non_acquis:'Non acquis'};

export default function Ranking(){
  const {data,isLoading,error}=useQuery({
    queryKey:['candidate-ranking'],
    queryFn:async()=>{
      const {data,error}=await supabase.from('attempts').select('id,candidate_id,score,duration_sec,submitted_at,level,passed,candidates!inner(full_name,agency)').eq('status','submitted').order('score',{ascending:false}).order('duration_sec',{ascending:true}).order('submitted_at',{ascending:true});
      if(error)throw error;
      const seen=new Set<string>();
      return (data as unknown as Attempt[]).filter(row=>{if(seen.has(row.candidate_id))return false;seen.add(row.candidate_id);return true});
    }
  });
  return <><header className="page-header"><div><p className="eyebrow">Performance individuelle</p><h1>Classement des candidats</h1><p>Le meilleur résultat de chaque candidat, classé par note puis par durée.</p></div></header>{isLoading?<div className="skeleton chart-block"/>:error?<p className="alert" role="alert">Impossible de charger le classement.</p>:!data?.length?<div className="empty-state"><div className="empty-icon">0</div><h2>Aucun résultat à classer</h2><p>Le classement apparaîtra après la première évaluation terminée.</p></div>:<section className="ranking-list">{data.map((attempt,index)=>{const candidate=Array.isArray(attempt.candidates)?attempt.candidates[0]:attempt.candidates;return <article className={`ranking-card rank-${index+1}`} key={attempt.id}><span className="ranking-position">{index+1}</span><div className="ranking-person"><h2>{candidate.full_name}</h2><p>{candidate.agency} · {new Date(attempt.submitted_at).toLocaleDateString('fr-FR')}</p></div><div className="ranking-result"><strong>{fmt(attempt.score)} <small>/ 20</small></strong><span className={`badge level-${attempt.level}`}>{levelLabel[attempt.level]??attempt.level}</span></div><div className="ranking-time"><small>Durée</small><b>{attempt.duration_sec==null?'—':`${Math.floor(attempt.duration_sec/60)} min ${attempt.duration_sec%60} s`}</b></div><Link className="detail-link" to={`/candidats/${attempt.id}`}>Voir les réponses →</Link></article>})}</section>}</>;
}
