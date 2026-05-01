import { statusText, formatMoney } from "../utils/orderhelper";
import { useCart } from "../hooks/usecart";
import { API_HOST } from "../config/env";

export default function Cart() {
  const {
    items, orderId, orderStatus, total,
    loading, payLoading, message, error,
    paymentMethod, setPaymentMethod,
    currency, setCurrency,
    shipping, setShipping,
    updateQty, remove,
    onCheckout, onPaymentSuccess, onPaymentFailed
  } = useCart();

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen font-sans">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Cart Items */}
        <div className="lg:col-span-8">
          {items.length === 0 && !orderId && (
            <div className="text-gray-500 py-10 text-center border rounded-lg bg-gray-50">
              <p className="text-xl">Your cart is empty.</p>
            </div>
          )}

          <div className="space-y-6">
            {items.map((it) => (
              <div key={it.id} className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b pb-6">
                <div className="flex-shrink-0 w-32 h-32 border rounded-lg overflow-hidden bg-gray-50">
                  <img
                    src={
                      it?.product?.imageUrl
                        ? `${API_HOST}${it.product.imageUrl}`
                        : "/no-image.png"
                    }
                    alt={it.product?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left w-full">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {it.product?.name || "Unknown Product"}
                  </h3>
                  <div className="text-lg font-medium text-gray-700 mt-1">
                    {it.product?.price?.toFixed(2) || "0.00"} EGP
                  </div>
                  
                  <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                    <div className="flex items-center border rounded-md">
                      <span className="px-3 text-sm text-gray-500 bg-gray-50 border-r rounded-l-md py-2">Qty</span>
                      <input
                        type="number"
                        value={it.quantity || it.Quantity || 1}
                        min={1}
                        onChange={(e) =>
                          updateQty(it.id, parseInt(e.target.value || "1", 10))
                        }
                        className="w-16 px-3 py-2 text-center outline-none"
                      />
                    </div>
                    <button
                      onClick={() => remove(it.id)}
                      className="text-sm text-red-600 hover:text-red-800 font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <div className="text-lg font-bold">
                    {formatMoney((it.product?.price || 0) * (it.quantity || 1))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Order Summary, Shipping, Payment */}
        {(items.length > 0 || orderId) && (
          <div className="lg:col-span-4">
            <div className="border rounded-xl p-6 bg-white shadow-sm sticky top-24">
              <h2 className="text-xl font-bold mb-4 border-b pb-4">Order Summary</h2>

              {items.length > 0 && (
                <div className="flex justify-between items-center mb-6 text-lg">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-bold">{formatMoney(total)}</span>
                </div>
              )}

              {/* Shipping Form */}
              {items.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wider">Shipping Details</h3>
                  <div className="space-y-3">
                    <input
                      className="w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                      placeholder="Recipient name"
                      value={shipping.recipientName}
                      onChange={(e) => setShipping({ ...shipping, recipientName: e.target.value })}
                    />
                    <input
                      className="w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                      placeholder="Phone number"
                      value={shipping.phone}
                      onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                    />
                    <input
                      className="w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                      placeholder="Address line 1"
                      value={shipping.addressLine1}
                      onChange={(e) => setShipping({ ...shipping, addressLine1: e.target.value })}
                    />
                    <input
                      className="w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                      placeholder="Address line 2 (Optional)"
                      value={shipping.addressLine2}
                      onChange={(e) => setShipping({ ...shipping, addressLine2: e.target.value })}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className="border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                        placeholder="City"
                        value={shipping.city}
                        onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      />
                      <input
                        className="border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                        placeholder="State"
                        value={shipping.state}
                        onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className="border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                        placeholder="Postal code"
                        value={shipping.postalCode}
                        onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                      />
                      <input
                        className="border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none transition"
                        placeholder="Country"
                        value={shipping.country}
                        onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Section */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-3 text-sm uppercase tracking-wider">Payment</h3>

                {items.length > 0 && !orderId && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Method</label>
                      <select
                        className="w-full border rounded-lg px-4 py-2.5 text-sm bg-white focus:ring-2 focus:ring-black outline-none transition cursor-pointer"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      >
                        <option value="cash">Cash on Delivery</option>
                        <option value="card">Credit Card</option>
                        <option value="paymob">Paymob</option>
                        <option value="stripe">Stripe</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Currency</label>
                      <input
                        className="w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-black outline-none transition"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                      />
                    </div>

                    <div className="pt-4 border-t mt-6">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-xl font-bold">Total</span>
                        <span className="text-xl font-bold">{formatMoney(total)}</span>
                      </div>
                      
                      <button
                        className="w-full bg-black text-white font-bold py-3.5 px-4 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md"
                        onClick={onCheckout}
                        disabled={loading}
                      >
                        {loading ? "Processing..." : "Proceed to Checkout"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Existing Order Status UI */}
                {orderId && (
                  <div className="pt-4 border-t mt-4">
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Order Number</div>
                      <div className="text-lg font-bold text-gray-900 mb-3">#{orderId}</div>
                      
                      <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Status</div>
                      <div className="text-sm font-bold text-blue-600">
                        {statusText(orderStatus)}
                      </div>
                    </div>

                    {statusText(orderStatus) === "PendingPayment" && (
                      <div className="flex flex-col gap-3">
                        <button
                          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-60"
                          onClick={onPaymentSuccess}
                          disabled={payLoading}
                        >
                          {payLoading ? "Processing..." : "Confirm Payment"}
                        </button>
                        <button
                          className="w-full bg-white text-red-600 border border-red-600 font-bold py-3 px-4 rounded-lg hover:bg-red-50 transition disabled:opacity-60"
                          onClick={onPaymentFailed}
                          disabled={payLoading}
                        >
                          {payLoading ? "Processing..." : "Cancel Order"}
                        </button>
                      </div>
                    )}

                    {statusText(orderStatus) === "Paid" && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm font-semibold flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        Payment confirmed — vendor notified
                      </div>
                    )}

                    {statusText(orderStatus) === "Cancelled" && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        Order cancelled.
                      </div>
                    )}
                  </div>
                )}

                {message && <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{message}</div>}
                {error && <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
