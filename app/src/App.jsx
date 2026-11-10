import { useState, useEffect } from 'react'
import PanouStatistici from './components/PanouStatistici.jsx'
import Cautare from './components/Cautare.jsx'
import FormularDestinatie from './components/FormularDestinatie.jsx'
import ListaDestinatii from './components/ListaDestinatii.jsx'
import Rezumat from './components/Rezumat.jsx'
import {
  getDestinatii,
  postDestinatie,
  patchVizitat,
  deleteDestinatie,
} from './api/destinatii.js'
import { getNevizitate, totalZile } from './utils/destinatii.js'
import './App.css'

export default function App() {
  const [destinatii, setDestinatii] = useState([])
  const [incarcare, setIncarcare] = useState(true)
  const [eroare, setEroare] = useState(null)
  const [seTrimite, setSeTrimite] = useState(false)
  const [cautare, setCautare] = useState('')

  useEffect(() => {
    async function incarca() {
      try {
        const date = await getDestinatii()
        setDestinatii(date)
      } catch (err) {
        setEroare(err.message)
      } finally {
        setIncarcare(false)
      }
    }
    incarca()
  }, [])

  async function handleAdd(nouaDestinatie) {
    setSeTrimite(true)
    try {
      const salvata = await postDestinatie(nouaDestinatie)
      setDestinatii((curent) => [...curent, salvata])
    } catch (err) {
      alert(`Nu s-a putut adăuga: ${err.message}`)
    } finally {
      setSeTrimite(false)
    }
  }

  async function handleToggle(id) {
    const destinatie = destinatii.find((d) => d.id === id)
    if (!destinatie) return
    try {
      const salvata = await patchVizitat(id, !destinatie.vizitat)
      setDestinatii((curent) => curent.map((d) => (d.id === id ? salvata : d)))
    } catch (err) {
      alert(`Nu s-a putut actualiza: ${err.message}`)
    }
  }

  async function handleDelete(id) {
    try {
      if (deleteDestinatie) {
        await deleteDestinatie(id)
      }
      setDestinatii((curent) => curent.filter((d) => d.id !== id))
    } catch (err) {
      alert(`Nu s-a putut șterge: ${err.message}`)
    }
  }

  const textCautare = cautare.trim().toLowerCase()
  const afisate = destinatii.filter(
    (d) =>
      d.oras.toLowerCase().includes(textCautare) ||
      d.tara.toLowerCase().includes(textCautare)
  )

  const nevizitate = getNevizitate(destinatii)

  return (
    <main>
      <h1>City Explorer</h1>

      <PanouStatistici />

      <Rezumat
        total={destinatii.length}
        nevizitate={nevizitate.length}
        zile={totalZile(nevizitate)}
      />

      <FormularDestinatie onAdd={handleAdd} seTrimite={seTrimite} />

      <Cautare valoare={cautare} onChange={setCautare} />

      {incarcare && <p className="stare">Se încarcă destinațiile...</p>}
      {eroare && <p className="stare eroare">Nu am putut încărca datele: {eroare}</p>}

      {!incarcare && !eroare && (
        <>
          {destinatii.length === 0 ? (
            <p className="gol">Nu există nicio destinație. Adaugă prima din formular.</p>
          ) : afisate.length === 0 ? (
            <p className="gol">Niciun rezultat pentru „{cautare}”.</p>
          ) : (
            <ListaDestinatii
              destinatii={afisate}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          )}
        </>
      )}
    </main>
  )
}