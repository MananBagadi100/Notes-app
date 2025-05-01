// get_notes.js
// get_notes: handles GET /notes to return notes for the authenticated user
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { decode } from "https://deno.land/x/djwt@v2.8/mod.ts";

serve(async (req) => {
  const jwt = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!jwt) {
    return new Response("Unauthorized", { status: 401 });
  }

  const payload = decode(jwt)[1];
  const user_id = payload.sub;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500
    });
  }

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" }
  });
});
