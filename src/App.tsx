import Hero from './components/Hero'
import BroglieCalc from './components/BroglieCalc'
import Uncertainty from './components/Uncertainty'
import Formulas from './components/Formulas'

export default function App() {
  return (
    <div className="app">
      <Hero />
      <main className="contenido">
        <BroglieCalc />
        <Uncertainty />
        <Formulas />
      </main>
      <footer className="footer">
        <p className="footer-marca">
          ONDA<span className="hero-dot">.</span>
        </p>
        <p className="footer-texto">
          Laboratorio de Ondas de Materia · Trabajo final — Electiva Física ·
          Escuela Tecnológica Instituto Técnico Central · 2026
        </p>
        <p className="footer-const mono-sm">
          h = 6,62607015 × 10⁻³⁴ J·s &nbsp;·&nbsp; ħ = 1,054571817 × 10⁻³⁴ J·s
        </p>
      </footer>
    </div>
  )
}
