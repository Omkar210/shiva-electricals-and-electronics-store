import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function setup() {
  const users = [
    { email: "qa_admin@test.local", password: "Password123!", role: "admin", name: "QA Admin User", phone: "9876543210" },
    { email: "qa_staff@test.local", password: "Password123!", role: "staff", name: "QA Staff User", phone: "9876543211" },
    { email: "qa_customer@test.local", password: "Password123!", role: "customer", name: "QA Customer User", phone: "9876543212" },
  ];

  for (const u of users) {
    console.log(`Setting up user ${u.email}...`);
    // Delete existing if any
    const { data: { users: existing } } = await supabase.auth.admin.listUsers();
    const found = existing.find(e => e.email === u.email);
    if (found) {
      await supabase.auth.admin.deleteUser(found.id);
    }

    const { data: created, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
      user_metadata: { full_name: u.name, phone: u.phone },
    });

    if (error) {
      console.error(`Failed to create ${u.email}:`, error);
      continue;
    }

    // Set role in profiles
    const { error: pErr } = await supabase.from("profiles").upsert({
      id: created.user.id,
      full_name: u.name,
      phone: u.phone,
      role: u.role,
    });

    if (pErr) console.error(`Error setting role for ${u.email}:`, pErr);
    else console.log(`User ${u.email} created with role ${u.role}!`);
  }
}

setup().catch(console.error);
