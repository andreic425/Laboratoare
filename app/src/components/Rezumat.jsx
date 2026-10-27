export default function Rezumat({ total, nevizitate, zile }) {
  return (
    <p className="rezumat">
      {total} destinații, {nevizitate} nevizitate, {zile} zile de vizitat
    </p>
  )
}