require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });
const mongoose = require("mongoose");
const Tenant = require("../models/Tenant");
const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/multitenant_ecommerce";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for expanded catalog seeding...");

    // Clear existing collections & stale indexes
    await Tenant.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await User.deleteMany({});
    try {
      await Product.collection.dropIndexes();
    } catch (e) {
      // ignore
    }
    console.log("Cleared existing database data and indexes.");

    // 1. Create 4 Distinct Tenant Stores with INR Currency
    const tenantSneakers = await Tenant.create({
      name: "Urban Sneaker Vault",
      slug: "sneaker-vault",
      tagline: "Exclusive Kicks, Limited Drops & High-Heat Streetwear",
      description: "Premier destination for authentic collector sneakers, retro classics, and urban hypebeast apparel.",
      category: "Footwear & Streetwear",
      logo: "👟",
      bannerImage: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1600&q=80",
      theme: {
        primaryColor: "#059669",
        accentColor: "#10b981",
        heroGradient: "from-emerald-900 via-teal-900 to-black",
      },
      contactEmail: "drops@sneakervault.in",
      currency: "INR",
    });

    const tenantNordic = await Tenant.create({
      name: "Nordic Minimalist Living",
      slug: "nordic-home",
      tagline: "Scandinavian Design for Calm, Purposeful Spaces",
      description: "Timeless artisanal furniture, hand-turned ceramics, and warm architectural lighting for modern sanctuaries.",
      category: "Home & Interior Design",
      logo: "🛋️",
      bannerImage: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=80",
      theme: {
        primaryColor: "#d97706",
        accentColor: "#f59e0b",
        heroGradient: "from-amber-950 via-stone-900 to-neutral-900",
      },
      contactEmail: "hello@nordichome.in",
      currency: "INR",
    });

    const tenantCoffee = await Tenant.create({
      name: "Artisan Roastery & Brews",
      slug: "artisan-roastery",
      tagline: "Direct-Trade Single Origin Beans & Precision Brewers",
      description: "Roasted fresh weekly from high-altitude micro-lots in Chikmagalur, Coorg, and Araku Valley.",
      category: "Specialty Coffee & Gear",
      logo: "☕",
      bannerImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80",
      theme: {
        primaryColor: "#ea580c",
        accentColor: "#f97316",
        heroGradient: "from-stone-950 via-amber-950 to-neutral-950",
      },
      contactEmail: "orders@artisanroast.in",
      currency: "INR",
    });

    const tenantTech = await Tenant.create({
      name: "Apex Tech & Audio",
      slug: "apex-tech",
      tagline: "High-Performance Peripherals & Audiophile Gear",
      description: "Curated mechanical keyboards, active noise cancelling headphones, and ergonomic desktop accessories.",
      category: "Electronics & Smart Tech",
      logo: "🎧",
      bannerImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1600&q=80",
      theme: {
        primaryColor: "#6366f1",
        accentColor: "#818cf8",
        heroGradient: "from-indigo-950 via-slate-900 to-black",
      },
      contactEmail: "support@apextech.in",
      currency: "INR",
    });

    const tenantFashion = await Tenant.create({
      name: "Maison Luxe & Thread",
      slug: "maison-luxe",
      tagline: "Runway Silhouettes, Tailored Elegance & Contemporary Luxury",
      description: "Curated luxury couture, hand-finished cashmere coats, sculpted silk gowns, and artisanal leather accessories.",
      category: "Haute Couture & Designer Fashion",
      logo: "👗",
      bannerImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
      theme: {
        primaryColor: "#ec4899",
        accentColor: "#f472b6",
        heroGradient: "from-fuchsia-950 via-rose-950 to-neutral-950",
      },
      contactEmail: "concierge@maisonluxe.in",
      currency: "INR",
    });

    console.log("Created 5 tenant stores with INR currency!");

    // 2. Sneaker Vault Products
    const sneakerProducts = await Product.create([
      {
        tenantId: tenantSneakers._id,
        title: "Air Apex Retro '88 High",
        description: "Iconic high-top silhouette in premium tumbled leather with vintage sail midsole and responsive Air cushioning.",
        price: 14999,
        compareAtPrice: 17999,
        category: "High Tops",
        brand: "Apex Athletics",
        thumbnail: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80"],
        stock: 14,
        rating: 4.9,
        reviewsCount: 84,
        isFeatured: true,
        badge: "HOT DROP",
        reviews: [
          { userName: "Rohan Verma", rating: 5, comment: "Super comfy and 100% authentic leather. Worth every rupee!", createdAt: new Date("2026-09-12") },
          { userName: "Aman Gupta", rating: 5, comment: "Fast 2-day delivery to Mumbai. Looks even better in hand.", createdAt: new Date("2026-09-20") },
          { userName: "Karan Johar", rating: 4, comment: "Great silhouette, fits true to size. High quality stitching.", createdAt: new Date("2026-10-02") }
        ]
      },
      {
        tenantId: tenantSneakers._id,
        title: "Phantom Pulse Carbon Runner",
        description: "Ultralight aerodynamic runner with full-length carbon fiber propulsion plate and breathable mesh knit upper.",
        price: 11499,
        compareAtPrice: 13999,
        category: "Runners",
        brand: "PulseLab",
        thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"],
        stock: 22,
        rating: 4.8,
        reviewsCount: 42,
        isFeatured: true,
        badge: "BESTSELLER",
        reviews: [
          { userName: "Pooja Sharma", rating: 5, comment: "Best marathon shoes I've ever owned. Carbon plate really works.", createdAt: new Date("2026-08-15") },
          { userName: "Nikhil Rao", rating: 4, comment: "Very lightweight and springy response.", createdAt: new Date("2026-09-01") }
        ]
      },
      {
        tenantId: tenantSneakers._id,
        title: "Vanguard Court Low Olive / Gum",
        description: "Low-profile skateboard and lifestyle staple featuring suede overlays and durable gum rubber tread.",
        price: 6499,
        compareAtPrice: 7999,
        category: "Low Tops",
        brand: "Vanguard",
        thumbnail: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80"],
        stock: 35,
        rating: 4.6,
        reviewsCount: 29,
        isFeatured: false,
        badge: "POPULAR",
        reviews: [
          { userName: "Vicky Mehra", rating: 5, comment: "The gum sole gives incredible grip. Love the olive suede colorway.", createdAt: new Date("2026-08-25") },
          { userName: "Deepak Joshi", rating: 4, comment: "Solid everyday sneaker, highly durable.", createdAt: new Date("2026-09-10") }
        ]
      },
      {
        tenantId: tenantSneakers._id,
        title: "Cybernetic Wave Trainer",
        description: "Chunky Y2K aesthetic meets contemporary ergonomic arch support and 3M reflective trims.",
        price: 8999,
        compareAtPrice: 10999,
        category: "Chunky / Street",
        brand: "CyberStreet",
        thumbnail: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80"],
        stock: 9,
        rating: 4.7,
        reviewsCount: 19,
        isFeatured: true,
        badge: "LIMITED",
        reviews: [
          { userName: "Kabir Singh", rating: 5, comment: "Standout design! Got tons of compliments on the street.", createdAt: new Date("2026-09-18") }
        ]
      },
      {
        tenantId: tenantSneakers._id,
        title: "Hyperdrive Hardwood Classic Pro",
        description: "Heritage basketball shoe with locked-in ankle collar, Zoom air bag in heel, and herringbone traction.",
        price: 13499,
        compareAtPrice: 15999,
        category: "Basketball",
        brand: "Apex Athletics",
        thumbnail: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80"],
        stock: 16,
        rating: 4.8,
        reviewsCount: 33,
        isFeatured: false,
        badge: "COURT READY",
        reviews: [
          { userName: "Dev Patel", rating: 5, comment: "Excellent ankle support for outdoor and indoor basketball courts.", createdAt: new Date("2026-09-15") }
        ]
      },
      {
        tenantId: tenantSneakers._id,
        title: "CloudRecovery Slide Sandal",
        description: "Ergonomic dual-density foam recovery slide designed for post-workout comfort and relaxed weekend lounging.",
        price: 2499,
        compareAtPrice: 3199,
        category: "Slides & Comfort",
        brand: "PulseLab",
        thumbnail: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80"],
        stock: 45,
        rating: 4.5,
        reviewsCount: 52,
        isFeatured: false,
        badge: "UNDER 3K",
        reviews: [
          { userName: "Tarun Bajaj", rating: 5, comment: "Walking on clouds literally! Must buy for summer and post gym.", createdAt: new Date("2026-08-30") }
        ]
      },
      {
        tenantId: tenantSneakers._id,
        title: "Overdyed Vintage Street Hoodie (450 GSM)",
        description: "Heavyweight French terry oversized hoodie with double-layered hood and ribbed cuff reinforcements.",
        price: 3999,
        compareAtPrice: 4999,
        category: "Streetwear Apparel",
        brand: "CyberStreet",
        thumbnail: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80"],
        stock: 28,
        rating: 4.9,
        reviewsCount: 67,
        isFeatured: true,
        badge: "HOT DROP",
        reviews: [
          { userName: "Sameer Sheikh", rating: 5, comment: "Super heavy fabric. The boxy fit is spot on.", createdAt: new Date("2026-09-22") }
        ]
      },
      {
        tenantId: tenantSneakers._id,
        title: "Pro Shield Sneaker Cleaner & Nanotech Protector Kit",
        description: "All-in-one sneaker maintenance kit: 200ml foam solution, hog bristle brush, microfiber cloth & waterproof coating spray.",
        price: 1299,
        compareAtPrice: 1699,
        category: "Sneaker Care",
        brand: "PulseLab",
        thumbnail: "https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=800&q=80"],
        stock: 80,
        rating: 4.8,
        reviewsCount: 110,
        isFeatured: false,
        badge: "ESSENTIAL",
        reviews: [
          { userName: "Ananya Roy", rating: 5, comment: "Brought my white sneakers back to life. High quality brush.", createdAt: new Date("2026-09-05") }
        ]
      }
    ]);

    // 3. Nordic Minimalist Living Products
    await Product.create([
      {
        tenantId: tenantNordic._id,
        title: "Aura Bouclé Armchair",
        description: "Ergonomic curved silhouette upholstered in tactile textured cream bouclé with oiled solid white oak legs.",
        price: 28999,
        compareAtPrice: 34999,
        category: "Seating",
        brand: "Nordic Atelier",
        thumbnail: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80"],
        stock: 6,
        rating: 5.0,
        reviewsCount: 38,
        isFeatured: true,
        badge: "FEATURED",
        reviews: [
          { userName: "Shruti Kapoor", rating: 5, comment: "A centerpiece in our living room. Softest bouclé imaginable.", createdAt: new Date("2026-08-10") },
          { userName: "Rajeev Menon", rating: 5, comment: "Sturdy white oak craftsmanship and timeless Scandinavian form.", createdAt: new Date("2026-09-12") }
        ]
      },
      {
        tenantId: tenantNordic._id,
        title: "Hygge Fluted Ceramic Vase",
        description: "Hand-thrown stoneware with an organic matte off-white glaze and subtle fluted ribbing.",
        price: 2499,
        compareAtPrice: 3299,
        category: "Decor",
        brand: "Stoneware Studio",
        thumbnail: "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80"],
        stock: 40,
        rating: 4.9,
        reviewsCount: 65,
        isFeatured: true,
        badge: "HANDMADE",
        reviews: [
          { userName: "Neha Saxena", rating: 5, comment: "Exquisite texture and weight. Looks great with dried eucalyptus.", createdAt: new Date("2026-09-02") }
        ]
      },
      {
        tenantId: tenantNordic._id,
        title: "Stockholm Linear Oak Pendant",
        description: "Minimalist suspended luminaire crafted from FSC-certified Nordic ash wood with warm diffuse 2700K illumination.",
        price: 9999,
        compareAtPrice: 12499,
        category: "Lighting",
        brand: "Nordic Atelier",
        thumbnail: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"],
        stock: 12,
        rating: 4.8,
        reviewsCount: 22,
        isFeatured: false,
        badge: "ARCHITECTURAL",
        reviews: [
          { userName: "Gaurav Sen", rating: 5, comment: "The warm ambient lighting transforms dinner parties completely.", createdAt: new Date("2026-08-20") }
        ]
      },
      {
        tenantId: tenantNordic._id,
        title: "Kobenhavn Linen Throw Blanket",
        description: "100% pre-washed French flax linen throw in warm oatmeal stone, edged with delicate hand-fringed hems.",
        price: 3999,
        compareAtPrice: 4999,
        category: "Textiles",
        brand: "Loom & Craft",
        thumbnail: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80"],
        stock: 18,
        rating: 4.9,
        reviewsCount: 51,
        isFeatured: true,
        badge: "PURE LINEN",
        reviews: [
          { userName: "Meera Nair", rating: 5, comment: "Gets softer with every wash. Beautiful natural drape.", createdAt: new Date("2026-09-08") }
        ]
      },
      {
        tenantId: tenantNordic._id,
        title: "Hand-Carved Walnut Dining Chair",
        description: "Sculpted solid American walnut with woven Danish paper cord seat for ergonomic support and enduring longevity.",
        price: 16499,
        compareAtPrice: 19999,
        category: "Seating",
        brand: "Nordic Atelier",
        thumbnail: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80"],
        stock: 8,
        rating: 4.9,
        reviewsCount: 24,
        isFeatured: false,
        badge: "ARTISANAL",
        reviews: [
          { userName: "Arjun Reddy", rating: 5, comment: "The joinery is flawless. Outstanding build quality.", createdAt: new Date("2026-09-28") }
        ]
      },
      {
        tenantId: tenantNordic._id,
        title: "Matte Brass Mushroom Desk Lamp",
        description: "Spun brass dome with satin electroplated gold finish and 3-step touch dimmer for study and bedside tables.",
        price: 5499,
        compareAtPrice: 6999,
        category: "Lighting",
        brand: "Loom & Craft",
        thumbnail: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=800&q=80"],
        stock: 20,
        rating: 4.7,
        reviewsCount: 39,
        isFeatured: false,
        badge: "TOP RATED",
        reviews: [
          { userName: "Ritu Singhania", rating: 5, comment: "Gives such a cozy warm glow on my work desk.", createdAt: new Date("2026-08-28") }
        ]
      },
      {
        tenantId: tenantNordic._id,
        title: "Amber & Cedarwood Botanical Soy Candle (280g)",
        description: "Pure natural soy wax poured into an amber apothecary jar with cedarwood, vetiver, and smoky vanilla notes.",
        price: 1199,
        compareAtPrice: 1599,
        category: "Decor",
        brand: "Stoneware Studio",
        thumbnail: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80"],
        stock: 55,
        rating: 4.8,
        reviewsCount: 78,
        isFeatured: false,
        badge: "UNDER 2K",
        reviews: [
          { userName: "Priya Varma", rating: 5, comment: "Long lasting burn and fills the whole room with calming forest scents.", createdAt: new Date("2026-09-14") }
        ]
      },
      {
        tenantId: tenantNordic._id,
        title: "Wabi-Sabi Ceramic Dinner Plate Set (4 Pcs)",
        description: "Handcrafted unglazed matte rim dinner plates with speckled stoneware finish, microwave & dishwasher safe.",
        price: 3499,
        compareAtPrice: 4299,
        category: "Tableware",
        brand: "Stoneware Studio",
        thumbnail: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80"],
        stock: 25,
        rating: 4.9,
        reviewsCount: 44,
        isFeatured: false,
        badge: "BESTSELLER",
        reviews: [
          { userName: "Kavita Das", rating: 5, comment: "Dine like in a fine restaurant every day. Feels substantial in hand.", createdAt: new Date("2026-09-25") }
        ]
      }
    ]);

    // 4. Artisan Roastery & Brews Products
    await Product.create([
      {
        tenantId: tenantCoffee._id,
        title: "Chikmagalur Estate Reserve (340g)",
        description: "Single origin Arabica with rich cocoa aroma, notes of roasted almond, caramelized jaggery, and balanced citrus acidity.",
        price: 699,
        compareAtPrice: 850,
        category: "Whole Bean Coffee",
        brand: "Artisan Roastery",
        thumbnail: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80"],
        stock: 60,
        rating: 4.9,
        reviewsCount: 94,
        isFeatured: true,
        badge: "SINGLE ORIGIN",
        reviews: [
          { userName: "Vikram Iyer", rating: 5, comment: "Incredible aromatics in French Press! Caramelized sweetness is real.", createdAt: new Date("2026-09-02") },
          { userName: "Siddharth Paul", rating: 5, comment: "Freshly roasted date stamped on bag. 10/10 bean quality.", createdAt: new Date("2026-09-18") }
        ]
      },
      {
        tenantId: tenantCoffee._id,
        title: "Apex Precision Conical Burr Grinder",
        description: "Solid stainless steel CNC-machined 48mm burr set with micrometric step adjustments for South Indian filter to espresso.",
        price: 8499,
        compareAtPrice: 9999,
        category: "Brew Equipment",
        brand: "BaristaPro",
        thumbnail: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80"],
        stock: 15,
        rating: 4.9,
        reviewsCount: 31,
        isFeatured: true,
        badge: "PRO GEAR",
        reviews: [
          { userName: "Anand Murthy", rating: 5, comment: "Extremely consistent grind with zero boulders. Worth every rupee.", createdAt: new Date("2026-08-22") }
        ]
      },
      {
        tenantId: tenantCoffee._id,
        title: "Araku Valley Micro-Lot Natural (250g)",
        description: "Exotic organic certified lot featuring notes of ripe wild berries, stone fruit compote, and creamy milk chocolate finish.",
        price: 899,
        compareAtPrice: 1100,
        category: "Whole Bean Coffee",
        brand: "Artisan Roastery",
        thumbnail: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"],
        stock: 25,
        rating: 5.0,
        reviewsCount: 28,
        isFeatured: true,
        badge: "LIMITED LOT",
        reviews: [
          { userName: "Prashant Bhatt", rating: 5, comment: "Fruity explosion! The best pour-over bean from India.", createdAt: new Date("2026-09-11") }
        ]
      },
      {
        tenantId: tenantCoffee._id,
        title: "Gooseneck Smart Temperature Kettle (1.0L)",
        description: "1.0L matte black electric kettle with PID controller and 1-degree precision pour spout for pour-over excellence.",
        price: 5499,
        compareAtPrice: 6499,
        category: "Brew Equipment",
        brand: "BaristaPro",
        thumbnail: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80"],
        stock: 19,
        rating: 4.8,
        reviewsCount: 47,
        isFeatured: false,
        badge: "POPULAR",
        reviews: [
          { userName: "Harshil Parekh", rating: 5, comment: "Heats to exact 93C in under 2 minutes. The flow control is surgical.", createdAt: new Date("2026-09-01") }
        ]
      },
      {
        tenantId: tenantCoffee._id,
        title: "Coorg Dark Roast Peaberry (500g)",
        description: "Bold full-bodied single bean peaberry with notes of dark baker's chocolate, molasses, and roasted chicory undertone.",
        price: 749,
        compareAtPrice: 950,
        category: "Whole Bean Coffee",
        brand: "Artisan Roastery",
        thumbnail: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1587734195503-904fca47e0e9?auto=format&fit=crop&w=800&q=80"],
        stock: 50,
        rating: 4.7,
        reviewsCount: 63,
        isFeatured: false,
        badge: "VALUE PACK",
        reviews: [
          { userName: "Manoj Swaminathan", rating: 5, comment: "Makes an unbeatable South Indian filter coffee with frothy hot milk.", createdAt: new Date("2026-09-24") }
        ]
      },
      {
        tenantId: tenantCoffee._id,
        title: "Cold Brew Slow-Drip Dutch Tower",
        description: "Architectural borosilicate glass and bamboo frame slow-drip iced coffee extractor with micro-adjustable brass valve.",
        price: 4999,
        compareAtPrice: 6200,
        category: "Cold Brew",
        brand: "BaristaPro",
        thumbnail: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=800&q=80"],
        stock: 11,
        rating: 4.9,
        reviewsCount: 19,
        isFeatured: false,
        badge: "SHOWPIECE",
        reviews: [
          { userName: "Deepali Sen", rating: 5, comment: "Produces the smoothest, non-acidic cold brew concentrate. Looks stunning on kitchen counter.", createdAt: new Date("2026-08-19") }
        ]
      },
      {
        tenantId: tenantCoffee._id,
        title: "Precision 0.1g Digital Brew Scale with Built-in Timer",
        description: "Rechargeable barista espresso scale with high-sensitivity sensor, silicon heat-resistant pad, and auto-tare feature.",
        price: 2799,
        compareAtPrice: 3499,
        category: "Brew Equipment",
        brand: "BaristaPro",
        thumbnail: "https://images.unsplash.com/photo-1518057111178-44a106bad636?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1518057111178-44a106bad636?auto=format&fit=crop&w=800&q=80"],
        stock: 32,
        rating: 4.8,
        reviewsCount: 56,
        isFeatured: false,
        badge: "BESTSELLER",
        reviews: [
          { userName: "Naveen Raj", rating: 5, comment: "Ultra fast response time and USB-C rechargeable battery.", createdAt: new Date("2026-09-04") }
        ]
      },
      {
        tenantId: tenantCoffee._id,
        title: "Double-Wall Borosilicate Coffee Dripper & Server (600ml)",
        description: "Heat-retaining double wall glass V-cone dripper with ergonomic bamboo collar and measurement markings.",
        price: 1899,
        compareAtPrice: 2399,
        category: "Pour-Over Essentials",
        brand: "BaristaPro",
        thumbnail: "https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=800&q=80"],
        stock: 40,
        rating: 4.6,
        reviewsCount: 35,
        isFeatured: false,
        badge: "UNDER 2K",
        reviews: [
          { userName: "Divya Nambiar", rating: 5, comment: "Pours clean cups with excellent clarity. Very easy to clean.", createdAt: new Date("2026-09-17") }
        ]
      }
    ]);

    // 5. Apex Tech & Audio Products
    await Product.create([
      {
        tenantId: tenantTech._id,
        title: "SonicPulse Pro ANC Wireless Headphones",
        description: "Hybrid active noise cancellation (-42dB), 40mm titanium diaphragm drivers, LDAC high-res audio, and 50-hour battery life.",
        price: 16999,
        compareAtPrice: 21999,
        category: "Audio & Headphones",
        brand: "SonicPulse",
        thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"],
        stock: 18,
        rating: 4.9,
        reviewsCount: 128,
        isFeatured: true,
        badge: "FLAGSHIP",
        reviews: [
          { userName: "Tanmay Singhal", rating: 5, comment: "Noise cancellation is as good as Sony XM5, and bass is crisp without distortion.", createdAt: new Date("2026-09-10") },
          { userName: "Alok Chawla", rating: 5, comment: "Extremely comfortable plush memory earcups. Battery lasts entire week of coding.", createdAt: new Date("2026-09-22") }
        ]
      },
      {
        tenantId: tenantTech._id,
        title: "Apex Chroma 75% Mechanical Wireless Keyboard",
        description: "Gasket-mounted hot-swappable tactile mechanical keyboard with CNC aluminum top plate, South-facing RGB and tri-mode connectivity.",
        price: 8999,
        compareAtPrice: 11499,
        category: "Keyboards & Desk",
        brand: "Apex Tech",
        thumbnail: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80"],
        stock: 22,
        rating: 4.9,
        reviewsCount: 86,
        isFeatured: true,
        badge: "BESTSELLER",
        reviews: [
          { userName: "Siddhesh Kulkarni", rating: 5, comment: "The thock sound out of the box is legendary. Gasket mount makes typing like butter.", createdAt: new Date("2026-08-30") }
        ]
      },
      {
        tenantId: tenantTech._id,
        title: "ChronoTech Ultra Smartwatch with AMOLED Display",
        description: "1.43-inch 60Hz AMOLED screen, sapphire crystal glass, aerospace titanium case, dual-frequency GPS, and 14-day battery life.",
        price: 7499,
        compareAtPrice: 9999,
        category: "Wearables",
        brand: "ChronoTech",
        thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80"],
        stock: 30,
        rating: 4.8,
        reviewsCount: 74,
        isFeatured: true,
        badge: "TOP RATED",
        reviews: [
          { userName: "Aditya Nair", rating: 5, comment: "Accurate SpO2 and heart-rate tracking. The display brightness under direct sunlight is incredible.", createdAt: new Date("2026-09-14") }
        ]
      },
      {
        tenantId: tenantTech._id,
        title: "TrueWireless Studio Buds with Spatial Audio",
        description: "Dual-driver Bluetooth 5.3 earbuds with low-latency gaming mode, IPX5 sweat resistance, and wireless charging case.",
        price: 4999,
        compareAtPrice: 6499,
        category: "Audio & Headphones",
        brand: "SonicPulse",
        thumbnail: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80"],
        stock: 45,
        rating: 4.7,
        reviewsCount: 92,
        isFeatured: false,
        badge: "UNDER 5K",
        reviews: [
          { userName: "Varun Chopra", rating: 5, comment: "Fits securely while jogging. Call quality with quad microphones is crystal clear.", createdAt: new Date("2026-09-08") }
        ]
      },
      {
        tenantId: tenantTech._id,
        title: "AeroDock 9-in-1 Aluminium Thunderbolt Hub",
        description: "Dual 4K@60Hz HDMI outputs, 100W Power Delivery pass-through, Gigabit Ethernet, SD 4.0 card reader in anodized space gray aluminum.",
        price: 5999,
        compareAtPrice: 7499,
        category: "Accessories",
        brand: "Apex Tech",
        thumbnail: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"],
        stock: 35,
        rating: 4.8,
        reviewsCount: 51,
        isFeatured: false,
        badge: "ESSENTIAL",
        reviews: [
          { userName: "Kunal Mehra", rating: 5, comment: "Runs my dual 4K monitors and charges my MacBook with zero heat issues.", createdAt: new Date("2026-09-19") }
        ]
      },
      {
        tenantId: tenantTech._id,
        title: "Smart Atmosphere RGB Desktop Light Bar (2-Pack)",
        description: "Synchronized sound-reactive RGB ambient bars with 16 million colors, companion app control, and desktop stands.",
        price: 2499,
        compareAtPrice: 3299,
        category: "Smart Home",
        brand: "Apex Tech",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80"],
        stock: 50,
        rating: 4.6,
        reviewsCount: 68,
        isFeatured: false,
        badge: "POPULAR",
        reviews: [
          { userName: "Prateek Sharma", rating: 5, comment: "Elevates whole desk gaming setup! Reacts to music beats perfectly.", createdAt: new Date("2026-09-27") }
        ]
      },
      {
        tenantId: tenantTech._id,
        title: "Ergonomic Vertical Wireless Mouse (4000 DPI)",
        description: "57-degree natural handshake posture angle reducing wrist strain, silent optical clicks, and multi-device Bluetooth switching.",
        price: 3299,
        compareAtPrice: 4199,
        category: "Keyboards & Desk",
        brand: "Apex Tech",
        thumbnail: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80"],
        stock: 28,
        rating: 4.7,
        reviewsCount: 43,
        isFeatured: false,
        badge: "ERGONOMIC",
        reviews: [
          { userName: "Rishabh Malhotra", rating: 5, comment: "Cured my wrist pain from 8+ hours daily spreadsheets. Highly recommended.", createdAt: new Date("2026-09-16") }
        ]
      },
      {
        tenantId: tenantTech._id,
        title: "MagFast 3-in-1 Foldable Magnetic Wireless Charging Stand",
        description: "Simultaneous 15W fast charging for iPhone, Apple Watch, and AirPods in a travel-ready foldable CNC aluminum body.",
        price: 3999,
        compareAtPrice: 5199,
        category: "Accessories",
        brand: "Apex Tech",
        thumbnail: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1586953208448-b95a79798f07?auto=format&fit=crop&w=800&q=80"],
        stock: 40,
        rating: 4.9,
        reviewsCount: 77,
        isFeatured: true,
        badge: "BESTSELLER",
        reviews: [
          { userName: "Harsh Vardhan", rating: 5, comment: "Folds flat into backpack. Eliminates all cord clutter on my nightstand.", createdAt: new Date("2026-10-01") }
        ]
      }
    ]);

    // 6. Maison Luxe & Thread Fashion Products
    const fashionProducts = await Product.create([
      {
        tenantId: tenantFashion._id,
        title: "Cashmere Double-Breasted Trench Coat",
        description: "Hand-finished Mongolian cashmere blend with storm flap, tortoiseshell horn buttons, and belted waist.",
        price: 24999,
        compareAtPrice: 32000,
        category: "Jackets & Coats",
        brand: "Maison Atelier",
        thumbnail: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80"],
        stock: 10,
        rating: 4.9,
        reviewsCount: 42,
        isFeatured: true,
        badge: "RUNWAY EXCLUSIVE",
        reviews: [
          { userName: "Natasha Poonawalla", rating: 5, comment: "Drapes like a dream. The cashmere is ultra soft and luxurious.", createdAt: new Date("2026-09-12") },
          { userName: "Tara Sutaria", rating: 5, comment: "Timeless silhouette. Best investment trench coat in India.", createdAt: new Date("2026-09-29") }
        ]
      },
      {
        tenantId: tenantFashion._id,
        title: "Sculpted Italian Silk Slip Evening Dress",
        description: "Pure mulberry silk charmeuse cut on the bias with delicate rouleau straps and open back drape in emerald noir.",
        price: 14499,
        compareAtPrice: 18999,
        category: "Evening Dresses",
        brand: "Luxe Couture",
        thumbnail: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80"],
        stock: 14,
        rating: 5.0,
        reviewsCount: 36,
        isFeatured: true,
        badge: "HOT DROP",
        reviews: [
          { userName: "Ananya Panday", rating: 5, comment: "Felt like royalty at the gala. Flawless silk quality.", createdAt: new Date("2026-09-18") }
        ]
      },
      {
        tenantId: tenantFashion._id,
        title: "Tailored Oversized Wool Blazer in Noir",
        description: "Structured shoulder pads, peaked lapels, and double-vented back tailored from 100% fine Italian merino wool.",
        price: 12999,
        compareAtPrice: 16500,
        category: "Blazers & Suiting",
        brand: "Maison Atelier",
        thumbnail: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80"],
        stock: 22,
        rating: 4.8,
        reviewsCount: 58,
        isFeatured: true,
        badge: "BESTSELLER",
        reviews: [
          { userName: "Rhea Kapoor", rating: 5, comment: "The structure is sharp and masculine-feminine balance is spot on.", createdAt: new Date("2026-09-04") }
        ]
      },
      {
        tenantId: tenantFashion._id,
        title: "Handcrafted Saffiano Leather Tote Bag",
        description: "Scratch-resistant cross-grain Saffiano leather with gold-tone hardware, protective metal feet, and padded laptop sleeve.",
        price: 18499,
        compareAtPrice: 23000,
        category: "Luxury Handbags",
        brand: "L'Artisan Paris",
        thumbnail: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80"],
        stock: 12,
        rating: 4.9,
        reviewsCount: 29,
        isFeatured: true,
        badge: "ARTISANAL",
        reviews: [
          { userName: "Kareena Sengupta", rating: 5, comment: "Spacious enough for a MacBook Pro and looks so chic for meetings.", createdAt: new Date("2026-09-22") }
        ]
      },
      {
        tenantId: tenantFashion._id,
        title: "Relaxed Pleated Wide-Leg Trousers",
        description: "High-waisted fluid drape trousers with front knife pleats, slant pockets, and breathable tropical wool fabric.",
        price: 5999,
        compareAtPrice: 7999,
        category: "Trousers & Bottoms",
        brand: "Maison Atelier",
        thumbnail: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80"],
        stock: 35,
        rating: 4.7,
        reviewsCount: 48,
        isFeatured: false,
        badge: "TRENDING",
        reviews: [
          { userName: "Pooja Hegde", rating: 5, comment: "Very flattering high-waist fit. Moves effortlessly with every step.", createdAt: new Date("2026-09-14") }
        ]
      },
      {
        tenantId: tenantFashion._id,
        title: "Organic Pima Cotton Structured Shirt",
        description: "Crisp long-staple organic Pima cotton button-down featuring mother-of-pearl buttons and exaggerated French cuffs.",
        price: 4499,
        compareAtPrice: 5999,
        category: "Shirts & Tops",
        brand: "Thread Studio",
        thumbnail: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80"],
        stock: 40,
        rating: 4.8,
        reviewsCount: 33,
        isFeatured: false,
        badge: "ESSENTIAL",
        reviews: [
          { userName: "Mira Rajput", rating: 5, comment: "Crispest white shirt in my closet. Washes well without losing sheen.", createdAt: new Date("2026-09-25") }
        ]
      },
      {
        tenantId: tenantFashion._id,
        title: "Monogram Silk Twill Neck Scarf (70x70cm)",
        description: "Hand-rolled edges on 100% heavyweight silk twill with geometric art-deco motif and lustrous finish.",
        price: 2999,
        compareAtPrice: 3999,
        category: "Accessories",
        brand: "Luxe Couture",
        thumbnail: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80"],
        stock: 60,
        rating: 4.9,
        reviewsCount: 65,
        isFeatured: false,
        badge: "GIFT PICK",
        reviews: [
          { userName: "Dia Mirza", rating: 5, comment: "Versatile styling accessory. Tie it around tote bags or wear it as a neck scarf.", createdAt: new Date("2026-08-30") }
        ]
      },
      {
        tenantId: tenantFashion._id,
        title: "Minimalist Gold-Plated Sculptural Choker",
        description: "18K thick gold vermeil over recycled sterling silver with ergonomic open-collar contour and mirror finish.",
        price: 3799,
        compareAtPrice: 4999,
        category: "Jewelry",
        brand: "L'Artisan Paris",
        thumbnail: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"],
        stock: 25,
        rating: 4.8,
        reviewsCount: 52,
        isFeatured: false,
        badge: "POPULAR",
        reviews: [
          { userName: "Sobhita Dhulipala", rating: 5, comment: "Architectural and minimalist. Pairs perfectly with evening blazers.", createdAt: new Date("2026-09-17") }
        ]
      }
    ]);

    console.log("Created INR products across 5 stores with rich categories and reviews!");

    // 7. Seed Demo Orders for Customer (Profile Tab)
    await Order.create([
      {
        tenantId: tenantFashion._id,
        orderNumber: "ORD-94821-IN",
        customer: {
          name: "Rahul Verma",
          email: "customer@example.com",
          phone: "+91 91234 56789",
          address: {
            street: "Flat 402, Sea View Apartments, Bandra West",
            city: "Mumbai",
            state: "Maharashtra",
            zip: "400050",
            country: "India",
          },
        },
        items: [
          {
            productId: fashionProducts[0]._id,
            title: "Cashmere Double-Breasted Trench Coat",
            price: 24999,
            quantity: 1,
            thumbnail: "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80",
          },
          {
            productId: fashionProducts[6]._id,
            title: "Monogram Silk Twill Neck Scarf",
            price: 2999,
            quantity: 1,
            thumbnail: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&w=800&q=80",
          }
        ],
        subtotal: 27998,
        discount: 5599,
        couponCode: "FESTIVE20",
        shipping: 0,
        tax: 1120,
        totalAmount: 23519,
        paymentMethod: "upi",
        paymentStatus: "paid",
        shippingDetails: {
          carrier: "BlueDart Express Air",
          trackingNumber: "BD98472910IN",
          estimatedDelivery: "Tomorrow by 2:00 PM",
        },
        orderStatus: "shipped",
      },
      {
        tenantId: tenantSneakers._id,
        orderNumber: "ORD-83910-IN",
        customer: {
          name: "Rahul Verma",
          email: "customer@example.com",
          phone: "+91 91234 56789",
          address: {
            street: "12/A Green Glen Layout, Bellandur",
            city: "Bengaluru",
            state: "Karnataka",
            zip: "560103",
            country: "India",
          },
        },
        items: [
          {
            productId: sneakerProducts[0]._id,
            title: "Air Apex Retro '88 High",
            price: 14999,
            quantity: 1,
            thumbnail: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
          }
        ],
        subtotal: 14999,
        discount: 2250,
        couponCode: "VIP15",
        shipping: 0,
        tax: 637,
        totalAmount: 13386,
        paymentMethod: "card",
        paymentStatus: "paid",
        shippingDetails: {
          carrier: "Delhivery Surface Prime",
          trackingNumber: "DLV8391038IN",
          estimatedDelivery: "Delivered",
        },
        orderStatus: "delivered",
      }
    ]);

    console.log("Created demo order records for Profile tracking!");

    // 8. Demo Users with Indian Addresses
    await User.create([
      {
        name: "Samir Khan",
        email: "samir@example.com",
        password: "password123",
        role: "merchant",
        phone: "+91 98765 43210",
        tenantId: tenantSneakers._id,
        addresses: [
          {
            label: "Home",
            street: "Flat 402, Sea View Apartments, Bandra West",
            city: "Mumbai",
            state: "Maharashtra",
            zip: "400050",
            country: "India",
            isDefault: true,
          }
        ]
      },
      {
        name: "Rahul Verma",
        email: "customer@example.com",
        password: "password123",
        role: "customer",
        phone: "+91 91234 56789",
        addresses: [
          {
            label: "Home",
            street: "12/A Green Glen Layout, Bellandur",
            city: "Bengaluru",
            state: "Karnataka",
            zip: "560103",
            country: "India",
            isDefault: true,
          }
        ]
      },
    ]);

    console.log("Seeding finished successfully with 4 stores, 32+ products, categories, reviews, and INR currency!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
