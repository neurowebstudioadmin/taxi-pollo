'use client'
import { motion } from 'framer-motion'
import NeonButton from '@/components/NeonButton'
import Link from 'next/link'

const categories = [
  { name: 'Pollo Intero', products: 12, img: '/pollo-categoria.jpg' },
  { name: 'Pezzi di Pollo', products: 8, img: '/pezzi-pollo.jpg' },
  { name: 'Carne Mista', products: 15, img: '/carne-mista.jpg' },
  { name: 'Preparati', products: 10, img: '/preparati.jpg' }
]

export default function Prodotti() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-24 px-4 relative">
      <div className="speed-lines top-32 opacity-20"></div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-black text-center bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-20"
        >
          Il Nostro Catalogo
        </motion.h1>

        {/* Category Filters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-4xl mx-auto">
          {categories.map((cat, i) => (
            <Link href={`/prodotti?cat=${cat.name}`} key={cat.name}>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 bg-black/30 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-yellow-400/50 cursor-pointer"
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-700 to-black">
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-2 group-hover:text-yellow-400">{cat.name}</h3>
                <p className="text-yellow-400 font-bold text-center">{cat.products} prodotti</p>
              </motion.div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <NeonButton asChild>
            <Link href="/checkout">Vai al Carrello</Link>
          </NeonButton>
        </div>
      </motion.div>
    </main>
  )
}
