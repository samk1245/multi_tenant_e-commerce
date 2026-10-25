import React from 'react';
import { X, Check, ShoppingCart, Star, ShieldCheck, Trash2, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function ComparisonModal({
  isOpen,
  onClose,
  products = [],
  onRemoveProduct,
  onAddToCart,
  onClearAll,
}) {
  if (!isOpen || products.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-5xl max-h-[92vh] rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col overflow-hidden text-neutral-100">
        
        {/* Header */}
        <div className="p-5 px-6 border-b border-neutral-800 bg-neutral-950/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black">
              VS
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Product Comparison Engine</h3>
              <p className="text-xs text-neutral-400">
                Comparing {products.length} product{products.length > 1 ? 's' : ''} side-by-side
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClearAll}
              className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-rose-950/40 text-neutral-400 hover:text-rose-400 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="overflow-x-auto p-6 flex-1">
          <table className="w-full border-collapse text-left min-w-[650px]">
            <tbody>
              {/* Product Card Row */}
              <tr className="border-b border-neutral-800">
                <td className="w-40 py-4 font-bold text-xs text-neutral-500 uppercase tracking-wider align-top">
                  Product
                </td>
                {products.map((p) => (
                  <td key={p._id} className="p-4 align-top w-64 min-w-[200px]">
                    <div className="relative p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-center flex flex-col items-center">
                      <button
                        onClick={() => onRemoveProduct(p._id)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-neutral-900 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 transition"
                        title="Remove from comparison"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <img
                        src={p.thumbnail || p.images?.[0]}
                        alt={p.title}
                        className="w-28 h-28 object-cover rounded-xl mb-3 bg-neutral-900"
                      />

                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 mb-1">
                        {p.category}
                      </span>

                      <h4 className="text-xs font-bold text-white line-clamp-2 mt-1">
                        {p.title}
                      </h4>

                      <div className="mt-2 text-base font-black text-emerald-400 font-mono">
                        {formatCurrency(p.price)}
                      </div>

                      <button
                        onClick={() => onAddToCart(p)}
                        className="mt-3 w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Price & Discount */}
              <tr className="border-b border-neutral-800/80">
                <td className="py-3.5 font-bold text-xs text-neutral-400">Regular / M.R.P</td>
                {products.map((p) => (
                  <td key={p._id} className="p-3.5 text-xs text-neutral-300 font-mono">
                    {p.compareAtPrice ? (
                      <span className="line-through text-neutral-500">
                        {formatCurrency(p.compareAtPrice)}
                      </span>
                    ) : (
                      'N/A'
                    )}
                  </td>
                ))}
              </tr>

              {/* Customer Rating */}
              <tr className="border-b border-neutral-800/80">
                <td className="py-3.5 font-bold text-xs text-neutral-400">Rating & Reviews</td>
                {products.map((p) => (
                  <td key={p._id} className="p-3.5 text-xs">
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-white">{(p.rating || 4.8).toFixed(1)}</span>
                      <span className="text-neutral-500 text-[11px]">
                        ({p.reviewsCount || p.reviews?.length || 18} reviews)
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Stock Availability */}
              <tr className="border-b border-neutral-800/80">
                <td className="py-3.5 font-bold text-xs text-neutral-400">Availability</td>
                {products.map((p) => (
                  <td key={p._id} className="p-3.5 text-xs">
                    {p.stock > 5 ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        In Stock ({p.stock} units)
                      </span>
                    ) : p.stock > 0 ? (
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                        Only {p.stock} left in stock!
                      </span>
                    ) : (
                      <span className="text-rose-400 font-bold">Sold Out</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Brand */}
              <tr className="border-b border-neutral-800/80">
                <td className="py-3.5 font-bold text-xs text-neutral-400">Brand / Manufacturer</td>
                {products.map((p) => (
                  <td key={p._id} className="p-3.5 text-xs text-neutral-200 font-semibold">
                    {p.brand || 'Authentic Store Exclusive'}
                  </td>
                ))}
              </tr>

              {/* Authenticity & Warranty */}
              <tr className="border-b border-neutral-800/80">
                <td className="py-3.5 font-bold text-xs text-neutral-400">Guarantee</td>
                {products.map((p) => (
                  <td key={p._id} className="p-3.5 text-xs text-neutral-300">
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      100% Verified Authentic
                    </span>
                  </td>
                ))}
              </tr>

              {/* Description */}
              <tr>
                <td className="py-3.5 font-bold text-xs text-neutral-400 align-top">Overview</td>
                {products.map((p) => (
                  <td key={p._id} className="p-3.5 text-[11px] text-neutral-400 leading-relaxed align-top">
                    {p.description}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
