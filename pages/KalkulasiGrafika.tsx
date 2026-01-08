import React, { useState, useEffect } from 'react';
import { Calculator, Scissors, Banknote, ScrollText, CheckCircle2, AlertTriangle, Layers, Ruler } from 'lucide-react';

const KalkulasiGrafika: React.FC = () => {
  // Inputs State
  const [orderQty, setOrderQty] = useState(500);
  const [cutP, setCutP] = useState(21);
  const [cutL, setCutL] = useState(29.7);
  const [planoType, setPlanoType] = useState('65,100');
  const [pricePlano, setPricePlano] = useState(4500);
  const [priceCetak, setPriceCetak] = useState(2500);
  const [priceFinishing, setPriceFinishing] = useState(1000);
  const [margin, setMargin] = useState(30);

  // Results State
  const [results, setResults] = useState({
    pPlano: 65,
    lPlano: 100,
    bestYield: 0,
    planoNeeded: 0,
    totalCostKertas: 0,
    totalHPP: 0,
    hppPerUnit: 0,
    hargaJualUnit: 0,
    profitTotal: 0,
    isRotated: false,
    finalP: 0,
    finalL: 0,
  });

  const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
  };

  useEffect(() => {
    const [pPlano, lPlano] = planoType.split(',').map(Number);
    
    // 1. Hitung Potongan per Plano
    // Cara 1: Searah
    const yield1 = Math.floor(pPlano / cutP) * Math.floor(lPlano / cutL);
    // Cara 2: Putar 90 derajat
    const yield2 = Math.floor(pPlano / cutL) * Math.floor(lPlano / cutP);
    
    const bestYield = Math.max(yield1, yield2);
    const isRotated = yield2 > yield1;

    // 2. Kebutuhan Bahan
    // Avoid division by zero
    const effectiveYield = bestYield > 0 ? bestYield : 1;
    const planoNeeded = Math.ceil(orderQty / effectiveYield);
    const totalCostKertas = planoNeeded * pricePlano;

    // 3. Biaya Produksi
    const totalCostCetak = orderQty * priceCetak;
    const totalCostFinishing = orderQty * priceFinishing;
    const totalHPP = totalCostKertas + totalCostCetak + totalCostFinishing;
    const hppPerUnit = orderQty > 0 ? totalHPP / orderQty : 0;

    // 4. Harga Jual
    const profit = (margin / 100) * totalHPP;
    const totalHargaJual = totalHPP + profit;
    const hargaJualUnit = orderQty > 0 ? totalHargaJual / orderQty : 0;

    setResults({
      pPlano,
      lPlano,
      bestYield,
      planoNeeded,
      totalCostKertas,
      totalHPP,
      hppPerUnit,
      hargaJualUnit,
      profitTotal: profit,
      isRotated,
      finalP: isRotated ? cutL : cutP,
      finalL: isRotated ? cutP : cutL,
    });
  }, [orderQty, cutP, cutL, planoType, pricePlano, priceCetak, priceFinishing, margin]);

  // Visualizer Items
  const renderVisualizer = () => {
    const items = [];
    // Scale percentages for visualization
    const itemW = (results.finalP / results.pPlano) * 100;
    const itemH = (results.finalL / results.lPlano) * 100;

    for (let i = 0; i < results.bestYield; i++) {
      items.push(
        <div 
          key={i}
          className="border border-brand-500 bg-brand-500/10 flex items-center justify-center text-[8px] md:text-[10px] text-brand-700 font-medium overflow-hidden"
          style={{ width: `${itemW}%`, height: `${itemH}%` }}
        >
          {results.finalP}x{results.finalL}
        </div>
      );
    }
    return items;
  };

  return (
    <div className="relative">
      {/* Hero Header */}
      <div className="pt-12 pb-8 px-6 text-center">
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-100">
           <Calculator size={12} />
           <span>Modul Ajar Fase F</span>
         </div>
         <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 mb-4">
           Kalkulasi Produksi Grafika
         </h1>
         <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
           Alat bantu hitung kebutuhan bahan, HPP, dan Harga Jual untuk efisiensi produksi yang maksimal.
         </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-16 pb-20">
        
        {/* Educational Material Section */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:p-10">
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-8 flex items-center gap-2">
                <ScrollText className="text-brand-600" size={28} />
                Materi Dasar Kalkulasi
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Materi 1 */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 border-l-4 border-brand-500 pl-4">1. Perhitungan Kertas (Plano)</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Dalam industri percetakan, kertas dibeli dalam ukuran besar (Plano) dan dipotong menjadi ukuran cetak (A4, A5, dst). Efisiensi pemotongan sangat mempengaruhi biaya.
                    </p>
                    <div className="bg-slate-50 p-5 rounded-xl text-sm border border-slate-200">
                        <p className="font-bold text-slate-700 mb-3">Rumus Menghitung Jumlah Potongan (Out):</p>
                        <ul className="space-y-2 text-slate-600 ml-1">
                            <li className="flex items-start gap-2"><span className="text-brand-500 mt-1">•</span> <span><strong className="text-slate-800">Posisi Tegak:</strong> (P.Plano ÷ P.Potong) × (L.Plano ÷ L.Potong)</span></li>
                            <li className="flex items-start gap-2"><span className="text-brand-500 mt-1">•</span> <span><strong className="text-slate-800">Posisi Tidur:</strong> (P.Plano ÷ L.Potong) × (L.Plano ÷ P.Potong)</span></li>
                        </ul>
                        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-brand-600 bg-brand-50 p-2 rounded-lg">
                           <CheckCircle2 size={14} />
                           Simulator ini otomatis memilih posisi paling efisien.
                        </div>
                    </div>
                </div>

                {/* Materi 2 */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 border-l-4 border-brand-500 pl-4">2. Harga Pokok Produksi (HPP)</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        HPP adalah total biaya yang dikeluarkan untuk memproduksi barang jadi. Komponen utamanya:
                    </p>
                    <div className="grid grid-cols-1 gap-3 text-sm">
                        <div className="flex items-start gap-3 bg-white border border-slate-100 p-3 rounded-xl shadow-sm">
                            <span className="bg-brand-100 text-brand-700 font-bold w-6 h-6 flex items-center justify-center rounded-full text-xs shrink-0">A</span>
                            <div>
                                <strong className="block text-slate-800">Biaya Bahan Baku</strong>
                                <span className="text-slate-500 text-xs">Total lembar plano yang dibutuhkan × Harga per plano.</span>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 bg-white border border-slate-100 p-3 rounded-xl shadow-sm">
                            <span className="bg-brand-100 text-brand-700 font-bold w-6 h-6 flex items-center justify-center rounded-full text-xs shrink-0">B</span>
                            <div>
                                <strong className="block text-slate-800">Biaya Cetak (Ongkos)</strong>
                                <span className="text-slate-500 text-xs">Biaya mesin, tinta/toner, listrik, dan operator per eksemplar.</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Materi 3 */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 border-l-4 border-brand-500 pl-4">3. Menentukan Harga Jual</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Harga jual ditentukan dengan menambahkan margin keuntungan (profit) yang diinginkan ke dalam HPP.
                    </p>
                    <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                        <p className="font-mono text-xs text-blue-600 font-bold mb-2 uppercase tracking-wide">Rumus Profit</p>
                        <p className="text-sm text-slate-700 mb-1">Profit = HPP × (Persentase Margin ÷ 100)</p>
                        <p className="text-lg font-bold text-blue-900 mt-2">Harga Jual = HPP + Profit</p>
                    </div>
                </div>

                {/* Tips */}
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800 border-l-4 border-brand-500 pl-4">4. Tips Efisiensi</h3>
                    <ul className="space-y-3 text-sm text-slate-600">
                        <li className="flex gap-3">
                            <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                            <span>Pilih ukuran plano yang paling mendekati kelipatan ukuran jadi untuk meminimalkan sampah kertas (waste).</span>
                        </li>
                        <li className="flex gap-3">
                            <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                            <span>Perhatikan arah serat kertas (grain direction) untuk produk buku agar hasil jilid rapi.</span>
                        </li>
                        <li className="flex gap-3">
                            <CheckCircle2 size={18} className="text-green-500 shrink-0" />
                            <span>Selalu tambahkan <i>insheet</i> (kertas cadangan) sekitar 2-5% untuk antisipasi kerusakan.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </section>

        {/* Simulator Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Input Column */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                        <Layers className="text-brand-600" size={20} />
                        <h2 className="text-lg font-bold text-slate-800">1. Spesifikasi Order</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Jumlah Pesanan (Pcs)</label>
                            <input 
                                type="number" 
                                value={orderQty}
                                onChange={(e) => setOrderQty(parseFloat(e.target.value) || 0)}
                                className="w-full rounded-lg border-slate-200 border p-2.5 text-sm focus:border-brand-500 focus:ring-brand-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ukuran Potong (cm)</label>
                            <div className="flex gap-2">
                                <div className="relative w-1/2">
                                    <input 
                                        type="number" 
                                        value={cutP}
                                        onChange={(e) => setCutP(parseFloat(e.target.value) || 0)}
                                        className="w-full border-slate-200 border p-2.5 rounded-lg text-sm pl-8 focus:border-brand-500" 
                                    />
                                    <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">P</span>
                                </div>
                                <span className="self-center text-slate-400">x</span>
                                <div className="relative w-1/2">
                                    <input 
                                        type="number" 
                                        value={cutL}
                                        onChange={(e) => setCutL(parseFloat(e.target.value) || 0)}
                                        className="w-full border-slate-200 border p-2.5 rounded-lg text-sm pl-8 focus:border-brand-500" 
                                    />
                                    <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-bold">L</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ukuran Plano</label>
                            <select 
                                value={planoType}
                                onChange={(e) => setPlanoType(e.target.value)}
                                className="w-full border-slate-200 border p-2.5 rounded-lg text-sm bg-white focus:border-brand-500"
                            >
                                <option value="61,92">61 x 92 cm</option>
                                <option value="65,100">65 x 100 cm</option>
                                <option value="79,109">79 x 109 cm</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                        <Banknote className="text-brand-600" size={20} />
                        <h2 className="text-lg font-bold text-slate-800">2. Komponen Biaya</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Harga 1 Plano (Rp)</label>
                            <input 
                                type="number" 
                                value={pricePlano}
                                onChange={(e) => setPricePlano(parseFloat(e.target.value) || 0)}
                                className="w-full border-slate-200 border p-2.5 rounded-lg text-sm focus:border-brand-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ongkos Cetak /Pcs (Rp)</label>
                            <input 
                                type="number" 
                                value={priceCetak}
                                onChange={(e) => setPriceCetak(parseFloat(e.target.value) || 0)}
                                className="w-full border-slate-200 border p-2.5 rounded-lg text-sm focus:border-brand-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Biaya Finishing /Pcs (Rp)</label>
                            <input 
                                type="number" 
                                value={priceFinishing}
                                onChange={(e) => setPriceFinishing(parseFloat(e.target.value) || 0)}
                                className="w-full border-slate-200 border p-2.5 rounded-lg text-sm focus:border-brand-500"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Margin Keuntungan (%)</label>
                            <div className="relative">
                                <input 
                                    type="number" 
                                    value={margin}
                                    onChange={(e) => setMargin(parseFloat(e.target.value) || 0)}
                                    className="w-full border-slate-200 border p-2.5 rounded-lg text-sm pr-8 focus:border-brand-500"
                                />
                                <span className="absolute right-3 top-2.5 text-slate-400 text-sm font-bold">%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Result Column */}
            <div className="lg:col-span-2 space-y-6">
                {/* Visualizer */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
                         <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Scissors className="text-brand-600" size={20} />
                            Visualisasi Potongan
                         </h2>
                         <div className="flex gap-2">
                            <span className="bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-bold border border-brand-100">
                                Plano: {results.pPlano}x{results.lPlano}
                            </span>
                            <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
                                Hasil: {results.bestYield} Out
                            </span>
                         </div>
                    </div>

                    <div className="relative w-full aspect-[3/2] bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg overflow-hidden flex flex-wrap content-start p-1 gap-[1px]">
                         {/* Grid Pattern Background */}
                         <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                         
                         {/* Render Boxes */}
                         {renderVisualizer()}
                    </div>
                    <p className="mt-3 text-xs text-slate-400 italic flex items-center gap-1">
                        <AlertTriangle size={12} />
                        Skala visualisasi disesuaikan dengan rasio layar.
                    </p>
                </div>

                {/* Calculation Result Card */}
                <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-600/20 blur-[80px] rounded-full pointer-events-none"></div>
                    
                    <h2 className="text-xl font-display font-bold mb-6 border-b border-slate-700 pb-4 relative z-10">
                        Hasil Kalkulasi
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                <span className="text-slate-400 text-sm">Kebutuhan Plano</span>
                                <span className="font-bold text-white text-lg">{results.planoNeeded} Lembar</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm">Total Biaya Kertas</span>
                                <span className="font-medium text-slate-200">{formatRupiah(results.totalCostKertas)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm">Total Biaya Produksi</span>
                                <span className="font-medium text-slate-200">{formatRupiah(results.totalHPP)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                                <span className="text-brand-300 font-bold text-sm">HPP per Unit</span>
                                <span className="font-bold text-brand-300 text-lg">{formatRupiah(results.hppPerUnit)}</span>
                            </div>
                        </div>

                        <div className="bg-brand-600 p-6 rounded-2xl flex flex-col justify-center items-center text-center shadow-lg shadow-brand-900/50 border border-brand-500">
                            <span className="text-brand-100 text-xs font-bold uppercase tracking-widest mb-2">Rekomendasi Harga Jual</span>
                            <span className="text-3xl md:text-4xl font-black text-white leading-none mb-3">
                                {formatRupiah(Math.ceil(results.hargaJualUnit))}
                            </span>
                            <span className="inline-flex items-center gap-1 bg-brand-800/50 px-3 py-1 rounded-full text-xs text-brand-200 border border-brand-500">
                                Profit Total: {formatRupiah(results.profitTotal)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div className="text-center text-slate-400 text-sm mt-8">
            &copy; 2024 Simulator Edukasi Teknik Grafika - Materi Perhitungan Biaya Produksi
        </div>
      </div>
    </div>
  );
};

export default KalkulasiGrafika;