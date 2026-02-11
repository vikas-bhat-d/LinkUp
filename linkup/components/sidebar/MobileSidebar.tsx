import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ConversationList } from "./ConversationList";

export function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          ☰
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-80 p-0">
        <ConversationList/>
      </SheetContent>
    </Sheet>
  );
}
