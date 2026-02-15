export function InputEnabled({
  value,
  onChange,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      value={value}
      onChange={onChange}
      className="w-full border rounded px-3 py-2"
      placeholder="e.g. A realistic pizza on a wooden table"
    />
  );
}
