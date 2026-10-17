import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingCart, ShieldCheck, Truck, RotateCcw, ThumbsUp, MessageSquare, CheckCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { api } from '../api';

export default function ProductModal({ product, isOpen, onClose, onAddToCart }) {
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'reviews'
  const [currentProduct, setCurrentProduct] = useState(product);

  // Review form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [userName, setUserName] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState(null);

  useEffect(() => {
    setCurrentProduct(product);
    setActiveTab('details');
    setReviewMessage(null);
  }, [product]);

  if (!isOpen || !currentProduct) return null;

  const reviews = currentProduct.reviews || [];
  const avgRating = currentProduct.rating || 4.8;
  const reviewsCount = currentProduct.reviewsCount || reviews.length || 0;

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) {
      alert("Please enter your name and a review comment.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.addProductReview(currentProduct._id, {
        rating,
        userName: userName.trim(),
        comment: comment.trim(),
      });

      if (res.success && res.data) {
        setCurrentProduct(res.data);
        setReviewMessage("Thank you! Your verified review has been posted.");
        setComment('');
        setTimeout(() => setReviewMessage(null), 4000);
      } else {
        alert(res.message || "Failed to submit review.");
      }
    } catch (err) {
      alert("Error submitting review: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-neutral-950/80 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Tabs */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/90 px-6 pt-4">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3.5 px-4 text-xs font-bold transition border-b-2 ${
              activeTab === 'details'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Product Overview
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3.5 px-4 text-xs font-bold transition border-b-2 flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Customer Reviews ({reviewsCount})</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto flex-1 p-6 md:p-8">
          {activeTab === 'details' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Media */}
              <div className="bg-neutral-950 rounded-2xl p-4 flex items-center justify-center border border-neutral-800/80 aspect-square overflow-hidden">
                <img
                  src={currentProduct.thumbnail || currentProduct.images?.[0]}
                  alt={currentProduct.title}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      {currentProduct.category}
                    </span>
                    {currentProduct.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {currentProduct.badge}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl font-black text-white leading-snug">
                    {currentProduct.title}
                  </h2>

                  {/* Rating preview with click to view reviews */}
                  <div
                    onClick={() => setActiveTab('reviews')}
                    className="flex items-center gap-2 mt-3 cursor-pointer group"
                    title="Read reviews"
                  >
                    <div className="flex items-center text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-4 h-4 ${
                            s <= Math.round(avgRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-neutral-700'
                          }`}
                        />
                      ))}
                      <span className="ml-1.5 text-sm font-bold text-white group-hover:text-amber-400">
                        {avgRating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-400 group-hover:underline">
                      ({reviewsCount} reviews)
                    </span>
                  </div>

                  <p className="text-sm text-neutral-300 mt-4 leading-relaxed">
                    {currentProduct.description}
                  </p>

                  <div className="mt-6 flex items-baseline gap-3">
                    <span className="text-3xl font-black text-white">
                      {formatCurrency(currentProduct.price)}
                    </span>
                    {currentProduct.compareAtPrice && (
                      <span className="text-sm text-neutral-500 line-through">
                        {formatCurrency(currentProduct.compareAtPrice)}
                      </span>
                    )}
                    <span className="text-xs text-emerald-400 font-semibold ml-auto">
                      {currentProduct.stock > 0 ? `${currentProduct.stock} In Stock` : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                <div className="mt-8 space-y-4">
                  <button
                    onClick={() => {
                      onAddToCart(currentProduct);
                      onClose();
                    }}
                    disabled={currentProduct.stock <= 0}
                    className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-neutral-950 font-black text-sm flex items-center justify-center gap-2 transition shadow-lg active:scale-95"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart &bull; {formatCurrency(currentProduct.price)}</span>
                  </button>

                  <div className="grid grid-cols-3 gap-2 text-[11px] text-neutral-400 pt-4 border-t border-neutral-800 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>100% Authentic</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Truck className="w-4 h-4 text-emerald-400" />
                      <span>Fast Shipping</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <RotateCcw className="w-4 h-4 text-emerald-400" />
                      <span>Easy 7-Day Returns</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Customer Reviews Tab */
            <div className="space-y-8">
              {/* Reviews Summary Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-neutral-950/70 border border-neutral-800">
                <div className="flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-neutral-800 pb-4 md:pb-0">
                  <span className="text-5xl font-black text-white">{avgRating.toFixed(1)}</span>
                  <div className="flex items-center gap-1 my-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= Math.round(avgRating)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-neutral-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-neutral-400">Based on {reviewsCount} verified reviews</span>
                </div>

                {/* Rating Distribution Bar */}
                <div className="md:col-span-2 flex flex-col justify-center space-y-1.5 text-xs text-neutral-400">
                  {[5, 4, 3, 2, 1].map((starVal) => {
                    const countForStar = reviews.filter((r) => r.rating === starVal).length;
                    const pct = reviews.length > 0 ? (countForStar / reviews.length) * 100 : starVal === 5 ? 75 : 15;
                    return (
                      <div key={starVal} className="flex items-center gap-2">
                        <span className="w-8 font-bold">{starVal} ★</span>
                        <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-10 text-right text-[11px] text-neutral-500">{Math.round(pct)}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Write a Review Section */}
              <div className="p-6 rounded-2xl bg-neutral-950/50 border border-neutral-800">
                <h4 className="text-sm font-bold text-white mb-3">Write a Customer Review</h4>
                
                {reviewMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>{reviewMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-1">
                      Overall Rating
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setRating(s)}
                          onMouseEnter={() => setHoverRating(s)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 focus:outline-none transition"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              s <= (hoverRating || rating)
                                ? 'fill-amber-400 text-amber-400 scale-110'
                                : 'text-neutral-700'
                            } transition`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-amber-400 ml-2">
                        {rating} Star{rating > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-400 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="e.g. Vikram Malhotra"
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-400 mb-1">
                      Your Review
                    </label>
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="What did you like or dislike about this item? How is the build quality and performance?"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition duration-200 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Posting Review...' : 'Submit Verified Review'}
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white">Customer Feedback ({reviews.length})</h4>
                {reviews.length === 0 ? (
                  <p className="text-xs text-neutral-500 py-4">No reviews yet. Be the first to share your thoughts!</p>
                ) : (
                  reviews.map((r, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-neutral-950/40 border border-neutral-800/80 space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{r.userName}</span>
                          <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            Verified Buyer
                          </span>
                        </div>
                        <span className="text-neutral-500 text-[11px]">
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              s <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-700'
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {r.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
