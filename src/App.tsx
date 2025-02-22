import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { OfficeView } from './pages/OfficeView';
import { NewOffice } from './pages/NewOffice';
import { SignIn } from './pages/SignIn';
import { AuthRequired } from './components/AuthRequired';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<AuthRequired><Home /></AuthRequired>} />
        <Route path="/office/new" element={<AuthRequired><NewOffice /></AuthRequired>} />
        <Route path="/office/:id" element={<AuthRequired><OfficeView /></AuthRequired>} />
      </Routes>
    </Router>
  );
}

export default App;