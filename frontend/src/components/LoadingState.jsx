export default function LoadingState({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center py-16">
      <span className="neu-soft px-5 py-2.5 rounded-xl text-sm text-neu-muted">{label}</span>
    </div>
  );
}
