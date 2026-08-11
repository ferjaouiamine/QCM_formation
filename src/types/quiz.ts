export type OptionId = 'a'|'b'|'c'|'d';
export type QuestionType = 'single'|'multiple';
export interface Option { id: OptionId; label: string }
export interface Question { id:number; section:string; type:QuestionType; text:string; options:Option[]; points:number }
export interface Quiz { title:string; subtitle:string; totalPoints:number; passingScore:number; durationMinutes:number; instructions:string; questions:Question[] }
export type Answers = Record<number,OptionId[]>;
export interface Candidate { name:string; agency:string }
export interface Attempt { candidate:Candidate; answers:Answers; current:number; startedAt:number; submittedAt?:number }
export type AnswerStatus='correct'|'partial'|'incorrect'|'unanswered';
export interface QuestionResult { question:Question; selected:OptionId[]; score:number; status:AnswerStatus }
export interface QuizResult { score:number; maxScore:number; results:QuestionResult[] }
export interface AttemptRemote {id:string;started_at:string;expires_at:string;status:'in_progress'|'submitted'|'expired'}
export interface CorrectionAnswer extends Question {selected:OptionId[];correct:OptionId[];explanation:string;is_correct:boolean;is_partial:boolean;points:number}
export interface ResultPayload {attempt:{id:string;score:number;max_score:number;passed:boolean;level:string;submitted_at:string};candidate:{full_name:string;agency:string};answers:CorrectionAnswer[]}
