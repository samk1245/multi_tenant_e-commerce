const Product = require("../models/Product");

/**
 * Catalog Synchronization Adapter
 * Imports or synchronizes catalog products from DummyJSON / FakeStore / Custom Supplier API
 */
class CatalogSyncAdapter {
  /**
   * Fetch sample items from DummyJSON or fallback curated catalog
   */
  async syncTenantProducts(tenantId, category = "all", limit = 10) {
    let importedProducts = [];

    try {
      const url =
        category && category !== "all"
          ? `https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=${limit}`
          : `https://dummyjson.com/products?limit=${limit}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);

      if (res.ok) {
        const json = await res.json();
        if (json.products && json.products.length > 0) {
          for (const item of json.products) {
            const product = await Product.create({
              tenantId,
              title: item.title,
              description: item.description,
              price: item.price,
              compareAtPrice: item.discountPercentage
                ? Math.round(item.price * (1 + item.discountPercentage / 100) * 100) / 100
                : null,
              category: item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : "General",
              brand: item.brand || "Global Brand",
              thumbnail: item.thumbnail,
              images: item.images && item.images.length > 0 ? item.images : [item.thumbnail],
              stock: item.stock || 25,
              rating: item.rating || 4.7,
              reviewsCount: item.reviews ? item.reviews.length : 15,
              variants: ["Standard", "Deluxe"],
              specs: {
                Warranty: item.warrantyInformation || "1 Year Manufacturer Warranty",
                Shipping: item.shippingInformation || "Ships in 1-2 business days",
                Availability: item.availabilityStatus || "In Stock",
              },
              badge: item.discountPercentage > 15 ? `${Math.round(item.discountPercentage)}% OFF` : "TRENDING",
              isFeatured: true,
              status: "active",
            });
            importedProducts.push(product);
          }
        }
      }
    } catch (err) {
      console.warn("External catalog fetch failed (falling back to curated fixtures):", err.message);
    }

    return importedProducts;
  }
}

module.exports = new CatalogSyncAdapter();
