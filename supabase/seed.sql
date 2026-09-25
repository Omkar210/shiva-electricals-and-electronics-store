-- ==============================================================================
-- Shiva Electrical & Electronics — Development Seed Data
-- Clearly labeled demo/seed data for local development testing.
-- ==============================================================================

-- 1. Initial Categories
INSERT INTO public.categories (id, name, slug, description, is_active)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'RO Purifiers', 'ro-purifiers', 'Residential and commercial water purification systems', true),
  ('c1000000-0000-0000-0000-000000000002', 'RO Spare Parts', 'ro-spare-parts', 'Genuine filters, membranes, pumps, and accessories', true),
  ('c1000000-0000-0000-0000-000000000003', 'Fans', 'fans', 'Ceiling fans, table fans, exhaust fans, and regulators', true),
  ('c1000000-0000-0000-0000-000000000004', 'Electrical & Electronics', 'electrical-electronics', 'Switches, wiring, LED lighting, and appliances', true),
  ('c1000000-0000-0000-0000-000000000005', 'Services', 'services', 'Installation, maintenance contracts (AMC), and repairs', true)
ON CONFLICT (slug) DO NOTHING;

-- 2. Initial Brands
INSERT INTO public.brands (id, name, slug, is_active)
VALUES
  ('b1000000-0000-0000-0000-000000000001', 'AquaPure', 'aquapure', true),
  ('b1000000-0000-0000-0000-000000000002', 'Kent', 'kent', true),
  ('b1000000-0000-0000-0000-000000000003', 'Aquaguard', 'aquaguard', true),
  ('b1000000-0000-0000-0000-000000000004', 'Havells', 'havells', true),
  ('b1000000-0000-0000-0000-000000000005', 'Crompton', 'crompton', true),
  ('b1000000-0000-0000-0000-000000000006', 'Anchor by Panasonic', 'anchor', true),
  ('b1000000-0000-0000-0000-000000000007', 'Usha', 'usha', true)
ON CONFLICT (slug) DO NOTHING;

-- 3. Initial Delivery Zones (Demo Data for Local & Nearby Towns)
INSERT INTO public.delivery_zones (pincode, town, zone_name, delivery_charge, estimated_delivery, minimum_order, is_active)
VALUES
  ('400001', 'Local Town Central', 'Zone A - Same Day', 0.00, 'Same Day (2-4 hours)', 500.00, true),
  ('400002', 'Local Town North', 'Zone B - Local', 30.00, 'Same Day (4-6 hours)', 300.00, true),
  ('400003', 'Local Town East', 'Zone C - Outer', 50.00, 'Next Day', 500.00, true),
  ('400004', 'Nearby Town A', 'Zone D - Nearby Town', 80.00, '1-2 Days', 1000.00, true),
  ('400005', 'Nearby Town B', 'Zone E - Extended Area', 120.00, '2-3 Days', 1500.00, true)
ON CONFLICT (pincode) DO NOTHING;

-- 4. Initial Sample Products (Demo Data)
INSERT INTO public.products (id, category_id, brand_id, name, slug, sku, description, price, mrp, stock_quantity, low_stock_threshold, compatibility, warranty, is_active)
VALUES
  (
    'a1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'AquaPure Elite RO+UV+UF Water Purifier (8L)',
    'aquapure-elite-ro-uv-uf-8l',
    'RO-AP-ELITE-001',
    'Premium 7-stage purification with RO+UV+UF and TDS controller. 8-liter storage tank suitable for home and office use.',
    12999.00,
    15999.00,
    15,
    3,
    'Universal wall mount or tabletop. Suitable for borewell, tanker, and municipal tap water up to 2000 TDS.',
    '1 Year Comprehensive Manufacturer Warranty + Free Installation',
    true
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'AquaPure Max RO+UV+Alkaline Water Purifier (10L)',
    'aquapure-max-ro-uv-alkaline-10l',
    'RO-AP-MAX-002',
    'Advanced 9-stage purification with alkaline remineralization filter and smart LED display.',
    18999.00,
    22999.00,
    10,
    2,
    'Compatible with standard 1/4" water inlet. Suitable for high TDS water up to 2500 TDS.',
    '1 Year Warranty on RO membrane and electrical components',
    true
  ),
  (
    'a1000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000001',
    'AquaPure Spun Pre-Filter Candle (10-Inch, 5 Micron)',
    'aquapure-spun-pre-filter-10-inch',
    'SPARE-AP-PF-10',
    'High-density melt-blown polypropylene sediment filter candle for external pre-filter bowls. Traps dirt, sand, and rust.',
    150.00,
    250.00,
    120,
    20,
    'Fits all standard 10-inch pre-filter outer bowls (Kent, Aquaguard, AquaPure, Livpure, etc.)',
    'Warranty against manufacturing defects upon delivery',
    true
  ),
  (
    'a1000000-0000-0000-0000-000000000004',
    'c1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000001',
    '75 GPD RO Membrane (High TDS Filtration)',
    '75-gpd-ro-membrane',
    'SPARE-RO-MEM-75',
    'High-rejection thin-film composite (TFC) reverse osmosis membrane capable of filtering up to 75 gallons per day.',
    1200.00,
    1800.00,
    40,
    8,
    'Fits all standard residential RO membrane housings.',
    '6 Months Warranty against TDS leakage',
    true
  ),
  (
    'a1000000-0000-0000-0000-000000000005',
    'c1000000-0000-0000-0000-000000000004',
    'b1000000-0000-0000-0000-000000000004',
    'Havells Festiva 1200mm Ceiling Fan (Pearl White)',
    'havells-festiva-1200mm-ceiling-fan',
    'FAN-HAV-FEST-1200',
    'Energy-efficient decorative ceiling fan with metallic finish blades and high-air delivery motor.',
    2850.00,
    3450.00,
    25,
    5,
    'Standard ceiling hook mount with downrod included.',
    '2 Years Manufacturer Warranty',
    true
  ),
  (
    'a1000000-0000-0000-0000-000000000006',
    'c1000000-0000-0000-0000-000000000006',
    'b1000000-0000-0000-0000-000000000006',
    'Anchor Roma Modular 6A 1-Way Switch (White, Pack of 10)',
    'anchor-roma-modular-6a-switch-pack-10',
    'ELEC-ANC-SW-6A-10',
    'Durable polycarbonate modular switches with silver contacts for spark-free performance.',
    380.00,
    450.00,
    50,
    10,
    'Compatible with Anchor Roma plates and standard modular base frames.',
    '10 Years Warranty against mechanical fault',
    true
  )
ON CONFLICT (slug) DO NOTHING;
