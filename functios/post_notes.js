// post_notes.js
// post_notes: handles POST /notes to insert a new note
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decode } from "https://deno.land/x/djwt@v2.8/mod.ts";

serve(async (req) => {
  const authHeader = req.headers.get("Authorization") ?? "";
  const jwt = authHeader.replace("Bearer ", "");
  if (!jwt) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Decode JWT to extract user ID (sub = Supabase UID)
  const payload = decode(jwt)[1];
  const user_id = payload.sub;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const { title, content, status, priority } = await req.json();

  const { error } = await supabase.from("notes").insert({
    user_id,
    title,
    content,
    status,
    priority
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" }
  });
});
