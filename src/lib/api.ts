import {supabase} from './supabase';import type {AttemptRemote,OptionId,Question,ResultPayload} from '../types/quiz';
const ATTEMPT='bancassurance.attempt';
export async function ensureAnonymous(){const{data:{session}}=await supabase.auth.getSession();if(session)return session;const{data,error}=await supabase.auth.signInAnonymously();if(error)throw error;return data.session!}
export async function loadQuestions(){const{data,error}=await supabase.from('questions_public').select('id,section,type,text,options,points').order('id');if(error)throw error;return data as Question[]}
export async function startAttempt(fullName:string,agency:string){await ensureAnonymous();const{data,error}=await supabase.rpc('start_attempt',{p_full_name:fullName,p_agency:agency});if(error)throw error;localStorage.setItem(ATTEMPT,data as string);return data as string}
export function attemptId(){return localStorage.getItem(ATTEMPT)}
export async function loadAttempt(id:string){const{data,error}=await supabase.from('attempts').select('id,started_at,expires_at,status').eq('id',id).single();if(error)throw error;return data as AttemptRemote}
export async function loadAnswers(id:string){const{data,error}=await supabase.from('answers').select('question_id,selected').eq('attempt_id',id);if(error)throw error;return Object.fromEntries(data.map(r=>[r.question_id,r.selected as OptionId[]]))}
export async function saveAnswer(id:string,questionId:number,selected:OptionId[]){const{error}=await supabase.from('answers').update({selected,answered_at:new Date().toISOString()}).eq('attempt_id',id).eq('question_id',questionId);if(error)throw error}
export async function submitAttempt(id:string){const{data,error}=await supabase.rpc('submit_attempt',{p_attempt_id:id});if(error)throw error;localStorage.removeItem(`${ATTEMPT}.result`);localStorage.removeItem(ATTEMPT);return data as {received:boolean;attempt_id:string}}
export function cachedResult(){try{return JSON.parse(localStorage.getItem(`${ATTEMPT}.result`)??'null') as ResultPayload|null}catch{return null}}
export function clearAttempt(){localStorage.removeItem(ATTEMPT);localStorage.removeItem(`${ATTEMPT}.result`)}
