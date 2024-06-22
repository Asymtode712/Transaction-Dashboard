import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TransTable from './pages/TransTable';

function App() {
  return (<div className="app">
    <BrowserRouter>
        <Routes> 
          <Route path="/" element={<Dashboard />} />
          <Route path="/table" element={<TransTable />} />
         </Routes>
    </BrowserRouter>
  </div>
  );
}

export default App;