import type {Attempt} from '../types/quiz';
const ACTIVE='bancassurance.active',HISTORY='bancassurance.history';
function read<T>(key:string,fallback:T):T{try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw) as T:fallback}catch{return fallback}}
export const storage={getActive:()=>read<Attempt|null>(ACTIVE,null),saveActive:(a:Attempt)=>localStorage.setItem(ACTIVE,JSON.stringify(a)),clearActive:()=>localStorage.removeItem(ACTIVE),history:()=>read<Attempt[]>(HISTORY,[]),complete:(a:Attempt)=>{localStorage.setItem(HISTORY,JSON.stringify([...read<Attempt[]>(HISTORY,[]),a]));localStorage.removeItem(ACTIVE)}};
