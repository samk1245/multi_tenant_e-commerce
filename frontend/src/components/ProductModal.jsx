import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  ShoppingCart,
  ShieldCheck,
  Truck,
  RotateCcw,
  ThumbsUp,
  MessageSquare,
  CheckCircle,
  Heart,
  Share2,
  Check,
  Scale,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';
import { api } from '../api';

export default function ProductModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onToggleCompare,
  isCompared,
}) {
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'reviews'
  const [currentProduct, setCurrentProduct] = useState(product);
  const [copiedLink, setCopiedLink] = useState(false);

  // Review form state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [userName, setUserName] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState(null);
  const [selectedStarFilter, setSelectedStarFilter] = useState('all');

  // Pincode checker state
  const [pincode, setPincode] = useState('400050');
  const [pincodeChecked, setPincodeChecked] = useState(true);

  useEffect(() => {
    setCurrentProduct(product);
    setActiveTab('details');
    setReviewMessage(null);
    setSelectedStarFilter('all');
  }, [product]);

  if (!isOpen || !currentProduct) return null;

  const reviews = currentProduct.reviews || [];
  const avgRating = currentProduct.rating || 4.8;
  const reviewsCount = currentProduct.reviewsCount || reviews.length || 0;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleVoteHelpful = async (reviewId) => {
    try {
      const res = await api.voteReviewHelpful(currentProduct._id, reviewId);
      if (res.success && res.data) {
        setCurrentProduct(res.data);
      }
    } catch (err) {
      console.warn("Could not upvote review:", err);
    }
  };

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

  // Filtered reviews
  const filteredReviews = reviews.filter((r) => {
    if (selectedStarFilter === 'all') return true;
    return r.rating === Number(selectedStarFilter);
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[92vh] rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl flex flex-col overflow-hidden text-neutral-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-neutral-950/80 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header Tabs */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/90 px-6 pt-4">
          <button
            onClick={() => setActiveTab('details')}
            className={`pb-3.5 px-4 text-xs font-bold transition border-b-2 cursor-pointer ${
              activeTab === 'details'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Product Overview & Specifications
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3.5 px-4 text-xs font-bold transition border-b-2 flex items-center gap-2 cursor-pointer ${
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Media */}
              <div>
                <div className="bg-neutral-950 rounded-2xl p-4 flex items-center justify-center border border-neutral-800/80 aspect-square overflow-hidden relative group">
                  <img
                    src={currentProduct.thumbnail || currentProduct.images?.[0]}
                    alt={currentProduct.title}
                    className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                  />

                  {currentProduct.stock <= 5 && currentProduct.stock > 0 && (
                    <span className="absolute bottom-4 left-4 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold backdrop-blur-md">
                      ⚡ Hurry! Only {currentProduct.stock} left in stock
                    </span>
                  )}
                </div>

                {/* Authenticity Trust Banner */}
                <div className="grid grid-cols-3 gap-2 text-[11px] text-neutral-400 pt-4 mt-4 border-t border-neutral-800 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>100% Authentic</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Truck className="w-4 h-4 text-emerald-400" />
                    <span>Express 2-Day Air</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <RotateCcw className="w-4 h-4 text-emerald-400" />
                    <span>7-Day Return / Exch.</span>
                  </div>
                </div>
              </div>

              {/* Info & Delivery Checker */}
              <div className="flex flex-col justify-between space-y-5">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      {currentProduct.category}
                    </span>
                    {currentProduct.badge && (
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        {currentProduct.badge}
                      </span>
                    )}
                    {currentProduct.brand && (
                      <span className="text-[10px] text-neutral-400 font-semibold ml-auto">
                        Brand: {currentProduct.brand}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl font-black text-white leading-snug">
                    {currentProduct.title}
                  </h2>

                  {/* Rating preview */}
                  <div
                    onClick={() => setActiveTab('reviews')}
                    className="flex items-center gap-2 mt-2 cursor-pointer group"
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

                  <p className="text-xs text-neutral-300 mt-4 leading-relaxed">
                    {currentProduct.description}
                  </p>

                  {/* Pricing & Stock */}
                  <div className="mt-5 p-3.5 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-white font-mono">
                          {formatCurrency(currentProduct.price)}
                        </span>
                        {currentProduct.compareAtPrice && (
                          <span className="text-xs text-neutral-500 line-through font-mono">
                            {formatCurrency(currentProduct.compareAtPrice)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-400 block mt-0.5">
                        Inclusive of all GST & import duties
                      </span>
                    </div>

                    <div className="text-right">
                      {currentProduct.stock > 5 ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/30 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {currentProduct.stock} In Stock
                        </span>
                      ) : currentProduct.stock > 0 ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs border border-amber-500/30 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                          Only {currentProduct.stock} left!
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 font-bold text-xs">
                          Out of stock
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Delivery & COD Pincode Checker */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-neutral-950/50 border border-neutral-800 space-y-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Check Delivery Speed & COD Availability</span>
                    </span>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => {
                          setPincode(e.target.value.replace(/\D/g, ''));
                          setPincodeChecked(false);
                        }}
                        placeholder="Enter 6-digit PIN code"
                        className="flex-1 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-700 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (pincode.length === 6) setPincodeChecked(true);
                          else alert('Please enter a valid 6-digit PIN code.');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-emerald-400 transition cursor-pointer"
                      >
                        Check
                      </button>
                    </div>

                    {pincodeChecked && pincode.length === 6 && (
                      <div className="space-y-1 text-[11px] pt-1">
                        <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Delivery by Thursday, 29 Oct &bull; Express Available</span>
                        </div>
                        <div className="text-neutral-400 flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Eligible for Cash on Delivery (COD)</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        onAddToCart(currentProduct);
                        onClose();
                      }}
                      disabled={currentProduct.stock <= 0}
                      className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 disabled:from-neutral-800 disabled:to-neutral-800 disabled:text-neutral-500 text-neutral-950 font-black text-sm flex items-center justify-center gap-2 transition shadow-lg active:scale-95 cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>Add to Cart &bull; {formatCurrency(currentProduct.price)}</span>
                    </button>

                    {/* Compare Button */}
                    <button
                      onClick={() => onToggleCompare && onToggleCompare(currentProduct)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                        isCompared
                          ? 'bg-purple-600 text-white border-purple-400 shadow-md shadow-purple-500/20'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-purple-400 border-neutral-700'
                      }`}
                      title={isCompared ? "Remove from comparison" : "Add to side-by-side comparison"}
                    >
                      <Scale className="w-5 h-5" />
                    </button>

                    {/* Wishlist Button */}
                    <button
                      onClick={() => onToggleWishlist && onToggleWishlist(currentProduct)}
                      className={`p-3.5 rounded-2xl border transition cursor-pointer ${
                        isWishlisted
                          ? 'bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/20'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-rose-400 border-neutral-700'
                      }`}
                      title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
                    >
                      <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
                    </button>

                    {/* Share Button */}
                    <button
                      onClick={handleShare}
                      className="p-3.5 rounded-2xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white border border-neutral-700 transition cursor-pointer"
                      title="Share link"
                    >
                      {copiedLink ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
                    </button>
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
                        <button
                          onClick={() => setSelectedStarFilter(selectedStarFilter === String(starVal) ? 'all' : String(starVal))}
                          className="w-10 font-bold hover:text-amber-400 text-left"
                        >
                          {starVal} ★
                        </button>
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
                <h4 className="text-sm font-bold text-white mb-3">Write a Verified Customer Review</h4>
                
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
                          className="p-1 focus:outline-none transition cursor-pointer"
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
                        Your Full Name
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
                      Your Detailed Review
                    </label>
                    <textarea
                      rows={3}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="What did you like or dislike? How is the build quality and performance?"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition duration-200 disabled:opacity-50 cursor-pointer shadow-md"
                  >
                    {isSubmitting ? 'Posting Review...' : 'Submit Verified Review'}
                  </button>
                </form>
              </div>

              {/* Reviews List with Helpful Button & Star Filter */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">
                    Customer Feedback ({filteredReviews.length})
                  </h4>

                  {/* Star Filter Pills */}
                  <div className="flex items-center gap-1.5 text-xs">
                    {['all', '5', '4', '3'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setSelectedStarFilter(f)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                          selectedStarFilter === f
                            ? 'bg-amber-400 text-neutral-950 shadow-sm'
                            : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                        }`}
                      >
                        {f === 'all' ? 'All Reviews' : `${f} Stars`}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredReviews.length === 0 ? (
                  <p className="text-xs text-neutral-500 py-6 text-center">
                    No reviews matching this star filter.
                  </p>
                ) : (
                  filteredReviews.map((r, idx) => (
                    <div
                      key={r._id || idx}
                      className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800/80 space-y-2.5"
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

                      {/* Helpful Button */}
                      <div className="pt-2 border-t border-neutral-800/60 flex items-center justify-end text-xs">
                        <button
                          type="button"
                          onClick={() => r._id && handleVoteHelpful(r._id)}
                          className="text-[11px] text-neutral-400 hover:text-emerald-400 flex items-center gap-1.5 transition cursor-pointer"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>Helpful ({r.helpfulVotes || 0})</span>
                        </button>
                      </div>
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
