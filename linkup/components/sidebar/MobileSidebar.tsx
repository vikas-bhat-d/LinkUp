import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          ☰
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-80 p-4 transition-all duration-300">
        Sidebar
      </SheetContent>
    </Sheet>
  );
}
