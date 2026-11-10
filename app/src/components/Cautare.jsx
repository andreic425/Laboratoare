export default function Cautare({ valoare, onChange }) {
  return (
    <div className="cautare">
      <input
        type="search"
        placeholder="Caută după oraș sau țară"
        value={valoare}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}