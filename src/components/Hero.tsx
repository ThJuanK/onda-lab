import { useEffect, useRef } from 'react'

/** Fondo: superposición de ondas viajeras dibujada en canvas */
function WaveField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const ctx = canvas.getContext('2d')!
    let raf = 0
    let w = 0
    let h = 0

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

    // Cada capa es una superposición de tres armónicos viajando a velocidades distintas
    const capas = [
      { yc: 0.38, amp: 26, alpha: 0.5, vel: 0.55, color: '98, 217, 255' },
      { yc: 0.52, amp: 38, alpha: 0.28, vel: -0.35, color: '98, 217, 255' },
      { yc: 0.66, amp: 20, alpha: 0.16, vel: 0.22, color: '255, 180, 84' },
    ]

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      const time = t / 1000
      for (const capa of capas) {
        ctx.beginPath()
        for (let x = 0; x <= w; x += 3) {
          const fase = time * capa.vel
          const y =
            capa.yc * h +
            capa.amp *
              (Math.sin(x * 0.008 + fase * 2.2) * 0.55 +
                Math.sin(x * 0.013 - fase * 3.1) * 0.3 +
                Math.sin(x * 0.021 + fase * 4.7) * 0.15)
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        // trazo doble: halo ancho + línea fina (efecto fósforo)
        ctx.strokeStyle = `rgba(${capa.color}, ${capa.alpha * 0.18})`
        ctx.lineWidth = 7
        ctx.stroke()
        ctx.strokeStyle = `rgba(${capa.color}, ${capa.alpha})`
        ctx.lineWidth = 1.4
        ctx.stroke()
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={ref} className="hero-canvas" aria-hidden="true" />
}

export default function Hero() {
  return (
    <header className="hero">
      <WaveField />
      <div className="hero-inner">
        <p className="hero-kicker anim a1">
          Electiva Física · Ondas de Broglie &amp; Principio de incertidumbre
        </p>
        <h1 className="hero-title anim a2">
          ONDA<span className="hero-dot">.</span>
        </h1>
        <p className="hero-sub anim a3">Laboratorio de Ondas de Materia</p>
        <p className="hero-lede anim a4">
          Toda la materia ondula: un electrón, un balón de fútbol, tú. La única
          diferencia es la <em>escala</em>. Este laboratorio convierte dos
          ecuaciones de la mecánica cuántica en instrumentos que puedes operar.
        </p>
        <div className="hero-eqs anim a5">
          <span className="eq-chip eq-wave">λ = h / p</span>
          <span className="eq-chip eq-amber">Δx · Δp ≥ ħ / 2</span>
        </div>
      </div>
      <div className="hero-scroll anim a6" aria-hidden="true">
        <span>desliza para experimentar</span>
        <span className="hero-scroll-line" />
      </div>
    </header>
  )
}
