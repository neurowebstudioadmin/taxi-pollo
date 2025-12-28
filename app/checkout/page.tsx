'use client'
import { motion } from 'framer-motion'
import { MapPin, CreditCard, Truck, CheckCircle } from 'lucide-react'
import NeonButton from '@/components/NeonButton'
import { useState } from 'react'

export default function Checkout() {
  const [step, setStep] = useState(1)

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-24 px-4 relative">
      <div className="speed-lines top-32 opacity-10"></div>
      
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="flex justify-center mb-16">
          {[1,2,3].map((s) => (
            <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mx-2 ${step >= s ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/50' : 'bg-gray-800 text-white/50 border-2 border-white/30'}`}>
              {s}
            </div>
          ))}
        </div>

        {/* Step 1: Indirizzo */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent text-center">
              1. Dove consegno?
            </h2>
            <div className="p-8 bg-black/40 backdrop-blur-xl rounded-3xl border border-yellow-500/30">
              <div className="flex items-center space-x-4 mb-8 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl">
                <MapPin className="w-12 h-12 text-yellow-400" />
                <div>
                  <div className="text-2xl font-bold text-white">Via Example 123</div>
                  <div className="text-green-400 font-bold text-lg">✅ Monaco Centro - €2.50</div>
                </div>
              </div>
            </div>
            <div className="flex gap-4 pt-8 border-t border-white/20">
              <NeonButton className="flex-1" onClick={() => setStep(2)}>
                Prosegui a Pagamento
              </NeonButton>
            </div>
          </motion.div>
        )}

        {/* Step 2: Pagamento */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent text-center">
              2. Come Paghi?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { icon: CreditCard, label: 'Carta 💳', color: 'blue' },
                { icon: Truck, label: 'Contanti alla Consegna 🚕', color: 'green' }
              ].map(({ icon: Icon, label, color }) => (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="p-8 bg-gradient-to-br from-black/50 to-transparent backdrop-blur-xl rounded-3xl border-2 border-white/20 hover:border-[color:var(--color)]/50 group"
                  style={{ '--color': color } as React.CSSProperties}
                >
                  <Icon className="w-16 h-16 mx-auto mb-4 text-[var(--color)] group-hover:scale-110 transition-transform" style={{ '--color': `${color}-400` } as React.CSSProperties} />
                  <div className="text-2xl font-bold text-white">{label}</div>
                </motion.button>
              ))}
            </div>
            <div className="flex gap-4 pt-8 border-t border-white/20">
              <NeonButton className="flex-1 !bg-gray-800 !text-white !border-2 !border-white/50" onClick={() => setStep(1)}>
                ← Indietro
              </NeonButton>
              <NeonButton className="flex-1" onClick={() => setStep(3)}>
                Conferma Ordine
              </NeonButton>
            </div>
          </motion.div>
        )}

        {/* Step 3: Conferma */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-12"
          >
            <CheckCircle className="w-48 h-48 mx-auto text-green-500 animate-bounce" />
            <div>
              <h2 className="text-5xl font-black bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-6">
                PARTENZA!
              </h2>
              <div className="text-4xl font-mono text-yellow-400 mb-8 animate-pulse">
                Il tuo Taxi Pollo è in arrivo...
              </div>
              <div className="bg-black/50 backdrop-blur-xl p-8 rounded-3xl border border-green-500/30">
                <div className="text-6xl font-bold text-green-400 mb-4">⏱️ 28:42</div>
                <div className="text-xl text-white/80">Tempo stimato di arrivo</div>
              </div>
            </div>
            <NeonButton className="text-xl px-16 py-8">
              Traccia Ordine Live
            </NeonButton>
          </motion.div>
        )}
      </div>
    </main>
  )
}
