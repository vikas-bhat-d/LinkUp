export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden">

      <aside className="hidden md:flex w-80 border-r bg-muted/30">
        <div className="w-full p-4">Sidebar</div>
      </aside>

      <main className="flex-1">{children}</main>
    </div>
  );
}
