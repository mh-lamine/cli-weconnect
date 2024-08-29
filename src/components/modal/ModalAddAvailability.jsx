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
import { useEffect, useState } from "react";
import { Loader2, PlusCircle } from "lucide-react";
import { Input } from "../ui/input";

const ModalAddAvailability = ({ dayOfWeek, createAvailability }) => {
  const [open, setOpen] = useState(false);
  const [availability, setAvailability] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleChange = (e) => {
    setAvailability({ ...availability, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!availability?.startTime || !availability?.endTime) {
      setError("Veuillez renseigner une heure de début et une heure de fin.");
      return;
    }

    setLoading(true);
    try {
      await createAvailability({ dayOfWeek, ...availability });
      setOpen(false);
    } catch (error) {
      setError("Une erreur est survenue, veuillez réessayer plus tard.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!open) {
      setAvailability();
    }
  }, [open]);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <PlusCircle />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter un créneau</DialogTitle>
            <DialogDescription>
              Selectionnez une heure de début et une heure de fin pour créer un
              créneau de disponibilité.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center gap-4">
            De
            <Input
              className="w-fit"
              name="startTime"
              type="time"
              onChange={handleChange}
            />
            à
            <Input
              className="w-fit"
              name="endTime"
              type="time"
              onChange={handleChange}
            />
          </div>
          {error && setTimeout(() => setError(null), 3000) && (
            <p className="text-destructive text-sm">{error}</p>
          )}
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <div className="w-full flex items-center justify-between">
                <Button variant="outline" onClick={() => setAvailability()}>
                  Annuler
                </Button>
                <Button onClick={handleSubmit} disabled={loading && true}>
                  {loading ? <Loader2 className="animate-spin" /> : "Ajouter"}
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
        <Button>
          <PlusCircle />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Ajouter un créneau</DrawerTitle>
          <DrawerDescription>
            Selectionnez une heure de début et une heure de fin pour créer un
            créneau de disponibilité.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex items-center justify-center gap-4 px-4">
          De
          <Input
            className="w-fit"
            name="startTime"
            type="time"
            onChange={handleChange}
          />
          à
          <Input
            className="w-fit"
            name="endTime"
            type="time"
            onChange={handleChange}
          />
        </div>
        <DrawerFooter className="pt-2">
          {error && setTimeout(() => setError(null), 3000) && (
            <p className="text-destructive text-sm">{error}</p>
          )}
          <DrawerClose asChild>
            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={loading && true}
              >
                {loading ? <Loader2 className="animate-spin" /> : "Ajouter"}
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setAvailability()}
              >
                Annuler
              </Button>
            </div>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ModalAddAvailability;
