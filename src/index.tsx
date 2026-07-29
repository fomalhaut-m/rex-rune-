import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './styles/index.css';
import './datadogRUM-init';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import ModelViewer from './pages/ModelViewer';
import ProductMSA from './pages/ProductMSA';
import OledFontMaker from './pages/OledFontMaker';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/about/:id" element={<About />} />
          <Route path="/model" element={<ModelViewer />} />
          <Route path="/product/msa" element={<ProductMSA />} />
          <Route path="/tools/oled-font" element={<OledFontMaker />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
