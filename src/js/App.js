import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/home.js';
import Options from './pages/options.js';
import Result from './pages/result.js';

import './App.scss';

const App = () => {
 return (
    <>
       <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/options" element={<Options />} />
          <Route path="/result" element={<Result />} />
       </Routes>


       
    </>
 );
};

export default App;