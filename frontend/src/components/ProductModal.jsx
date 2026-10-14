import React, { useState } from 'react';
import { X, Star, ShoppingCart, MessageSquare, Send, Check } from 'lucide-react';
import { api } from '../api';

export default function ProductModal({ product, isOpen, onClose, onAddToCart, onReviewSubmitted }) {
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'reviews'
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  if (!isOpen || !product) return null;

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      const res = await api.addProductReview(product._id, { rating, comment });
      if (res.success && res.data) {
        onReviewSubmitted(res.data);
        setComment('');
        alert('Review published successfully!');
      }
    } catch (err) {
      alert('Failed to publish review: ' + err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-2xl bg-neutral-950/80 text-neutral-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media */}
        <div className="bg-neutral-950 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-neutral-800">
          <img
            src={product.thumbnail || (product.images && product.images[0])}
            alt={product.title}
            className="w-full max-h-96 object-contain rounded-2xl shadow-xl"
          />
          <div className="mt-4 flex gap-2 overflow-x-auto">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="thumb"
                className="w-12 h-12 rounded-xl object-cover border border-neutral-700 bg-neutral-900 cursor-pointer hover:border-emerald-500"
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col justify-between max-h-[80vh] overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                {product.category}
              </span>
              {product.badge && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {product.badge}
                </span>
              )}
            </div>

            <h2 className="text-2xl font-black text-white leading-snug">
              {product.title}
            </h2>

            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="ml-1 text-sm font-bold text-white">{product.rating}</span>
              </div>
              <span className="text-xs text-neutral-400">({product.reviewsCount || 0} reviews)</span>
              <span className="text-xs text-neutral-600">&bull;</span>
              <span className="text-xs text-emerald-400 font-semibold">{product.stock} Units In Stock</span>
            </div>

            {/* Tab switch between Details and Reviews */}
            <div className="flex gap-2 mt-4 border-b border-neutral-800 pb-2">
              <button
                onClick={() => setActiveTab('details')}
                className={`text-xs font-bold pb-1 transition ${
                  activeTab === 'details' ? 'text-white border-b-2 border-emerald-500' : 'text-neutral-500 hover:text-white'
                }`}
              >
                Product Details
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`text-xs font-bold pb-1 transition ${
                  activeTab === 'reviews' ? 'text-white border-b-2 border-emerald-500' : 'text-neutral-500 hover:text-white'
                }`}
              >
                Customer Reviews ({product.reviews?.length || 0})
              </button>
            </div>

            {activeTab === 'details' ? (
              <div className="mt-4 space-y-4">
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {product.description}
                </p>

                <div className="p-3.5 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 text-xs space-y-1.5">
                  <div className="flex justify-between text-neutral-400">
                    <span>Brand / Maker:</span>
                    <span className="text-white font-medium">{product.brand || 'Authentic Marketplace Goods'}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Delivery Eligibility:</span>
                    <span className="text-emerald-400 font-medium">Free Delivery across India on orders above ₹999</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Authenticity:</span>
                    <span className="text-white font-medium">100% Genuine with Warranty</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {/* Submit review */}
                <form onSubmit={handleReviewSubmit} className="p-3 rounded-2xl bg-neutral-950 border border-neutral-800 text-xs space-y-2">
                  <span className="font-bold text-white block">Write a Verified Review</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        onClick={() => setRating(s)}
                        className={`w-4 h-4 cursor-pointer ${s <= rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-600'}`}
                      />
                    ))}
                  </div>
                  <textarea
                    required
                    rows="2"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="w-full p-2 rounded-xl bg-neutral-900 border border-neutral-700 text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs"
                  >
                    {submittingReview ? 'Posting...' : 'Submit Review'}
                  </button>
                </form>

                {/* Reviews list */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((r, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-neutral-950/40 border border-neutral-800/60 text-xs">
                        <div className="flex items-center justify-between text-neutral-400 mb-1">
                          <span className="font-bold text-white">{r.userName}</span>
                          <span className="text-amber-400">{'★'.repeat(r.rating)}</span>
                        </div>
                        <p className="text-neutral-300">{r.comment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-neutral-500 text-center py-4">No reviews yet. Be the first to review!</p>
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-3xl font-black text-white">
                ₹{product.price ? product.price.toLocaleString('en-IN') : '0'}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-neutral-500 line-through">
                  ₹{product.compareAtPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => {
                onAddToCart(product);
                onClose();
              }}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-black text-sm flex items-center justify-center gap-2 transition shadow-xl active:scale-[0.98]"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
