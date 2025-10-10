import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products").collect();
  },
});

export const getSpotlight = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("products")
      .withIndex("by_spotlight", (q) => q.eq("isSpotlight", true))
      .collect();
  },
});

export const getByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const seedProducts = mutation({
  args: {},
  handler: async (ctx) => {
    const products = [
      {
        name: "AquaPure Elite RO+UV",
        description: "Premium 7-stage purification with RO+UV+UF technology. Perfect for homes and small offices.",
        price: 12999,
        originalPrice: 15999,
        category: "Premium",
        image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=500",
        features: ["7-Stage Purification", "RO+UV+UF", "8L Storage", "TDS Controller"],
        inStock: true,
        isSpotlight: true,
        rating: 4.8,
      },
      {
        name: "AquaPure Classic RO",
        description: "Reliable 5-stage RO purification system for everyday use.",
        price: 8999,
        originalPrice: 10999,
        category: "Standard",
        image: "https://images.unsplash.com/photo-1563207153-f403bf289096?w=500",
        features: ["5-Stage Purification", "RO Technology", "6L Storage", "Energy Efficient"],
        inStock: true,
        isSpotlight: true,
        rating: 4.5,
      },
      {
        name: "AquaPure Pro UV",
        description: "Advanced UV purification for municipal water supply.",
        price: 6999,
        category: "Standard",
        image: "https://images.unsplash.com/photo-1550537687-c91072c4792d?w=500",
        features: ["UV Purification", "4L Storage", "Compact Design", "Low Maintenance"],
        inStock: true,
        isSpotlight: true,
        rating: 4.3,
      },
      {
        name: "AquaPure Max RO+UV+Alkaline",
        description: "Ultimate purification with alkaline boost for enhanced health benefits.",
        price: 18999,
        originalPrice: 22999,
        category: "Premium",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500",
        features: ["9-Stage Purification", "Alkaline Boost", "10L Storage", "Smart Display"],
        inStock: true,
        isSpotlight: true,
        rating: 4.9,
      },
      {
        name: "AquaPure Compact RO",
        description: "Space-saving design with powerful RO purification.",
        price: 7499,
        category: "Standard",
        image: "https://images.unsplash.com/photo-1584555684040-bad07f3a8c0e?w=500",
        features: ["Compact Design", "RO Technology", "5L Storage", "Wall Mountable"],
        inStock: true,
        isSpotlight: false,
        rating: 4.2,
      },
      {
        name: "AquaPure Smart RO",
        description: "IoT-enabled smart purifier with app control.",
        price: 16999,
        category: "Premium",
        image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500",
        features: ["Smart App Control", "RO+UV", "Filter Change Alerts", "8L Storage"],
        inStock: true,
        isSpotlight: false,
        rating: 4.7,
      },
      {
        name: "AquaPure Gravity Filter",
        description: "Non-electric gravity-based water purifier.",
        price: 3999,
        category: "Basic",
        image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500",
        features: ["No Electricity", "Gravity Based", "20L Capacity", "Portable"],
        inStock: true,
        isSpotlight: false,
        rating: 4.0,
      },
      {
        name: "AquaPure Commercial RO",
        description: "High-capacity purifier for commercial establishments.",
        price: 45999,
        category: "Commercial",
        image: "https://images.unsplash.com/photo-1585435557343-3b092031a831?w=500",
        features: ["50L/Hour", "Industrial Grade", "Auto-Flush", "Stainless Steel"],
        inStock: true,
        isSpotlight: false,
        rating: 4.6,
      },
    ];

    for (const product of products) {
      await ctx.db.insert("products", product);
    }

    return { success: true, count: products.length };
  },
});
