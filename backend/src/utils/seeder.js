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
    console.log("Connected to MongoDB for seeding...");

    // Clear existing collections & stale indexes
    await Tenant.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await User.deleteMany({});
    try {
      await Product.collection.dropIndexes();
    } catch (e) {
      // ignore if collection didn't have custom indexes
    }
    console.log("Cleared existing database data and indexes.");

    // 1. Create Tenants
    const tenantSneakers = await Tenant.create({
      name: "Urban Sneaker Vault",
      slug: "sneaker-vault",
      tagline: "Exclusive Kicks, Limited Drops & High-Heat Streetwear",
      description: "Premier destination for authentic collector sneakers, retro classics, and urban hypebeast apparel.",
      category: "Footwear & Streetwear",
      logo: "👟",
      bannerImage: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=1600&q=80",
      theme: {
        primaryColor: "#059669", // emerald-600
        accentColor: "#10b981",
        heroGradient: "from-emerald-900 via-teal-900 to-black",
      },
      contactEmail: "drops@sneakervault.io",
      currency: "USD",
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
        primaryColor: "#d97706", // amber-600
        accentColor: "#f59e0b",
        heroGradient: "from-amber-950 via-stone-900 to-neutral-900",
      },
      contactEmail: "hello@nordichome.design",
      currency: "USD",
    });

    const tenantCoffee = await Tenant.create({
      name: "Artisan Roastery & Brews",
      slug: "artisan-roastery",
      tagline: "Direct-Trade Single Origin Beans & Precision Brewers",
      description: "Roasted fresh weekly from high-altitude micro-lots in Ethiopia, Colombia, and Guatemala.",
      category: "Specialty Coffee & Gear",
      logo: "☕",
      bannerImage: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80",
      theme: {
        primaryColor: "#ea580c", // orange-600 / coffee rust
        accentColor: "#f97316",
        heroGradient: "from-stone-950 via-amber-950 to-neutral-950",
      },
      contactEmail: "orders@artisanroast.coffee",
      currency: "USD",
    });

    console.log("Created 3 tenant stores!");

    // 2. Create Products for Sneaker Vault
    const sneakerProducts = await Product.create([
      {
        tenantId: tenantSneakers._id,
        title: "Air Apex Retro '88 High",
        description: "Iconic high-top silhouette in premium tumbled leather with vintage sail midsole and responsive Air cushioning.",
        price: 219.99,
        compareAtPrice: 249.99,
        category: "High Tops",
        thumbnail: "https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80"],
        stock: 14,
        rating: 4.9,
        reviewsCount: 84,
        isFeatured: true,
        badge: "HOT DROP",
      },
      {
        tenantId: tenantSneakers._id,
        title: "Phantom Pulse Carbon Runner",
        description: "Ultralight aerodynamic runner with full-length carbon fiber propulsion plate and breathable mesh knit upper.",
        price: 189.50,
        compareAtPrice: 210.00,
        category: "Runners",
        thumbnail: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"],
        stock: 22,
        rating: 4.8,
        reviewsCount: 42,
        isFeatured: true,
        badge: "BESTSELLER",
      },
      {
        tenantId: tenantSneakers._id,
        title: "Vanguard Court Low Olive / Gum",
        description: "Low-profile skateboard and lifestyle staple featuring suede overlays and durable gum rubber tread.",
        price: 129.00,
        compareAtPrice: null,
        category: "Low Tops",
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
        price: 165.00,
        compareAtPrice: 195.00,
        category: "Chunky / Street",
        thumbnail: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80"],
        stock: 9,
        rating: 4.9,
        reviewsCount: 19,
        isFeatured: true,
        badge: "LIMITED",
      },
    ]);

    // 3. Create Products for Nordic Minimalist Living
    const nordicProducts = await Product.create([
      {
        tenantId: tenantNordic._id,
        title: "Aura Bouclé Armchair",
        description: "Ergonomic curved silhouette upholstered in tactile textured cream bouclé with oiled solid white oak legs.",
        price: 680.00,
        compareAtPrice: 750.00,
        category: "Seating",
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
        price: 54.00,
        compareAtPrice: 65.00,
        category: "Decor",
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
        price: 290.00,
        compareAtPrice: null,
        category: "Lighting",
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
        price: 110.00,
        compareAtPrice: 135.00,
        category: "Textiles",
        thumbnail: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80"],
        stock: 18,
        rating: 4.9,
        reviewsCount: 51,
        isFeatured: true,
        badge: "PURE LINEN",
      },
    ]);

    // 4. Create Products for Artisan Roastery
    const coffeeProducts = await Product.create([
      {
        tenantId: tenantCoffee._id,
        title: "Ethiopia Yirgacheffe G1 Washed (340g)",
        description: "Floral notes of jasmine and bergamot with bright notes of Meyer lemon and honey sweetness.",
        price: 24.50,
        compareAtPrice: 28.00,
        category: "Whole Bean Coffee",
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
        description: "Solid stainless steel CNC-machined 48mm burr set with micrometric step adjustments for espresso to French press.",
        price: 175.00,
        compareAtPrice: 199.00,
        category: "Brew Equipment",
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
        title: "Colombia Huila Gesha Natural",
        description: "Exotic varietal featuring ripe raspberry, dark stone fruit compote, and creamy cocoa finish.",
        price: 32.00,
        compareAtPrice: null,
        category: "Whole Bean Coffee",
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
        description: "1.0L matte black electric kettle with PID strix controller and 1-degree precision pour spout.",
        price: 135.00,
        compareAtPrice: 150.00,
        category: "Brew Equipment",
        thumbnail: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80",
        images: ["https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80"],
        stock: 19,
        rating: 4.8,
        reviewsCount: 47,
        isFeatured: false,
        badge: "POPULAR",
      },
    ]);

    console.log("Created products for all 3 stores!");

    // 5. Create Sample Orders for analytics demonstration
    await Order.create([
      {
        tenantId: tenantSneakers._id,
        orderNumber: "ORD-9201-4821",
        customer: {
          name: "Marcus Vance",
          email: "marcus@streetculture.com",
          phone: "+1 (555) 234-5678",
          address: { street: "742 Evergreen Terr", city: "Los Angeles", state: "CA", zip: "90001" },
        },
        items: [
          {
            productId: sneakerProducts[0]._id,
            title: sneakerProducts[0].title,
            price: sneakerProducts[0].price,
            quantity: 1,
            thumbnail: sneakerProducts[0].thumbnail,
          },
        ],
        subtotal: 219.99,
        shipping: 0,
        tax: 17.60,
        totalAmount: 237.59,
        paymentStatus: "paid",
        orderStatus: "delivered",
      },
      {
        tenantId: tenantNordic._id,
        orderNumber: "ORD-8822-1109",
        customer: {
          name: "Sophia Lindqvist",
          email: "sophia.l@interiorstudio.se",
          phone: "+1 (555) 345-6789",
          address: { street: "450 Scandinavian Way", city: "Seattle", state: "WA", zip: "98101" },
        },
        items: [
          {
            productId: nordicProducts[0]._id,
            title: nordicProducts[0].title,
            price: nordicProducts[0].price,
            quantity: 1,
            thumbnail: nordicProducts[0].thumbnail,
          },
          {
            productId: nordicProducts[1]._id,
            title: nordicProducts[1].title,
            price: nordicProducts[1].price,
            quantity: 2,
            thumbnail: nordicProducts[1].thumbnail,
          },
        ],
        subtotal: 788.00,
        shipping: 25.00,
        tax: 63.04,
        totalAmount: 876.04,
        paymentStatus: "paid",
        orderStatus: "shipped",
      },
    ]);

    // 6. Create Demo Users
    await User.create([
      {
        name: "Admin Merchant",
        email: "merchant@multitenant.com",
        password: "password123",
        role: "merchant",
        tenantId: tenantSneakers._id,
      },
      {
        name: "Demo Customer",
        email: "customer@example.com",
        password: "password123",
        role: "customer",
      },
    ]);

    console.log("Seeding finished successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();
