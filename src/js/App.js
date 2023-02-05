import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Menu from './components/Menu';
import Form from './pages/Form';
import Result from './pages/Result';

import './App.scss';

const App = () => {   
 return (
    <>
      <Menu />

      <Routes>
         <Route path="/" element={<Form />} />
         <Route path="/result" element={<Result />} />
      </Routes>
    </>
 );
};

export default App;