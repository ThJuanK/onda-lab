import { descomponer } from '../physics'

interface Props {
  value: number
  digitos?: number
  unidad?: string
}

/** Número en notación científica con exponente real en <sup> */
export default function SciNumber({ value, digitos = 3, unidad }: Props) {
  if (!isFinite(value)) return <span className="sci">—</span>
  const { mantisa, exponente } = descomponer(value)
  const m = mantisa.toPrecision(digitos).replace('.', ',')
  return (
    <span className="sci">
      <span className="sci-m">{m}</span>
      {exponente !== 0 && (
        <>
          <span className="sci-x"> × 10</span>
          <sup className="sci-e">{exponente}</sup>
        </>
      )}
      {unidad && <span className="sci-u"> {unidad}</span>}
    </span>
  )
}
