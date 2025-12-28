'use client';
import { useState, useEffect } from 'react';

interface Prodotto {
  nome: string;
  descrizione: string;
  prezzo: string;
}

interface InfoBox {
  titolo: string;
  testo: string;
  bordo: string;
}

interface Programma {
  giorno: string;
  data: string;
  citta: string[];
  orario: string;
  luogo: string;
}

export default function HomeInterna() {
  const [carrello, setCarrello] = useState<Prodotto[]>([]);
  const [nome, setNome] = useState('');
  const [telefono, setTelefono] = useState('');
  const [indirizzo, setIndirizzo] = useState('');
  const [citta, setCitta] = useState('Barletta');
  const [metodoPagamento, setMetodoPagamento] = useState('stripe-completo');
  const [prodottiDinamici, setProdottiDinamici] = useState<Prodotto[]>([]);
  const [programmazione, setProgrammazione] = useState<Programma[]>([]);
  const [loading, setLoading] = useState(true);

  // Carica dati dinamici
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodottiRes, cittaRes] = await Promise.all([
          fetch('/api/prodotti'),
          fetch('/api/citta')
        ]);

        if (prodottiRes.ok) {
          const data = await prodottiRes.json();
          setProdottiDinamici(data);
        }

        if (cittaRes.ok) {
          const data = await cittaRes.json();
          setProgrammazione(data);
          if (data.length > 0 && data[0].citta.length > 0) {
            setCitta(data[0].citta.join(', '));
          }
        }
      } catch (error) {
        console.error('Errore caricamento dati:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

    const prodottiFallback: Prodotto[] = [
    { nome: 'Pollo intero arrosto', descrizione: 'Marinato alle erbe, cottura lenta alla pugliese.', prezzo: '€ 12,90' },
    { nome: 'Mezzo pollo arrosto', descrizione: 'Perfetto per 1-2 persone, crosta croccante.', prezzo: '€ 7,50' },
    { nome: 'Alette piccanti', descrizione: 'Stile street food, ideali con birra e amici.', prezzo: '€ 8,50' },
  ];

  const aggiungiAlCarrello = (nome: string, descrizione: string, prezzo: string) => {
    setCarrello([...carrello, { nome, descrizione, prezzo }]);
  };

  const svuotaCarrello = () => {
    setCarrello([]);
    setNome('');
    setTelefono('');
    setIndirizzo('');
    setCitta(programmazione[0]?.citta?.join(', ') || 'Barletta');
    setMetodoPagamento('stripe-completo');
  };

  const totale = carrello.reduce((sum, item) => {
  let prezzoNum: number;
  if (typeof item.prezzo === 'string') {
    prezzoNum = parseFloat(item.prezzo.replace('€ ', '').replace('/ kg', ''));
  } else {
    prezzoNum = Number(item.prezzo);
  }
  return isNaN(prezzoNum) ? sum : sum + prezzoNum;
}, 0).toFixed(2);


    const inviaOrdine = () => {
    const messaggio = `🚀 NUOVO ORDINE TAXI POLLO

👤 ${nome || 'Non specificato'}
📱 ${telefono || 'Non specificato'}
📍 ${citta} - ${indirizzo || 'Non specificato'}

📦 ORDINE:
${carrello.map(p => `• ${p.nome} ${p.prezzo}`).join('\n')}
💰 TOTALE: €${totale}

💳 PAGAMENTO: ${metodoPagamento === 'acconto' ? 'Contanti/POS (+€10 acconto)' : metodoPagamento === 'stripe-completo' ? 'Stripe completo' : 'Satispay'}`;

    const numeroAmico = '393491234567'; 
    const whatsappUrl = `https://wa.me/39${numeroAmico}?text=${encodeURIComponent(messaggio)}`;
    window.open(whatsappUrl, '_blank');
    svuotaCarrello();
  };

    // Info boxes dinamiche
  const tutteCitta = programmazione.flatMap(g => g.citta).filter((c, i, arr) => arr.indexOf(c) === i);
  const infoBoxes: InfoBox[] = [
    { 
      titolo: 'Zone coperte', 
      testo: tutteCitta.length > 0 ? tutteCitta.join(', ') : 'Citta della provincia BAT e provincia di Bari (raggio servizio dedicato).', 
      bordo: 'rgba(250,204,21,0.5)' 
    },
    { titolo: 'Tempi di consegna', testo: 'In media 30 minuti dal momento dell ordine.', bordo: 'rgba(34,197,94,0.6)' },
    { 
      titolo: 'Orari servizio', 
      testo: programmazione.length > 0 
        ? `Prossimi: ${programmazione.slice(0,2).map(g => `${g.giorno} ${g.orario}`).join(', ')}`
        : 'Tutti i giorni 11:30 - 14:30 e 18:30 - 22:30.', 
      bordo: 'rgba(59,130,246,0.6)' 
    },
    { titolo: 'Qualita carne', testo: 'Tagli freschi selezionati ogni mattina.', bordo: 'rgba(249,115,22,0.6)' },
  ];

  const prodottiDaMostrare = prodottiDinamici.length > 0 ? prodottiDinamici : prodottiFallback;

    if (loading) {
    return (
      <main style={{ minHeight: '100vh', background: 'radial-gradient(circle at top, #020617 0, #000000 60%)', color: 'white', padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px', background: 'linear-gradient(90deg, #FACC15 0%, #FB923C 40%, #F97316 80%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Taxi Pollo
          </div>
          <div style={{ fontSize: '18px', opacity: 0.8 }}>Caricamento menu...</div>
        </div>
      </main>
    );
  }

    return (
    <main style={{ minHeight: '100vh', background: 'radial-gradient(circle at top, #020617 0, #000000 60%)', color: 'white', padding: '24px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '1100px', marginTop: '72px', marginBottom: '32px', borderRadius: '24px', padding: '32px 24px 40px', background: 'linear-gradient(135deg, rgba(15,23,42,0.96), rgba(17,24,39,0.98))', border: '1px solid rgba(250,204,21,0.25)', boxShadow: '0 0 40px rgba(0,0,0,0.8)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '40px', marginBottom: '8px', background: 'linear-gradient(90deg, #FACC15 0%, #FB923C 40%, #F97316 80%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Taxi Pollo – consegna carne stile taxi
            </h1>
            <p style={{ fontSize: '18px', opacity: 0.85 }}>
              Ordini pollo e carne mista come chiameresti un taxi: scegli la fascia oraria, noi arriviamo veloci e puntuali.
            </p>
          </div>

          {/* Taximetro live */}
          <div style={{ display: 'flex', gap: '16px', alignItems: 'end' }}>
            <div style={{ padding: '16px 20px', borderRadius: '16px', background: 'radial-gradient(circle at top, rgba(15,23,42,1), rgba(3,7,18,1))', border: '1px solid rgba(250,204,21,0.5)', minWidth: '220px' }}>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.7, marginBottom: '4px' }}>Tariffa corsa carne</div>
              <div style={{ fontFamily: 'monospace', fontSize: '20px', color: '#FACC15', marginBottom: '4px' }}>
                {carrello.length > 0 ? `${carrello.length} items` : '30 min · 15 km'}
              </div>
              <div style={{ fontSize: '12px', opacity: 0.7 }}>
                {carrello.length > 0 ? `€${totale}` : 'Consegna media · Puglia (BAT e Bari)'}
              </div>
            </div>
          </div>
        </div>

        {/* Info boxes */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '18px', marginBottom: '32px' }}>
          {infoBoxes.map((box) => (
            <div key={box.titolo} style={{ flex: '1 1 220px', padding: '16px 20px', borderRadius: '18px', background: 'rgba(15,23,42,0.95)', border: `1px solid ${box.bordo}` }}>
              <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>{box.titolo}</div>
              <div style={{ fontSize: '14px', opacity: 0.85 }}>{box.testo}</div>
            </div>
          ))}
        </div>
        {/* Prodotti */}
        <div>
          <h2 style={{ fontSize: '26px', marginBottom: '16px', color: '#FACC15' }}>
            {prodottiDinamici.length > 0 ? 'Menu dal pannello admin' : 'Corsa rapida: i piatti più richiesti'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
            {prodottiDaMostrare.map((p) => (
              <div key={p.nome} style={{ padding: '18px 20px', borderRadius: '18px', background: 'linear-gradient(145deg, rgba(15,23,42,0.98), rgba(3,7,18,0.95))', border: '1px solid rgba(31,41,55,0.9)', boxShadow: '0 12px 25px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '4px' }}>{p.nome}</div>
                  <div style={{ fontSize: '14px', opacity: 0.85 }}>{p.descrizione}</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: '#FACC15' }}>{p.prezzo}</span>
                  <button onClick={() => aggiungiAlCarrello(p.nome, p.descrizione, p.prezzo)} style={{ padding: '8px 16px', borderRadius: '999px', border: '1px solid rgba(250,204,21,0.7)', background: 'linear-gradient(90deg, #FACC15 0%, #FB923C 50%, #F97316 100%)', color: '#000', fontWeight: 700, fontSize: '14px', cursor: 'pointer', boxShadow: '0 0 16px rgba(250,204,21,0.7)' }}>
                    Aggiungi
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Carrello */}
        {carrello.length > 0 && (
          <div style={{ marginTop: '40px', padding: '24px', background: 'rgba(15,23,42,0.95)', borderRadius: '20px', border: '1px solid rgba(250,204,21,0.3)' }}>
            <h3 style={{ color: '#FACC15', marginBottom: '16px', fontSize: '22px' }}>Il tuo carrello 🛒</h3>
            
            <button onClick={svuotaCarrello} style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.5)', color: '#FCA5A5', fontSize: '12px', cursor: 'pointer', marginBottom: '16px' }}>
              🗑️ Svuota carrello
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {carrello.map((p, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: 'rgba(31,41,55,0.5)', borderRadius: '12px' }}>
                  <span>{p.nome}</span>
                  <span style={{ color: '#FACC15', fontWeight: 700 }}>{p.prezzo}</span>
                </div>
              ))}
            </div>
            
            {/* FORM ORDINE */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input 
                value={nome} 
                onChange={(e) => setNome(e.target.value)}
                placeholder="👤 Nome e Cognome *" 
                style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(250,204,21,0.3)', background: 'rgba(15,23,42,0.8)', color: 'white', fontSize: '16px' }} 
              />
              <input 
                value={telefono} 
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="📱 Il tuo numero WhatsApp *" 
                style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(250,204,21,0.3)', background: 'rgba(15,23,42,0.8)', color: 'white', fontSize: '16px' }} 
              />
              <input 
                value={indirizzo} 
                onChange={(e) => setIndirizzo(e.target.value)}
                placeholder="📍 Indirizzo completo (es: Via Example 123)" 
                style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(250,204,21,0.3)', background: 'rgba(15,23,42,0.8)', color: 'white', fontSize: '16px' }} 
              />
              <select 
                value={citta} 
                onChange={(e) => setCitta(e.target.value)}
                style={{ padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(250,204,21,0.3)', background: 'rgba(15,23,42,0.8)', color: 'white', fontSize: '16px' }}
              >
                {programmazione.map((giorno: Programma, index: number) => (
                  <option key={index} value={giorno.citta.join(', ')}>
                    📍 {giorno.citta.join(', ')} - {giorno.giorno} {giorno.data} {giorno.orario}
                  </option>
                ))}
                <option>📍 Barletta (fallback)</option>
              </select>
              {/* PAGAMENTI */}
              <div style={{ padding: '16px', background: 'rgba(31,41,55,0.5)', borderRadius: '12px' }}>
                <h4 style={{ color: '#FACC15', marginBottom: '12px', fontSize: '16px' }}>💳 Metodo pagamento</h4>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
                  <input type="radio" value="acconto" checked={metodoPagamento === 'acconto'} onChange={(e) => setMetodoPagamento(e.target.value)} style={{ accentColor: '#FACC15' }} />
                  <span>💰 Contanti/POS alla consegna <strong>(+€10 acconto)</strong></span>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
                  <input type="radio" value="stripe-completo" checked={metodoPagamento === 'stripe-completo'} onChange={(e) => setMetodoPagamento(e.target.value)} style={{ accentColor: '#FACC15' }} />
                  <span>💳 Paga tutto ora (Stripe)</span>
                </label>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
                  <input type="radio" value="satispay" checked={metodoPagamento === 'satispay'} onChange={(e) => setMetodoPagamento(e.target.value)} style={{ accentColor: '#FACC15' }} />
                  <span>📱 Satispay</span>
                </label>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid rgba(250,204,21,0.3)' }}>
                <span style={{ fontSize: '24px', fontWeight: '800', color: '#FACC15' }}>Totale: €{totale}</span>
                <button 
                  onClick={inviaOrdine}
                  style={{ padding: '16px 32px', borderRadius: '16px', background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)', color: 'white', fontWeight: '700', fontSize: '18px', border: 'none', cursor: 'pointer', boxShadow: '0 8px 25px rgba(16,185,129,0.4)' }}
                >
                  🚀 Invia ordine WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
