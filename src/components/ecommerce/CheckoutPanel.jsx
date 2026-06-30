import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, CreditCard, Gift, MapPin, Truck } from 'lucide-react';
import { LuxuryButton } from '@/components/luxury/LuxuryButton';
import { useCart } from '@/context/CartContext.jsx';
import { formatCurrency } from '@/lib/formatters';

const luxuryEase = [0.19, 1, 0.22, 1];

const deliveryOptions = [
  { id: 'standard', label: 'Standard Delivery', detail: '5-7 business days', price: 0 },
  { id: 'express', label: 'Express Delivery', detail: '2-3 business days', price: 199 },
  { id: 'gift', label: 'Premium Gift Box', detail: 'Luxury packaging + 2-3 days', price: 499 },
];

const paymentOptions = [
  { id: 'upi', label: 'UPI', icon: '📱' },
  { id: 'card', label: 'Card', icon: '💳' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💵' },
];

const checkoutSteps = [
  { icon: Gift, title: 'Review Selection', copy: 'Confirm bottles, sizes, and gift presentation.' },
  { icon: MapPin, title: 'Delivery Address', copy: 'Enter your delivery details.' },
  { icon: Truck, title: 'Delivery Method', copy: 'Choose your preferred delivery experience.' },
  { icon: CreditCard, title: 'Payment', copy: 'Select your preferred payment method.' }
];

export function CheckoutPanel() {
  const { subtotal, discount, total } = useCart();
  const [openStep, setOpenStep] = useState(0);
  const [delivery, setDelivery] = useState('standard');
  const [payment, setPayment] = useState('');
  const [address, setAddress] = useState({ name: '', phone: '', line1: '', line2: '', city: '', pin: '' });

  const deliveryFee = deliveryOptions.find(d => d.id === delivery)?.price || 0;
  const grandTotal = total + deliveryFee;

  function toggleStep(index) {
    setOpenStep(openStep === index ? -1 : index);
  }

  return (
    <section className="rounded-md border border-white/10 bg-ink-900 p-6">
      <p className="text-xs uppercase tracking-[0.25em] text-gold-300">Private Checkout</p>
      <div className="mt-6 grid gap-3">
        {checkoutSteps.map(({ icon: Icon, title, copy }, index) => (
          <div key={title} className="rounded-md border border-white/10 bg-ink-950 overflow-hidden">
            <button
              className="flex w-full items-center justify-between gap-3 p-4 text-left"
              onClick={() => toggleStep(index)}
              type="button"
            >
              <div className="flex items-center gap-3 text-gold-300">
                <span className="grid h-8 w-8 place-items-center rounded-full border border-gold-500/40 text-xs">
                  {index + 1}
                </span>
                <Icon size={18} />
                <p className="text-xs uppercase tracking-[0.22em]">{title}</p>
              </div>
              <motion.div
                animate={{ rotate: openStep === index ? 180 : 0 }}
                transition={{ duration: 0.3, ease: luxuryEase }}
              >
                <ChevronDown size={16} className="text-cream-100/40" />
              </motion.div>
            </button>

            <AnimatePresence>
              {openStep === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: luxuryEase }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-white/6 p-4">
                    <p className="text-sm leading-6 text-cream-100/58">{copy}</p>

                    {/* Step 1: Review - handled by CartDrawer */}
                    {index === 0 && (
                      <p className="mt-3 text-xs text-cream-100/40">
                        Review your selection in the cart panel beside.
                      </p>
                    )}

                    {/* Step 2: Address */}
                    {index === 1 && (
                      <div className="mt-4 grid gap-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            className="min-h-10 rounded-md border border-white/10 bg-ink-900 px-3 text-sm text-cream-50 outline-none focus:border-gold-500/50"
                            placeholder="Full Name"
                            value={address.name}
                            onChange={(e) => setAddress({ ...address, name: e.target.value })}
                          />
                          <input
                            className="min-h-10 rounded-md border border-white/10 bg-ink-900 px-3 text-sm text-cream-50 outline-none focus:border-gold-500/50"
                            placeholder="Phone Number"
                            value={address.phone}
                            onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                          />
                        </div>
                        <input
                          className="min-h-10 rounded-md border border-white/10 bg-ink-900 px-3 text-sm text-cream-50 outline-none focus:border-gold-500/50"
                          placeholder="Address Line 1"
                          value={address.line1}
                          onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                        />
                        <input
                          className="min-h-10 rounded-md border border-white/10 bg-ink-900 px-3 text-sm text-cream-50 outline-none focus:border-gold-500/50"
                          placeholder="Address Line 2 (Optional)"
                          value={address.line2}
                          onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                        />
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            className="min-h-10 rounded-md border border-white/10 bg-ink-900 px-3 text-sm text-cream-50 outline-none focus:border-gold-500/50"
                            placeholder="City"
                            value={address.city}
                            onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          />
                          <input
                            className="min-h-10 rounded-md border border-white/10 bg-ink-900 px-3 text-sm text-cream-50 outline-none focus:border-gold-500/50"
                            placeholder="PIN Code"
                            value={address.pin}
                            onChange={(e) => setAddress({ ...address, pin: e.target.value })}
                          />
                        </div>
                      </div>
                    )}

                    {/* Step 3: Delivery Method */}
                    {index === 2 && (
                      <div className="mt-4 grid gap-2">
                        {deliveryOptions.map((opt) => (
                          <button
                            key={opt.id}
                            className={`flex items-center justify-between rounded-md border p-3 text-left transition ${
                              delivery === opt.id
                                ? 'border-gold-500/50 bg-gold-500/8'
                                : 'border-white/8 hover:border-gold-500/30'
                            }`}
                            onClick={() => setDelivery(opt.id)}
                            type="button"
                          >
                            <div>
                              <p className="text-sm text-cream-50">{opt.label}</p>
                              <p className="text-xs text-cream-100/45">{opt.detail}</p>
                            </div>
                            <span className="text-sm text-gold-300">
                              {opt.price ? formatCurrency(opt.price) : 'Free'}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Step 4: Payment */}
                    {index === 3 && (
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {paymentOptions.map((opt) => (
                          <button
                            key={opt.id}
                            className={`flex items-center gap-2 rounded-md border p-3 text-left transition ${
                              payment === opt.id
                                ? 'border-gold-500/50 bg-gold-500/8'
                                : 'border-white/8 hover:border-gold-500/30'
                            }`}
                            onClick={() => setPayment(opt.id)}
                            type="button"
                          >
                            <span className="text-lg">{opt.icon}</span>
                            <span className="text-sm text-cream-50">{opt.label}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="mt-6 grid gap-2 border-t border-white/10 pt-5 text-sm text-cream-100/62">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between">
            <span>Concierge credit</span>
            <span>-{formatCurrency(discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Delivery</span>
          <span>{deliveryFee ? formatCurrency(deliveryFee) : 'Free'}</span>
        </div>
        <div className="flex justify-between font-display text-3xl text-cream-50 mt-2">
          <span>Total</span>
          <span>{formatCurrency(grandTotal)}</span>
        </div>
      </div>
      <LuxuryButton className="mt-6 w-full bg-gold-500 text-ink-950">Continue To Payment</LuxuryButton>
    </section>
  );
}
