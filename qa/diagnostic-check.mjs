import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("Checking Supabase connection...");
  const { data: products, error: pErr } = await supabase.from("products").select("id, name, slug, stock_quantity, price");
  console.log("Products:", { count: products?.length, error: pErr, sample: products?.slice(0, 3) });

  const { data: categories, error: cErr } = await supabase.from("categories").select("id, name, slug");
  console.log("Categories:", { count: categories?.length, error: cErr });

  const { data: brands, error: bErr } = await supabase.from("brands").select("id, name, slug");
  console.log("Brands:", { count: brands?.length, error: bErr });

  const { data: zones, error: zErr } = await supabase.from("delivery_zones").select("pincode, town, delivery_charge");
  console.log("Delivery zones:", { count: zones?.length, error: zErr });

  const { data: profiles, error: prErr } = await supabase.from("profiles").select("id, email, role");
  console.log("Profiles:", { count: profiles?.length, error: prErr, profiles });
}

check().catch(console.error);
