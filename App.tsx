import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import DesainSiapCetak from './pages/DesainSiapCetak';
import KalkulasiGrafika from './pages/KalkulasiGrafika';
import PurnaCetak from './pages/PurnaCetak';
import ManajemenProduksiGrafika from './pages/ManajemenProduksiGrafika';
import ComingSoon from './components/ComingSoon';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/desain-siap-cetak" element={<DesainSiapCetak />} />
          <Route path="/kalkulasi-grafika" element={<KalkulasiGrafika />} />
          <Route path="/purna-cetak" element={<PurnaCetak />} />
          <Route path="/manajemen-produksi" element={<ManajemenProduksiGrafika />} />
          <Route path="/halaman-6" element={<ComingSoon pageNumber={6} />} />
          <Route path="/halaman-7" element={<ComingSoon pageNumber={7} />} />
          <Route path="/halaman-8" element={<ComingSoon pageNumber={8} />} />
          <Route path="/halaman-9" element={<ComingSoon pageNumber={9} />} />
          <Route path="/halaman-10" element={<ComingSoon pageNumber={10} />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;