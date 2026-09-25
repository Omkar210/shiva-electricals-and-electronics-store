import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("Seeding products with valid UUIDs...");
  const products = [
    {
      id: 'a1000000-0000-0000-0000-000000000001',
      category_id: 'c1000000-0000-0000-0000-000000000001',
      brand_id: 'b1000000-0000-0000-0000-000000000001',
      name: 'AquaPure Elite RO+UV+UF Water Purifier (8L)',
      slug: 'aquapure-elite-ro-uv-uf-8l',
      sku: 'RO-AP-ELITE-001',
      description: 'Premium 7-stage purification with RO+UV+UF and TDS controller. 8-liter storage tank suitable for home and office use.',
      price: 12999.00,
      mrp: 15999.00,
      stock_quantity: 15,
      low_stock_threshold: 3,
      compatibility: 'Universal wall mount or tabletop. Suitable for borewell, tanker, and municipal tap water up to 2000 TDS.',
      warranty: '1 Year Comprehensive Manufacturer Warranty + Free Installation',
      is_active: true
    },
    {
      id: 'a1000000-0000-0000-0000-000000000002',
      category_id: 'c1000000-0000-0000-0000-000000000001',
      brand_id: 'b1000000-0000-0000-0000-000000000001',
      name: 'AquaPure Max RO+UV+Alkaline Water Purifier (10L)',
      slug: 'aquapure-max-ro-uv-alkaline-10l',
      sku: 'RO-AP-MAX-002',
      description: 'Advanced 9-stage purification with alkaline remineralization filter and smart LED display.',
      price: 18999.00,
      mrp: 22999.00,
      stock_quantity: 10,
      low_stock_threshold: 2,
      compatibility: 'Compatible with standard 1/4" water inlet. Suitable for high TDS water up to 2500 TDS.',
      warranty: '1 Year Warranty on RO membrane and electrical components',
      is_active: true
    },
    {
      id: 'a1000000-0000-0000-0000-000000000003',
      category_id: 'c1000000-0000-0000-0000-000000000002',
      brand_id: 'b1000000-0000-0000-0000-000000000001',
      name: 'AquaPure Spun Pre-Filter Candle (10-Inch, 5 Micron)',
      slug: 'aquapure-spun-pre-filter-10-inch',
      sku: 'SPARE-AP-PF-10',
      description: 'High-density melt-blown polypropylene sediment filter candle for external pre-filter bowls. Traps dirt, sand, and rust.',
      price: 150.00,
      mrp: 250.00,
      stock_quantity: 120,
      low_stock_threshold: 20,
      compatibility: 'Fits all standard 10-inch pre-filter outer bowls (Kent, Aquaguard, AquaPure, Livpure, etc.)',
      warranty: 'Warranty against manufacturing defects upon delivery',
      is_active: true
    },
    {
      id: 'a1000000-0000-0000-0000-000000000004',
      category_id: 'c1000000-0000-0000-0000-000000000002',
      brand_id: 'b1000000-0000-0000-0000-000000000001',
      name: '75 GPD RO Membrane (High TDS Filtration)',
      slug: '75-gpd-ro-membrane',
      sku: 'SPARE-RO-MEM-75',
      description: 'High-rejection thin-film composite (TFC) reverse osmosis membrane capable of filtering up to 75 gallons per day.',
      price: 1200.00,
      mrp: 1800.00,
      stock_quantity: 40,
      low_stock_threshold: 8,
      compatibility: 'Fits all standard residential RO membrane housings.',
      warranty: '6 Months Warranty against TDS leakage',
      is_active: true
    },
    {
      id: 'a1000000-0000-0000-0000-000000000005',
      category_id: 'c1000000-0000-0000-0000-000000000004',
      brand_id: 'b1000000-0000-0000-0000-000000000004',
      name: 'Havells Festiva 1200mm Ceiling Fan (Pearl White)',
      slug: 'havells-festiva-1200mm-ceiling-fan',
      sku: 'FAN-HAV-FEST-1200',
      description: 'Energy-efficient decorative ceiling fan with metallic finish blades and high-air delivery motor.',
      price: 2850.00,
      mrp: 3450.00,
      stock_quantity: 25,
      low_stock_threshold: 5,
      compatibility: 'Standard ceiling hook mount with downrod included.',
      warranty: '2 Years Manufacturer Warranty',
      is_active: true
    },
    {
      id: 'a1000000-0000-0000-0000-000000000006',
      category_id: 'c1000000-0000-0000-0000-000000000004',
      brand_id: 'b1000000-0000-0000-0000-000000000006',
      name: 'Anchor Roma Modular 6A 1-Way Switch (White, Pack of 10)',
      slug: 'anchor-roma-modular-6a-switch-pack-10',
      sku: 'ELEC-ANC-SW-6A-10',
      description: 'Durable polycarbonate modular switches with silver contacts for spark-free performance.',
      price: 380.00,
      mrp: 450.00,
      stock_quantity: 50,
      low_stock_threshold: 10,
      compatibility: 'Compatible with Anchor Roma plates and standard modular base frames.',
      warranty: '10 Years Warranty against mechanical fault',
      is_active: true
    }
  ];
  const { error: pErr } = await supabase.from("products").upsert(products, { onConflict: "slug" });
  if (pErr) console.error("Product seed error:", pErr); else console.log("Products seeded successfully!");
}

seed().catch(console.error);
