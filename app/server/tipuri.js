
import { pool } from './db.js'

const [randuri] = await pool.query(
  'SELECT id, oras, zile, vizitat FROM destinatii WHERE id = 1',
)
const [agregate] = await pool.query(
  'SELECT COUNT(*) AS cate, SUM(zile) AS total, AVG(zile) AS medie FROM destinatii',
)

const arata = (obiect) => {
  for (const [cheie, valoare] of Object.entries(obiect)) {
    console.log(cheie.padEnd(8), JSON.stringify(valoare).padEnd(14), typeof valoare)
  }
}

console.log('--- un rand din tabela')
arata(randuri[0])
console.log('--- functii de agregare')
arata(agregate[0])

await pool.end()