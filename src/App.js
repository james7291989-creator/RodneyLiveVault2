import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ApexTerminal from './components/dashboard/ApexTerminal';

function App() {
  return (
    <Router>
      <Routes>
        {/* The Apex Terminal is now the absolute root of the application */}
        <Route path="/" element={<ApexTerminal />} />
        
        {/* This forces any old links to instantly redirect to the new mainframe */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
