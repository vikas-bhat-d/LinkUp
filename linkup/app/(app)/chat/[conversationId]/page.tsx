import { MobileSidebar } from "@/components/sidebar/MobileSidebar";
import { Separator } from "@/components/ui/separator";

export default function ChatPage() {
  return (
    <div className="flex h-full md:h-full flex-col">
        <header className="h-14 border-b flex items-center gap-2 px-4">
        <div className="md:hidden">
            <MobileSidebar />
        </div>
        <span className="font-medium">Chat Header</span>
        </header>

      <Separator />

      <div className="flex-1 overflow-y-auto p-4">
        
      </div>

      <footer className="border-t p-4">
        Message input
      </footer>
    </div>
  );
}
