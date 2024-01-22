// Importing necessary modules and dependencies
"use client";

import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Defining the props interface for the PaymentStatus component
interface PaymentStatusProps {
  orderEmail: string; // Email address for shipping
  orderId: string; // Order ID
  isPaid: boolean; // Boolean indicating whether the payment is successful
}

// PaymentStatus component definition
const PaymentStatus = ({ orderEmail, orderId, isPaid }: PaymentStatusProps) => {
  const router = useRouter(); // Accessing the Next.js router

  // Using TRPC to poll the order status
  const { data } = trpc.payment.pollOrderStatus.useQuery(
    { orderId },
    {
      enabled: isPaid === false, // Enable polling only if the payment is not yet successful
      refetchInterval: (data) => (data?.isPaid ? false : 1000), // Poll every 1000 milliseconds until payment is successful
    }
  );

  // useEffect hook to refresh the router when the payment status changes
  useEffect(() => {
    if (data?.isPaid) router.refresh();
  }, [data?.isPaid, router]);

  // Rendering the component with shipping information and order status
  return (
    <div className="mt-16 grid grid-cols-2 gap-x-4 text-sm text-gray-600">
      <div>
        <p className="font-medium text-gray-900">Shipping To</p>
        <p>{orderEmail}</p>
      </div>

      <div>
        <p className="font-medium text-gray-900">Order Status</p>
        <p>{isPaid ? "Payment successful" : "Pending payment"}</p>
      </div>
    </div>
  );
};

export default PaymentStatus;
