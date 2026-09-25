import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function listUsers() {
  const { data: { users }, error: _error } = await supabase.auth.admin.listUsers();
  console.log("Users:", users?.map(u => ({ id: u.id, email: u.email, confirmed_at: u.confirmed_at })));
  const { data: profiles } = await supabase.from("profiles").select("*");
  console.log("Profiles:", profiles);
}

listUsers().catch(console.error);
