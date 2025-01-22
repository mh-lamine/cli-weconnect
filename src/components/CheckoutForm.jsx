import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { DialogFooter } from "./ui/dialog";
import { DrawerFooter } from "./ui/drawer";
import { Loader2 } from "lucide-react";

const CheckoutForm = ({
  handlePrevStep,
  handleCreateAppointment,
  loading,
  setLoading,
  isDesktop,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setLoading(true);
    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: "https://www.weconnect-rdv.fr/account",
      },
      redirect: "if_required",
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      toast.error("Le paiement a échoué");
    } else {
      await handleCreateAppointment();
    }
    setLoading(false);
  };

  if (isDesktop) {
    return (
      <form onSubmit={handleSubmit} className="space-y-2">
        <PaymentElement />
        <DialogFooter className="sm:justify-start">
          <div className="w-full flex items-center justify-between">
            <Button variant="outline" onClick={handlePrevStep}>
              Précédent
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : "Réserver"}
            </Button>
          </div>
        </DialogFooter>
      </form>
    );
  }
  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement className="px-4" />
      <DrawerFooter className="pt-2">
        <div className="space-y-2">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="animate-spin" /> : "Réserver"}
          </Button>
          <Button variant="outline" className="w-full" onClick={handlePrevStep}>
            Précédent
          </Button>
        </div>
      </DrawerFooter>
    </form>
  );
};

export default CheckoutForm;
