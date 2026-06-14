const FORMULAS = [
  {
    eq: 'λ = h / p',
    nombre: 'Relación de de Broglie',
    texto:
      'Toda partícula con cantidad de movimiento p tiene una onda asociada de longitud λ. A mayor momento, menor longitud de onda.',
    tono: 'wave',
  },
  {
    eq: 'p = m · v',
    nombre: 'Momento no relativista',
    texto:
      'Para velocidades pequeñas frente a la de la luz, la cantidad de movimiento es simplemente masa por velocidad.',
    tono: 'wave',
  },
  {
    eq: 'Δx · Δp ≥ ħ / 2',
    nombre: 'Principio de incertidumbre',
    texto:
      'Posición y momento no pueden conocerse simultáneamente con precisión arbitraria. Es una propiedad fundamental de la naturaleza, no un límite tecnológico.',
    tono: 'amber',
  },
  {
    eq: 'ħ = h / 2π',
    nombre: 'Constante reducida de Planck',
    texto:
      'Aparece de forma natural en las ecuaciones de la mecánica cuántica. Su pequeñez explica por qué el mundo cotidiano parece clásico.',
    tono: 'amber',
  },
]

const SIMBOLOS = [
  { s: 'λ', sig: 'longitud de onda de de Broglie', u: 'm' },
  { s: 'h', sig: 'constante de Planck = 6,626 × 10⁻³⁴', u: 'J·s' },
  { s: 'ħ', sig: 'constante reducida = 1,055 × 10⁻³⁴', u: 'J·s' },
  { s: 'p', sig: 'cantidad de movimiento', u: 'kg·m/s' },
  { s: 'm', sig: 'masa de la partícula', u: 'kg' },
  { s: 'v', sig: 'velocidad', u: 'm/s' },
  { s: 'Δx', sig: 'incertidumbre en la posición', u: 'm' },
  { s: 'Δp', sig: 'incertidumbre en el momento', u: 'kg·m/s' },
]

export default function Formulas() {
  return (
    <section className="seccion" id="formulas">
      <div className="seccion-head">
        <span className="seccion-num">03</span>
        <div>
          <h2 className="seccion-titulo">
            Las <em>fórmulas</em>
          </h2>
          <p className="seccion-lede">
            Todo este laboratorio se sostiene sobre cuatro relaciones. Esto es
            lo que significa cada símbolo y cada ecuación.
          </p>
        </div>
      </div>

      <div className="formulas-grid">
        {FORMULAS.map((f) => (
          <article key={f.nombre} className={`formula formula-${f.tono}`}>
            <p className="formula-eq">{f.eq}</p>
            <h3 className="formula-nombre">{f.nombre}</h3>
            <p className="formula-texto">{f.texto}</p>
          </article>
        ))}
      </div>

      <div className="simbolos">
        <table className="simbolos-tabla">
          <thead>
            <tr>
              <th>símbolo</th>
              <th>significado</th>
              <th>unidad SI</th>
            </tr>
          </thead>
          <tbody>
            {SIMBOLOS.map((s) => (
              <tr key={s.s}>
                <td className="simbolo">{s.s}</td>
                <td>{s.sig}</td>
                <td className="mono-sm">{s.u}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
