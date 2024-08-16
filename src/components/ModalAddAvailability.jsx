import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useEffect, useState } from "react";
import { Loader2, PlusCircle } from "lucide-react";
import { Input } from "./ui/input";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

const ModalAddAvailability = ({ day }) => {
  const [open, setOpen] = useState(false);
  const [availability, setAvailability] = useState();
  const [loading, setLoading] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const axiosPrivate = useAxiosPrivate();

  const handleChange = (e) => {
    setAvailability({ ...availability, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!availability.startTime || !availability.endTime) return;
    
    setLoading(true);
    try {
      await axiosPrivate.post("/api/availabilities", {
        dayOfWeek: day,
        ...availability,
      });
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
    setOpen(false);
  };

  useEffect(() => {
    if (!open) {
      setAvailability();
    }
  }, [open]);

  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogTrigger asChild>
          <Button>
            <PlusCircle />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Ajouter un créneau</DialogTitle>
          </DialogHeader>
          <div className="flex gap-4">
            <Input name="startTime" type="time" onChange={handleChange} />
            <div className="divider divider-horizontal m-0" />
            <Input name="endTime" type="time" onChange={handleChange} />
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <div className="w-full flex items-center justify-between">
                <Button variant="outline" onClick={() => setAvailability()}>
                  Annuler
                </Button>
                <Button onClick={handleSubmit} disabled={loading && true}>
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Ajouter"
                  )}
                </Button>
              </div>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerTrigger asChild>
        <Button>
          <PlusCircle />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Ajouter un créneau</DrawerTitle>
        </DrawerHeader>
        <div className="flex gap-4 px-4">
          <Input name="startTime" type="time" onChange={handleChange} />
          <div className="divider divider-horizontal m-0" />
          <Input name="endTime" type="time" onChange={handleChange} />
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <div className="space-y-2">
              <Button className="w-full" onClick={handleSubmit} disabled={loading && true}>
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Ajouter"
                )}
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
