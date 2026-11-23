import { useEffect, useState } from 'react'
import { getStatistici } from '../api/statistici.js'

export default function PanouStatistici() {
  const [prag, setPrag] = useState('3')
  const [tara, setTara] = useState('')
  const [stat, setStat] = useState(null)
  const [incarcare, setIncarcare] = useState(true)
  const [eroare, setEroare] = useState(null)

  useEffect(() => {
    let anulat = false
    async function incarca() {
      setIncarcare(true)
      try {
        const date = await getStatistici(prag, tara.trim())
        if (!anulat) {
          setStat(date)
          setEroare(null)
        }
      } catch (err) {
        if (!anulat) setEroare(err.message)
      } finally {
        if (!anulat) setIncarcare(false)
      }
    }
    incarca()
    return () => {
      anulat = true
    }
  }, [prag, tara])

  return (
    <section className="panou">
      <h2>Statistici</h2>
      <label>
        Cel puțin{' '}
        <input type="number" value={prag} onChange={(e) => setPrag(e.target.value)} /> zile
      </label>{' '}
      <label>
        Țara{' '}
        <input
          type="text"
          value={tara}
          placeholder="toate"
          onChange={(e) => setTara(e.target.value)}
        />
      </label>

      {incarcare && <p className="stare">Se încarcă statisticile...</p>}
      {!incarcare && eroare && (
        <p className="stare eroare">Statistici indisponibile: {eroare}</p>
      )}
      {!incarcare && !eroare && stat && stat.destinatii === 0 && (
        <p className="gol">Nicio destinație cu cel puțin {prag} zile.</p>
      )}
      {!incarcare && !eroare && stat && stat.destinatii > 0 && (
        <ul>
          <li>Destinații: {stat.destinatii}</li>
          <li>Total zile: {stat.zile}</li>
          <li>Media: {stat.medie} zile</li>
        </ul>
      )}
    </section>
  )
}