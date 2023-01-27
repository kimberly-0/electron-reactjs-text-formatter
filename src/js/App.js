import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Options from './pages/Options';
import Result from './pages/Result';

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