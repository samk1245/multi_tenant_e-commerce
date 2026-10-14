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
    console.log("Connected to MongoDB for INR seeding...");

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

    // 1. Create Tenants with INR Currency
    const tenantSneakers = await Tenant.create({
      name: "Urban Sneaker Vault",
      slug: "sneaker-vault",
      tagline: "Exclusive Kicks, Limited Drops & High-Heat Streetwear",
      description: "Premier Indian destination for authentic collector sneakers, retro classics, and urban hypebeast apparel.",
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
      description: "Timeless artisanal furniture, hand-turned ceramics, and warm architectural lighting for modern sanctuaries in India.",
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

    console.log("Created 3 tenant stores with INR currency!");

    // 2. Create Products in INR for Sneaker Vault
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
          { userName: "Rohan Verma", rating: 5, comment: "Super comfy and 100% authentic leather. Worth every rupee!" },
          { userName: "Aman Gupta", rating: 5, comment: "Fast 2-day delivery to Mumbai. Looks even better in hand." }
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
          { userName: "Pooja Sharma", rating: 5, comment: "Best marathon shoes I've ever owned. Carbon plate really works." }
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
        rating: 4.7,
        reviewsCount: 29,
        isFeatured: false,
        badge: "NEW",
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
        rating: 4.9,
        reviewsCount: 19,
        isFeatured: true,
        badge: "LIMITED",
      },
    ]);

    // 3. Create Products in INR for Nordic Minimalist Living
    const nordicProducts = await Product.create([
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
      },
    ]);

    // 4. Create Products in INR for Artisan Roastery
    const coffeeProducts = await Product.create([
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
      },
      {
        tenantId: tenantCoffee._id,
        title: "Araku Valley Micro-Lot Natural",
        description: "Exotic organic certified lot featuring notes of ripe wild berries, stone fruit compote, and creamy milk chocolate finish.",
        price: 899,
        compareAtPrice: 1100,
        category: "Whole Bean Coffee",
        brand: "Artisan Roastery",
        thumbnail: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80"],
        stock: 25,
        rating: 5.0,
        reviewsCount: 18,
        isFeatured: true,
        badge: "LIMITED LOT",
      },
      {
        tenantId: tenantCoffee._id,
        title: "Gooseneck Smart Temperature Kettle",
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
      },
    ]);

    console.log("Created INR products for all 3 stores!");

    // 5. Create Initial Demo Users
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

    console.log("Seeding finished successfully with INR currency!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
