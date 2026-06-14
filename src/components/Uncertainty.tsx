import { useEffect, useMemo, useRef, useState } from 'react'
import { MASAS_REF, deltaPmin, fmtSci, interpretarDelta } from '../physics'
import SciNumber from './SciNumber'

const LOG_MIN = -12
const LOG_MAX = -1

/**
 * Visualización del paquete de ondas: espacio de posición (izquierda)
 * y espacio de momento (derecha). Comprimir uno ensancha el otro.
 */
function WavePacket({ frac }: { frac: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const target = useRef(frac)
  target.current = frac

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    let raf = 0
    let w = 0
    let h = 0
    let actual = target.current

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = (t: number) => {
      // el ancho del paquete persigue suavemente al slider
      actual += (target.current - actual) * 0.12
      ctx.clearRect(0, 0, w, h)

      const mitad = w / 2
      const cyL = h * 0.5
      const ampMax = h * 0.36
      const time = t / 1000

      // anchos visuales conjugados: σx · σp = constante
      const sMin = 9
      const sMax = Math.min(mitad * 0.38, 130)
      const sigmaX = sMin + (sMax - sMin) * actual
      const sigmaP = (sMin * sMax) / sigmaX

      // divisor central
      ctx.strokeStyle = 'rgba(140,160,200,0.15)'
      ctx.lineWidth = 1
      ctx.setLineDash([4, 6])
      ctx.beginPath()
      ctx.moveTo(mitad, 14)
      ctx.lineTo(mitad, h - 14)
      ctx.stroke()
      ctx.setLineDash([])

      // ---- IZQUIERDA: paquete en el espacio de posición ----
      const cxL = mitad / 2
      const k = 0.55 // número de onda portadora (visual)

      // envolvente gaussiana (±)
      for (const signo of [1, -1]) {
        ctx.beginPath()
        for (let x = 14; x <= mitad - 14; x += 2) {
          const dx = x - cxL
          const env = Math.exp(-(dx * dx) / (2 * sigmaX * sigmaX))
          const y = cyL - signo * env * ampMax
          if (x === 14) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = 'rgba(98,217,255,0.25)'
        ctx.lineWidth = 1
        ctx.setLineDash([3, 5])
        ctx.stroke()
        ctx.setLineDash([])
      }

      // onda portadora dentro de la envolvente
      ctx.beginPath()
      for (let x = 14; x <= mitad - 14; x += 1.5) {
        const dx = x - cxL
        const env = Math.exp(-(dx * dx) / (2 * sigmaX * sigmaX))
        const y = cyL - env * ampMax * Math.cos(k * dx - time * 4)
        if (x === 14) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(98,217,255,0.14)'
      ctx.lineWidth = 6
      ctx.stroke()
      ctx.strokeStyle = 'rgba(98,217,255,0.95)'
      ctx.lineWidth = 1.6
      ctx.stroke()

      // ---- DERECHA: distribución en el espacio de momento ----
      const cxR = mitad + mitad / 2
      ctx.beginPath()
      ctx.moveTo(mitad + 14, cyL + ampMax)
      for (let x = mitad + 14; x <= w - 14; x += 2) {
        const dx = x - cxR
        const g = Math.exp(-(dx * dx) / (2 * sigmaP * sigmaP))
        ctx.lineTo(x, cyL + ampMax - g * ampMax * 1.7)
      }
      ctx.lineTo(w - 14, cyL + ampMax)
      ctx.closePath()
      const grad = ctx.createLinearGradient(0, cyL - ampMax, 0, cyL + ampMax)
      grad.addColorStop(0, 'rgba(255,180,84,0.55)')
      grad.addColorStop(1, 'rgba(255,180,84,0.04)')
      ctx.fillStyle = grad
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,180,84,0.9)'
      ctx.lineWidth = 1.6
      ctx.stroke()

      // línea base derecha
      ctx.strokeStyle = 'rgba(140,160,200,0.25)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(mitad + 14, cyL + ampMax)
      ctx.lineTo(w - 14, cyL + ampMax)
      ctx.stroke()

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="packet-canvas" aria-hidden="true" />
}

export default function Uncertainty() {
  const [logDx, setLogDx] = useState(-10)
  const [masaId, setMasaId] = useState('electron')

  const dx = 10 ** logDx
  const dp = deltaPmin(dx)
  const masaRef = MASAS_REF.find((m) => m.id === masaId)!
  const dv = dp / masaRef.m
  const frac = (logDx - LOG_MIN) / (LOG_MAX - LOG_MIN)

  const interpretacion = useMemo(
    () => interpretarDelta(dx, dp, masaRef.m, masaRef.nombre),
    [dx, dp, masaRef],
  )

  return (
    <section className="seccion" id="incertidumbre">
      <div className="seccion-head">
        <span className="seccion-num">02</span>
        <div>
          <h2 className="seccion-titulo">
            Principio de <em>incertidumbre</em>
          </h2>
          <p className="seccion-lede">
            Heisenberg en vivo: comprime el paquete de ondas para localizar la
            partícula (Δx pequeño) y observa cómo se ensancha inevitablemente su
            distribución de momentos. <span className="mono">Δx · Δp ≥ ħ / 2</span>{' '}
            no es un defecto de los instrumentos — es la geometría de las ondas.
          </p>
        </div>
      </div>

      <div className="panel panel-packet">
        <div className="packet-vis">
          <WavePacket frac={frac} />
          <div className="packet-leyendas">
            <span className="leyenda leyenda-wave">espacio de posición · Δx</span>
            <span className="leyenda leyenda-amber">espacio de momento · Δp</span>
          </div>
        </div>

        <div className="packet-controles">
          <label className="slider-label" htmlFor="dx">
            incertidumbre en posición&nbsp;
            <span className="mono slider-valor">Δx = {fmtSci(dx, 3)} m</span>
          </label>
          <input
            id="dx"
            className="slider"
            type="range"
            min={LOG_MIN}
            max={LOG_MAX}
            step={0.01}
            value={logDx}
            onChange={(e) => setLogDx(Number(e.target.value))}
          />
          <div className="slider-extremos">
            <span>10⁻¹² m · núcleo</span>
            <span>10⁻¹ m · cotidiano</span>
          </div>

          <div className="packet-datos">
            <div className="dato">
              <p className="dato-label">incertidumbre mínima en momento</p>
              <p className="dato-valor dato-amber">
                Δp ≥ <SciNumber value={dp} unidad="kg·m/s" />
              </p>
            </div>
            <div className="dato">
              <p className="dato-label">
                equivalente en velocidad para{' '}
                <select
                  className="dato-select"
                  value={masaId}
                  onChange={(e) => setMasaId(e.target.value)}
                  aria-label="Partícula de referencia"
                >
                  {MASAS_REF.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
              </p>
              <p className="dato-valor">
                Δv ≥ <SciNumber value={dv} unidad="m/s" />
              </p>
            </div>
            <div className="dato dato-invariante">
              <p className="dato-label">el producto nunca baja de ħ/2</p>
              <p className="dato-valor mono-sm">
                Δx · Δp = <SciNumber value={dx * dp} unidad="J·s" /> ={' '}
                <span className="nowrap">ħ / 2</span>
              </p>
            </div>
          </div>

          <p className="packet-interpretacion">{interpretacion}</p>
        </div>
      </div>
    </section>
  )
}
