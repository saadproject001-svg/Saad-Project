export default function ErrorState({ error, onRetry, label = "Couldn't load this data." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
      <p className="text-sm text-neu-text">{label}</p>
      {error?.message && <p className="text-xs text-danger max-w-sm">{error.message}</p>}
      {onRetry && (
        <button onClick={onRetry} className="neu-icon-btn px-4 py-2 rounded-xl text-sm text-neu-text">
          Try again
        </button>
      )}
    </div>
  );
}
