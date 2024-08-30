import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const ModalAction = ({
  id,
  action,
  actionLabel,
  title,
  description,
  trigger,
  buttonVariant = "outline",
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await action(id);
      setOpen(false);
    } catch (error) {
      setError("Une erreur est survenue, veuillez réessayer plus tard.");
    }
    setLoading(false);
  };

  const DesktopContent = () => (
    <>
      <DialogHeader>
        <DialogTitle className="text-destructive">{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <DialogFooter className="sm:justify-start">
        <DialogClose asChild>
          <div className="w-full flex items-center justify-between">
            <Button variant="outline">Annuler</Button>
            <Button
              onClick={handleAction}
              variant="destructive"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : actionLabel}
            </Button>
          </div>
        </DialogClose>
      </DialogFooter>
    </>
  );

  const MobileContent = () => (
    <>
      <DrawerHeader>
        <DrawerTitle className="text-destructive">{title}</DrawerTitle>
        <DrawerDescription>{description}</DrawerDescription>
      </DrawerHeader>
      {error && <p className="text-destructive text-sm">{error}</p>}
      <DrawerFooter className="pt-2">
        <DrawerClose asChild>
          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={handleAction}
              variant="destructive"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : actionLabel}
            </Button>
            <Button className="w-full" variant="outline">
              Annuler
            </Button>
          </div>
        </DrawerClose>
      </DrawerFooter>
    </>
  );

  return (
    <>
      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant={buttonVariant}>{trigger}</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DesktopContent />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant={buttonVariant}>{trigger}</Button>
          </DrawerTrigger>
          <DrawerContent>
            <MobileContent />
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default ModalAction;
