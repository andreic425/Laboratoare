import { pool } from './db.js'

const ORASE = ['Alba', 'Arad', 'Bacau', 'Baia', 'Bistrita', 'Botosani', 'Brad', 'Buzau',
  'Calafat', 'Caracal', 'Codlea', 'Comanesti', 'Deva', 'Dorohoi', 'Fagaras', 'Galati',
  'Giurgiu', 'Husi', 'Iasi', 'Lugoj', 'Medias', 'Moinesti', 'Onesti', 'Oradea',
  'Pascani', 'Petrosani', 'Pitesti', 'Reghin', 'Roman', 'Sebes', 'Sibiu', 'Slatina',
  'Tecuci', 'Turda', 'Vaslui', 'Zalau']
const TARI = ['Romania', 'Bulgaria', 'Ungaria', 'Serbia', 'Polonia', 'Cehia']
const TOTAL = 200000
const PACHET = 5000

const t0 = Date.now()
for (let start = 0; start < TOTAL; start += PACHET) {
  const valori = []
  for (let i = start; i < start + PACHET; i += 1) {
    valori.push([
      `${ORASE[i % ORASE.length]}-${i}`,
      TARI[i % TARI.length],
      (i % 14) + 1,
      i % 3 === 0,
    ])
  }
  await pool.query('INSERT INTO destinatii (oras, tara, zile, vizitat) VALUES ?', [valori])
  process.stdout.write(`\r${start + PACHET} / ${TOTAL}`)
}

const [randuri] = await pool.query('SELECT COUNT(*) AS total FROM destinatii')
console.log(`\nGata in ${((Date.now() - t0) / 1000).toFixed(1)} s. Tabela are ${randuri[0].total} randuri.`)
await pool.end()