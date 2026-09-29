export default function LoadingSpinner({ label = 'Loading...', full = false }) {
  const Wrapper = full ? 'main' : 'div';

  return (
    <Wrapper
      className={
        full
          ? 'flex min-h-screen w-full flex-col items-center justify-center gap-3 bg-ivory px-4 text-charcoal/60'
          : 'flex flex-col items-center gap-3 py-10 text-ink-500 dark:text-ink-400'
      }
    >
      <div
        aria-hidden
        className={`h-10 w-10 animate-spin rounded-full border-2 border-current border-t-transparent ${
          full ? 'text-sage' : 'text-brand-500'
        }`}
      />
      {label ? (
        <p className={full ? 'text-[12px] uppercase tracking-[0.2em]' : 'text-sm'}>{label}</p>
      ) : null}
    </Wrapper>
  );
}
