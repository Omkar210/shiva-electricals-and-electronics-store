import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function runConcurrencyTest() {
  console.log("=== QA CONCURRENCY & INVENTORY LOCKING TEST ===");
  const testSku = "CONCURRENCY-TEST-001";
  const testId = "c0000000-0000-0000-0000-000000000099";

  // Create temporary product with initial stock = 5
  await supabase.from("products").delete().eq("sku", testSku);
  const { data: prod, error: cErr } = await supabase.from("products").insert({
    id: testId,
    name: "Concurrency Test Unit",
    slug: "concurrency-test-unit",
    sku: testSku,
    price: 100,
    stock_quantity: 5,
    is_active: true,
  }).select().single();

  if (cErr) {
    console.error("Failed to setup test product:", cErr);
    process.exit(1);
  }

  console.log(`Product created with starting stock = 5 (ID: ${prod.id})`);

  // Launch 10 simultaneous deduction requests for 1 unit each
  const totalRequests = 10;
  console.log(`Launching ${totalRequests} concurrent stock deduction attempts (-1 unit each)...`);

  const results = await Promise.allSettled(
    Array.from({ length: totalRequests }).map(async (_, idx) => {
      const { data, error } = await supabase.rpc("adjust_product_inventory", {
        p_product_id: testId,
        p_quantity_change: -1,
        p_transaction_type: "DAMAGE",
        p_reason: `Concurrent deduction thread #${idx + 1}`,
      });
      if (error) throw error;
      return data;
    })
  );

  const successful = results.filter(r => r.status === "fulfilled");
  const failed = results.filter(r => r.status === "rejected");

  console.log(`Results: ${successful.length} succeeded, ${failed.length} failed`);
  failed.forEach((f, i) => console.log(`  Thread failure ${i+1}: ${f.reason?.message || f.reason}`));

  // Check final stock in DB
  const { data: finalProd } = await supabase.from("products").select("stock_quantity").eq("id", testId).single();
  console.log(`Final stock in DB: ${finalProd.stock_quantity}`);

  const passed = successful.length === 5 && failed.length === 5 && finalProd.stock_quantity === 0;
  console.log(`CONCURRENCY INVENTORY TEST: ${passed ? "PASSED" : "FAILED"}`);

  // Cleanup test product
  await supabase.from("inventory_transactions").delete().eq("product_id", testId);
  await supabase.from("products").delete().eq("id", testId);

  const report = {
    test: "Concurrency & Inventory Locking Test",
    timestamp: new Date().toISOString(),
    startingStock: 5,
    threadsAttempted: totalRequests,
    succeededCount: successful.length,
    failedCount: failed.length,
    finalStock: finalProd.stock_quantity,
    status: passed ? "PASSED" : "FAILED",
    failuresSample: failed.map(f => f.reason?.message)
  };

  fs.writeFileSync("qa/evidence/TEST-CONCURRENCY-01-report.json", JSON.stringify(report, null, 2));
  console.log("Saved evidence to qa/evidence/TEST-CONCURRENCY-01-report.json");
}

runConcurrencyTest().catch(console.error);
