export function LoadingState({ label = "Carregando…" }: { label?: string }) {
  return (
    <div className="state state--loading" role="status">
      <span className="spinner" aria-hidden />
      {label}
    </div>
  );
}
