import { expUnicode, fmtSci } from '../physics'

const LOG_MIN = -16
const LOG_MAX = 0
const W = 1000
const H = 170
const PAD = 30
const AXIS_Y = 92

const REFERENCIAS = [
  { log: Math.log10(8.4e-16), nombre: 'protón', arriba: true },
  { log: -14, nombre: 'núcleo atómico', arriba: false },
  { log: -10, nombre: 'átomo', arriba: true },
  { log: Math.log10(2e-9), nombre: 'hélice de ADN', arriba: false },
  { log: -7, nombre: 'virus', arriba: true },
  { log: Math.log10(7e-5), nombre: 'cabello humano', arriba: false },
  { log: Math.log10(4e-3), nombre: 'hormiga', arriba: true },
  { log: Math.log10(0.22), nombre: 'balón', arriba: false },
]

function xDeLog(log: number): number {
  return PAD + ((log - LOG_MIN) / (LOG_MAX - LOG_MIN)) * (W - 2 * PAD)
}

interface Props {
  lambda: number | null
}

/** Regla logarítmica del universo: ubica la λ calculada entre objetos conocidos */
export default function ScaleRuler({ lambda }: Props) {
  const logL = lambda && lambda > 0 ? Math.log10(lambda) : null
  const fueraIzq = logL !== null && logL < LOG_MIN
  const fueraDer = logL !== null && logL > LOG_MAX
  const xMarca =
    logL === null ? null : xDeLog(Math.min(Math.max(logL, LOG_MIN), LOG_MAX))
  const etiquetaMarca = fueraIzq
    ? `← λ fuera de escala (${fmtSci(lambda!)} m)`
    : fueraDer
      ? `λ fuera de escala (${fmtSci(lambda!)} m) →`
      : 'tu λ'
  const anchorMarca = fueraIzq ? 'start' : fueraDer ? 'end' : 'middle'

  const decadas = []
  for (let e = LOG_MIN; e <= LOG_MAX; e += 2) decadas.push(e)

  return (
    <figure className="ruler">
      <svg viewBox={`0 0 ${W} ${H}`} className="ruler-svg" role="img"
        aria-label="Regla logarítmica de escalas del universo con la longitud de onda calculada">
        {/* eje */}
        <line x1={PAD} y1={AXIS_Y} x2={W - PAD} y2={AXIS_Y} className="ruler-axis" />

        {/* marcas de década */}
        {decadas.map((e) => (
          <g key={e}>
            <line x1={xDeLog(e)} y1={AXIS_Y - 5} x2={xDeLog(e)} y2={AXIS_Y + 5} className="ruler-tick" />
            <text x={xDeLog(e)} y={AXIS_Y + 24} className="ruler-exp" textAnchor="middle">
              10{expUnicode(e)}
            </text>
          </g>
        ))}

        {/* objetos de referencia */}
        {REFERENCIAS.map((r) => {
          const x = xDeLog(r.log)
          const yTxt = r.arriba ? AXIS_Y - 34 : AXIS_Y + 48
          const yLin1 = r.arriba ? AXIS_Y - 26 : AXIS_Y + 36
          return (
            <g key={r.nombre} className="ruler-ref">
              <line x1={x} y1={yLin1} x2={x} y2={AXIS_Y} className="ruler-ref-line" />
              <circle cx={x} cy={AXIS_Y} r={2.6} className="ruler-ref-dot" />
              <text x={x} y={yTxt} textAnchor="middle" className="ruler-ref-txt">
                {r.nombre}
              </text>
            </g>
          )
        })}

        {/* marcador de λ calculada */}
        {xMarca !== null && (
          <g className="ruler-marker" style={{ transform: `translateX(${xMarca}px)` }}>
            <line x1={0} y1={AXIS_Y - 58} x2={0} y2={AXIS_Y} className="ruler-marker-line" />
            <circle cx={0} cy={AXIS_Y} r={5} className="ruler-marker-dot" />
            <circle cx={0} cy={AXIS_Y} r={5} className="ruler-marker-pulse" />
            <text x={0} y={AXIS_Y - 68} textAnchor={anchorMarca} className="ruler-marker-txt">
              {etiquetaMarca}
            </text>
          </g>
        )}
      </svg>
      <figcaption className="ruler-caption">
        Cada paso en la regla multiplica el tamaño por 100. Si λ cae cerca del
        átomo, los efectos ondulatorios son observables; si cae fuera de la
        regla por la izquierda, ningún experimento podrá detectarlos.
      </figcaption>
    </figure>
  )
}
