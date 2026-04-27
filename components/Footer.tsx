export function Footer() {
  return (
    <footer className="mt-auto border-t border-border px-6 py-10 text-center text-sm text-muted-foreground">
      <div className="mb-2 flex items-center justify-center gap-2">
        <img src="/VeloPay.png" alt="VeloPay Logo" className="h-22 object-contain -my-6" />
      </div>
      <p>© 2026 VeloPay — مبني على Solana Blockchain</p>
      <p className="mt-1 text-xs">Hackathon MVP — بيانات تجريبية على Devnet</p>
    </footer>
  );
}
