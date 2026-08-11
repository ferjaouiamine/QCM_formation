import {Navigate,Route,Routes} from 'react-router-dom';import Home from './pages/Home';import QuizPage from './pages/Quiz';import Results from './pages/Results';
export default function App(){return <Routes><Route path="/" element={<Home/>}/><Route path="/quiz" element={<QuizPage/>}/><Route path="/results" element={<Results/>}/><Route path="*" element={<Navigate to="/" replace/>}/></Routes>}
