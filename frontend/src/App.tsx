import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome.js';
import ExpensesPlaceholder from './pages/Expenses.js';
import NotFound from './pages/NotFound.js';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/expenses" element={<ExpensesPlaceholder />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
