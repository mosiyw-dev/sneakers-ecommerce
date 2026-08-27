"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShippingAddress,
  PaymentDetails,
  CheckoutFormData,
  Order,
  CartItem,
} from "@/types";
import { useCartStore } from "@/stores/cart-store";
import { useCurrencyStore } from "@/stores/currency-store";
import { SHIPPING_OPTIONS } from "@/data/shipping-options";
import { CheckoutSteps } from "@/components/checkout/checkout-steps";
import { ShippingStep } from "@/components/checkout/shipping-step";
import { DeliveryStep } from "@/components/checkout/delivery-step";
import { PaymentStep } from "@/components/checkout/payment-step";
import { OrderSummary } from "@/components/checkout/order-summary";
import { OrderConfirmation } from "@/components/checkout/order-confirmation";
import {
  generateOrderNumber,
  generateTrackingNumber,
} from "@/lib/formatters";
import { Button } from "@/components/ui/button";
import { useIsMounted } from "@/hooks/use-is-mounted";
import { ArrowLeft, ShoppingBag } from "lucide-react";

const INITIAL_SHIPPING_ADDRESS: ShippingAddress = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  street: "",
  apartment: "",
  city: "تهران",
  state: "تهران",
  postalCode: "",
  country: "ایران",
  saveAddress: true,
};

const INITIAL_PAYMENT_DETAILS: PaymentDetails = {
  method: "online_gateway",
  sameAsShipping: true,
};

export default function CheckoutPage() {
  const isMounted = useIsMounted();
  const {
    items,
    getSummary,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    clearCart,
  } = useCartStore();

  const { format, currency } = useCurrencyStore();

  const [currentStep, setCurrentStep] = React.useState<number>(1);
  const [formData, setFormData] = React.useState<CheckoutFormData>({
    shippingAddress: INITIAL_SHIPPING_ADDRESS,
    shippingOptionId: SHIPPING_OPTIONS[0].id,
    paymentDetails: INITIAL_PAYMENT_DETAILS,
  });

  const [confirmedOrder, setConfirmedOrder] = React.useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const summary = getSummary();
  const selectedShippingOption =
    SHIPPING_OPTIONS.find((s) => s.id === formData.shippingOptionId) ||
    SHIPPING_OPTIONS[0];

  const handleShippingSubmit = (address: ShippingAddress) => {
    setFormData((prev) => ({ ...prev, shippingAddress: address }));
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeliverySelect = (optionId: string) => {
    setFormData((prev) => ({ ...prev, shippingOptionId: optionId }));
  };

  const handleDeliveryContinue = () => {
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaymentSubmit = (payment: PaymentDetails) => {
    setIsProcessing(true);

    setTimeout(() => {
      const orderNumber = generateOrderNumber();
      const trackingNumber = generateTrackingNumber();

      const newOrder: Order = {
        id: `ord_${Date.now()}`,
        orderNumber,
        createdAt: new Date().toISOString(),
        status: "confirmed",
        items: items.map((item: CartItem) => ({
          id: item.id,
          productId: item.productId,
          productName: item.product.name,
          productSlug: item.product.slug,
          productImage: item.product.images[0].url,
          colorName: item.selectedColor?.name,
          size: item.selectedSize,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
        })),
        shippingAddress: formData.shippingAddress,
        shippingOption: selectedShippingOption,
        paymentMethod:
          payment.method === "online_gateway"
            ? "درگاه پرداخت شاپرک"
            : payment.method === "card_to_card"
            ? "کارت به کارت مستقیم"
            : "تتر (USDT-TRC20)",
        subtotal: summary.subtotal,
        discount: summary.discountAmount,
        shippingCost: summary.shippingAmount,
        tax: summary.taxAmount,
        total: summary.total,
        currency,
        estimatedDelivery: selectedShippingOption.estimatedDays,
        trackingNumber,
        carrier: "پست پیشتاز / تیپاکس",
      };

      setConfirmedOrder(newOrder);
      clearCart();
      setIsProcessing(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
  };

  if (!isMounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-sm text-muted-foreground">در حال بارگذاری اطلاعات تسویه...</p>
      </div>
    );
  }

  if (confirmedOrder) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <OrderConfirmation order={confirmedOrder} />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-muted mx-auto text-muted-foreground">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold text-foreground">
          سبد خرید شما برای تسویه خالی است
        </h2>
        <p className="text-xs text-muted-foreground">
          ابتدا کتونی‌های مورد نظر خود را به سبد خرید اضافه کنید.
        </p>
        <Link href="/products">
          <Button size="lg" className="gap-2 rounded-2xl text-xs font-bold shadow-md">
            مشاهده کاتالوگ کتونی‌ها <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-right">
      {/* Stepper */}
      <CheckoutSteps currentStep={currentStep} />

      {/* Main Form & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Step Forms */}
        <div className="lg:col-span-7 rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs">
          {currentStep === 1 && (
            <ShippingStep
              initialAddress={formData.shippingAddress}
              onContinue={handleShippingSubmit}
            />
          )}

          {currentStep === 2 && (
            <DeliveryStep
              selectedOptionId={formData.shippingOptionId}
              subtotal={summary.subtotal}
              onSelect={handleDeliverySelect}
              onBack={() => setCurrentStep(1)}
              onContinue={handleDeliveryContinue}
            />
          )}

          {currentStep === 3 && (
            <PaymentStep
              initialPayment={formData.paymentDetails}
              totalAmount={format(summary.total)}
              onBack={() => setCurrentStep(2)}
              onSubmitOrder={handlePaymentSubmit}
              isProcessing={isProcessing}
            />
          )}
        </div>

        {/* Sticky Summary Sidebar */}
        <div className="lg:col-span-5 sticky top-24">
          <OrderSummary
            items={items}
            summary={summary}
            appliedPromo={appliedPromo || undefined}
            onApplyPromo={(promo) => applyPromoCode(promo)}
            onRemovePromo={removePromoCode}
          />
        </div>
      </div>
    </div>
  );
}
