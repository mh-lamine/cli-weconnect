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
import { Loader2, MinusCircle } from "lucide-react";

const ModalRemoveAvailability = ({ id, removeAvailability }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      await removeAvailability(id);
    } catch (error) {
      setError("Une erreur est survenue, veuillez réessayer plus tard.");
    }
    setLoading(false);
    setOpen(false);
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <MinusCircle className="text-destructive" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-destructive">
              Supprimer un créneau
            </DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce créneau de disponibilité ?
            </DialogDescription>
          </DialogHeader>
          {error && setTimeout(() => setError(null), 3000) && (
            <p className="text-destructive text-sm">{error}</p>
          )}
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <div className="w-full flex items-center justify-between">
                <Button variant="outline">Annuler</Button>
                <Button
                  onClick={handleSubmit}
                  variant="destructive"
                  disabled={loading && true}
                >
                  {loading ? <Loader2 className="animate-spin" /> : "Supprimer"}
                </Button>
              </div>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <MinusCircle className="text-destructive" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-destructive">
            Supprimer un créneau
          </DrawerTitle>
          <DrawerDescription>
            Êtes-vous sûr de vouloir supprimer ce créneau de disponibilité ?
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="pt-2">
          {error && setTimeout(() => setError(null), 3000) && (
            <p className="text-destructive text-sm">{error}</p>
          )}
          <DrawerClose asChild>
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={handleSubmit}
                variant="destructive"
                disabled={loading && true}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Supprimer"}
              </Button>
              <Button className="w-full" variant="outline">
                Annuler
              </Button>
            </div>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ModalRemoveAvailability;
