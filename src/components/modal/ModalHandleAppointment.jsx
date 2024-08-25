import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const ModalHandleAppointment = ({
  id,
  appointmentAction,
  actionText,
  dialogTitle,
  dialogDescription,
  buttonText,
  variant,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await appointmentAction(id);
      setOpen(false);
    } catch (error) {
      setError("Une erreur est survenue, veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  };

  const ModalContent = ({ onClose }) => (
    <>
      <DialogHeader>
        <DialogTitle
          className={variant === "destructive" ? "text-destructive" : ""}
        >
          {dialogTitle}
        </DialogTitle>
        <DialogDescription>{dialogDescription}</DialogDescription>
      </DialogHeader>
      {error && setTimeout(() => setError(null), 3000) && (
        <p className="text-destructive text-sm">{error}</p>
      )}
      <DialogFooter>
        <div className="w-full flex flex-col md:flex-row gap-2">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} variant={variant} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" /> : actionText}
          </Button>
        </div>
      </DialogFooter>
    </>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant={variant}>{buttonText}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <ModalContent onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant={variant}>{buttonText}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <ModalContent onClose={() => setOpen(false)} />
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
};

export default ModalHandleAppointment;
