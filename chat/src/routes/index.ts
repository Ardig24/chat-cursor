import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from '../App';
import { AdminPanel } from '../components/AdminPanel';

export const AppRoutes = () => {
    return (
        <BrowserRouter>
        <Routes>
        <Route path= "/" element = {< App />} />
            < Route path = "/admin" element = {< AdminPanel />} />
                < Route path = "*" element = {< Navigate to = "/" />} />
                    < /Routes>
                    < /BrowserRouter>
  );
};