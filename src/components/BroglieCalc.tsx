import { useMemo, useState } from 'react'
import {
  PRESETS,
  clasificarLambda,
  ESCALA_INFO,
  interpretarLambda,
  lambdaDeBroglie,
  momentum,
} from '../physics'
import SciNumber from './SciNumber'
import ScaleRuler from './ScaleRuler'

type Modo = 'mv' | 'p'

function parseNum(s: string): number | null {
  const n = Number(s.trim().replace(',', '.'))
  return isFinite(n) && n > 0 ? n : null
}

interface CampoProps {
  id: string
  label: string
  unidad: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}

function Campo({ id, label, unidad, value, onChange, placeholder }: CampoProps) {
  return (
    <label className="campo" htmlFor={id}>
      <span className="campo-label">
        {label} <span className="campo-unidad">[{unidad}]</span>
      </span>
      <input
        id={id}
        className="campo-input"
        type="text"
        inputMode="decimal"
        autoComplete="off"
        spellCheck={false}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  )
}

export default function BroglieCalc() {
  const [modo, setModo] = useState<Modo>('mv')
  const [masa, setMasa] = useState('9.109e-31')
  const [vel, setVel] = useState('2.19e6')
  const [pDirecto, setPDirecto] = useState('1e-24')
  const [presetActivo, setPresetActivo] = useState<string | null>('electron')

  const aplicarPreset = (id: string) => {
    const p = PRESETS.find((x) => x.id === id)!
    setModo('mv')
    setMasa(p.m.toExponential(3))
    setVel(p.v.toExponential(2))
    setPresetActivo(id)
  }

  const resultado = useMemo(() => {
    let p: number | null = null
    if (modo === 'mv') {
      const m = parseNum(masa)
      const v = parseNum(vel)
      if (m !== null && v !== null) p = momentum(m, v)
    } else {
      p = parseNum(pDirecto)
    }
    if (p === null) return null
    return { p, lambda: lambdaDeBroglie(p) }
  }, [modo, masa, vel, pDirecto])

  const escala = resultado ? clasificarLambda(resultado.lambda) : null
  const info = escala ? ESCALA_INFO[escala] : null

  return (
    <section className="seccion" id="broglie">
      <div className="seccion-head">
        <span className="seccion-num">01</span>
        <div>
          <h2 className="seccion-titulo">
            Calculadora de <em>de Broglie</em>
          </h2>
          <p className="seccion-lede">
            Ingresa la masa y la velocidad de cualquier objeto —o su cantidad de
            movimiento directamente— y obtén la longitud de onda que la
            naturaleza le asocia: <span className="mono">λ = h / p</span>.
          </p>
        </div>
      </div>

      <div className="panel panel-broglie">
        <div className="panel-col panel-entrada">
          <div className="modo-toggle" role="tablist" aria-label="Modo de entrada">
            <button
              role="tab"
              aria-selected={modo === 'mv'}
              className={modo === 'mv' ? 'modo activo' : 'modo'}
              onClick={() => setModo('mv')}
            >
              masa + velocidad
            </button>
            <button
              role="tab"
              aria-selected={modo === 'p'}
              className={modo === 'p' ? 'modo activo' : 'modo'}
              onClick={() => {
                setModo('p')
                setPresetActivo(null)
              }}
            >
              momentum directo
            </button>
          </div>

          {modo === 'mv' ? (
            <div className="campos">
              <Campo
                id="masa"
                label="masa m"
                unidad="kg"
                value={masa}
                placeholder="9.109e-31"
                onChange={(v) => {
                  setMasa(v)
                  setPresetActivo(null)
                }}
              />
              <Campo
                id="vel"
                label="velocidad v"
                unidad="m/s"
                value={vel}
                placeholder="2.19e6"
                onChange={(v) => {
                  setVel(v)
                  setPresetActivo(null)
                }}
              />
            </div>
          ) : (
            <div className="campos">
              <Campo
                id="momentum"
                label="cantidad de movimiento p"
                unidad="kg·m/s"
                value={pDirecto}
                placeholder="1e-24"
                onChange={setPDirecto}
              />
            </div>
          )}

          <p className="presets-titulo">o elige un objeto del universo:</p>
          <div className="presets">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                className={presetActivo === p.id ? 'preset activo' : 'preset'}
                onClick={() => aplicarPreset(p.id)}
              >
                <span className="preset-nombre">{p.nombre}</span>
                <span className="preset-detalle">{p.detalle}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="panel-col panel-resultado">
          {resultado ? (
            <>
              <p className="res-label">longitud de onda de de Broglie</p>
              <p className="res-valor">
                <span className="res-letra">λ&nbsp;=&nbsp;</span>
                <SciNumber value={resultado.lambda} unidad="m" />
              </p>
              <p className="res-secundario mono">
                p = <SciNumber value={resultado.p} digitos={3} unidad="kg·m/s" />
              </p>
              {info && escala && (
                <div className={`veredicto veredicto-${escala}`}>
                  <span className="veredicto-badge">{info.etiqueta}</span>
                  <p className="veredicto-titulo">{info.titulo}</p>
                  <p className="veredicto-texto">{interpretarLambda(resultado.lambda)}</p>
                </div>
              )}
            </>
          ) : (
            <p className="res-vacio">
              Ingresa valores válidos (mayores que cero). Puedes usar notación
              científica: <span className="mono">9.1e-31</span>
            </p>
          )}
        </div>
      </div>

      <ScaleRuler lambda={resultado?.lambda ?? null} />
    </section>
  )
}
