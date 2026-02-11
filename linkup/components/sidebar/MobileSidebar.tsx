import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          ☰
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-80 p-4 sheet-content">
            <SheetHeader>
      <SheetDescription>This action cannot be undone.</SheetDescription>
    </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
