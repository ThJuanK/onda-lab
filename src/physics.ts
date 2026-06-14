// Constantes físicas (CODATA 2018, valores exactos del SI)
export const H = 6.62607015e-34 // constante de Planck [J·s]
export const HBAR = 1.054571817e-34 // constante reducida ħ = h/2π [J·s]

// ---------- Cálculos ----------

/** Longitud de onda de de Broglie: λ = h / p */
export function lambdaDeBroglie(p: number): number {
  return H / p
}

/** Cantidad de movimiento no relativista: p = m·v */
export function momentum(m: number, v: number): number {
  return m * v
}

/** Incertidumbre mínima en momento: Δp = ħ / (2·Δx) */
export function deltaPmin(dx: number): number {
  return HBAR / (2 * dx)
}

// ---------- Clasificación de escala ----------

export type Escala = 'cuantica' | 'mesoscopica' | 'clasica'

export function clasificarLambda(lambda: number): Escala {
  if (lambda >= 1e-11) return 'cuantica'
  if (lambda >= 1e-16) return 'mesoscopica'
  return 'clasica'
}

export const ESCALA_INFO: Record<
  Escala,
  { etiqueta: string; titulo: string; color: string }
> = {
  cuantica: {
    etiqueta: 'Escala cuántica · microscópica',
    titulo: 'El comportamiento ondulatorio domina',
    color: 'var(--wave)',
  },
  mesoscopica: {
    etiqueta: 'Escala mesoscópica',
    titulo: 'Frontera entre lo cuántico y lo clásico',
    color: 'var(--meso)',
  },
  clasica: {
    etiqueta: 'Escala macroscópica · clásica',
    titulo: 'La onda existe, pero es imperceptible',
    color: 'var(--amber)',
  },
}

export function interpretarLambda(lambda: number): string {
  const esc = clasificarLambda(lambda)
  const valor = fmtSci(lambda)
  if (esc === 'cuantica') {
    return (
      `Una longitud de onda de ${valor} m es comparable o mayor que el tamaño de un átomo (~10⁻¹⁰ m). ` +
      `A esta escala la materia se comporta como onda: puede difractarse e interferir, ` +
      `tal como se confirmó experimentalmente con electrones (Davisson–Germer, 1927).`
    )
  }
  if (esc === 'mesoscopica') {
    return (
      `Con λ = ${valor} m la onda asociada es mucho menor que un átomo, pero todavía no es absurdamente pequeña. ` +
      `En esta frontera viven los experimentos límite: moléculas como el fulereno C₆₀ (λ ≈ 2,5 × 10⁻¹² m) ` +
      `aún muestran interferencia en condiciones de laboratorio muy controladas.`
    )
  }
  return (
    `Una longitud de onda de ${valor} m es inconmensurablemente menor que cualquier cosa medible ` +
    `(el núcleo atómico mide ~10⁻¹⁵ m). Por eso los objetos cotidianos parecen partículas clásicas: ` +
    `su onda de de Broglie existe en la teoría, pero ningún experimento podría detectarla.`
  )
}

export function interpretarDelta(dx: number, dp: number, m: number, nombreMasa: string): string {
  const dv = dp / m
  if (dx <= 1e-9) {
    return (
      `Confinar la posición a Δx = ${fmtSci(dx)} m exige una incertidumbre mínima en el momento de ` +
      `Δp = ${fmtSci(dp)} kg·m/s. Para ${nombreMasa} eso equivale a Δv ≈ ${fmtSci(dv)} m/s: ` +
      `a escala atómica, localizar una partícula la obliga a "moverse" violentamente. ` +
      `Esta es la razón profunda por la que los electrones no colapsan sobre el núcleo.`
    )
  }
  if (dx <= 1e-4) {
    return (
      `Con Δx = ${fmtSci(dx)} m, la incertidumbre mínima es Δp = ${fmtSci(dp)} kg·m/s ` +
      `(Δv ≈ ${fmtSci(dv)} m/s para ${nombreMasa}). El límite cuántico existe, ` +
      `pero empieza a ser tan pequeño que se confunde con el ruido de cualquier instrumento real.`
    )
  }
  return (
    `A escala humana (Δx = ${fmtSci(dx)} m) el principio impone apenas Δp = ${fmtSci(dp)} kg·m/s, ` +
    `es decir Δv ≈ ${fmtSci(dv)} m/s para ${nombreMasa}. Un límite ridículamente pequeño: ` +
    `por eso la mecánica clásica funciona perfectamente para describir el mundo cotidiano.`
  )
}

// ---------- Presets de partículas ----------

export interface Preset {
  id: string
  nombre: string
  detalle: string
  m: number
  v: number
}

export const PRESETS: Preset[] = [
  {
    id: 'electron',
    nombre: 'Electrón',
    detalle: 'en un átomo de hidrógeno',
    m: 9.109e-31,
    v: 2.19e6,
  },
  {
    id: 'neutron',
    nombre: 'Neutrón térmico',
    detalle: 'usado en difracción de cristales',
    m: 1.675e-27,
    v: 2200,
  },
  {
    id: 'fulereno',
    nombre: 'Fulereno C₆₀',
    detalle: 'récord de interferencia (1999)',
    m: 1.197e-24,
    v: 220,
  },
  {
    id: 'polvo',
    nombre: 'Grano de polvo',
    detalle: 'flotando en el aire',
    m: 1e-12,
    v: 0.001,
  },
  {
    id: 'balon',
    nombre: 'Balón de fútbol',
    detalle: 'tiro libre a 30 m/s',
    m: 0.43,
    v: 30,
  },
  {
    id: 'persona',
    nombre: 'Persona',
    detalle: 'caminando a 1,4 m/s',
    m: 70,
    v: 1.4,
  },
]

// Masas de referencia para convertir Δp → Δv en la sección de incertidumbre
export const MASAS_REF = [
  { id: 'electron', nombre: 'un electrón', m: 9.109e-31 },
  { id: 'proton', nombre: 'un protón', m: 1.673e-27 },
  { id: 'persona', nombre: 'una persona (70 kg)', m: 70 },
]

// ---------- Formato de notación científica ----------

export interface Sci {
  mantisa: number
  exponente: number
}

export function descomponer(x: number): Sci {
  if (x === 0 || !isFinite(x)) return { mantisa: 0, exponente: 0 }
  const exponente = Math.floor(Math.log10(Math.abs(x)))
  const mantisa = x / Math.pow(10, exponente)
  return { mantisa, exponente }
}

const SUPER = '⁰¹²³⁴⁵⁶⁷⁸⁹'

export function expUnicode(e: number): string {
  const s = Math.abs(e)
    .toString()
    .split('')
    .map((d) => SUPER[Number(d)])
    .join('')
  return (e < 0 ? '⁻' : '') + s
}

/** Formatea en notación científica con superíndices unicode, p. ej. "3,32 × 10⁻¹⁰" */
export function fmtSci(x: number, digitos = 3): string {
  if (x === 0) return '0'
  const { mantisa, exponente } = descomponer(x)
  const m = mantisa.toPrecision(digitos).replace('.', ',')
  if (exponente === 0) return m
  return `${m} × 10${expUnicode(exponente)}`
}
