# Supabase Notes API - Mini Project

This project implements a simple notes service backend using Supabase Edge Functions. It features user-authenticated note creation and retrieval via RESTful API endpoints.

---

## ✨ Features
- User sign-up and login (via Supabase Auth)
- JWT-protected API endpoints
- Custom Edge Functions for POST and GET `/notes`
- Notes linked to the authenticated user's ID securely

---

## 📄 Schema Design (`schema.sql`)
```sql
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT DEFAULT 'Normal',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW()
);
```

### ✅ Why this schema?
- `id`: Universally unique per note (ensures future-proofing).
- `user_id`: Foreign key to associate notes with the user securely.
- `priority`/`status`: Useful defaults for organizing/filtering notes.
- `created_at`: Tracks when the note was made.

---

## 🚀 Setup & Deployment

### Prerequisites
- A Supabase project
- Edge Functions enabled

### Required Secrets
Go to **Edge Functions > Secrets** in Supabase dashboard and add:
- `SUPABASE_URL`: Your project URL
- `SUPABASE_ANON_KEY`: Public anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for server-side fetches

### Folder Structure
```
functions/
  post_notes.js
  get_notes.js
schema.sql
README.md
```

### Deploy Edge Functions
Use Supabase CLI (optional, if local):
```sh
supabase functions deploy post_notes
supabase functions deploy get_notes
```
Or use the dashboard editor to deploy each function.

---

## 📃 Edge Function: `post_notes.js`
Handles inserting a new note.

```js
// POST /notes: Accepts JSON body to insert a new note
```
### Why POST?
- It modifies data.
- The note info comes in the request body.

---

## 📃 Edge Function: `get_notes.js`
Fetches all notes for the authenticated user.

```js
// GET /notes: Reads notes tied to the authenticated user_id
```
### Why GET?
- It fetches only data.
- No input body required; JWT carries the user context.

---

## ⚖️ Demo: curl Commands

### ✍️ 1. Create a New User
```bash
curl -X POST 'https://gdyhbuyhxs...supabase.co/auth/v1/signup' \
  -H "Content-Type: application/json" \
  -H "apikey: YOUR_ANON_KEY" \
  -d '{
    "email": "user1@example.com",
    "password": "ValidPass123!"
  }'
```

### ⛓️ 2. Log In & Get Access Token
```bash
curl -X POST 'https://gdyhbuyhxs...supabase.co/auth/v1/token?grant_type=password' \
  -H "Content-Type: application/json" \
  -H "apikey: YOUR_ANON_KEY" \
  -d '{
    "email": "user1@example.com",
    "password": "ValidPass123!"
  }'
```
> Copy the `access_token` from this response.

---

### ✏️ 3. Create a Note
```bash
curl -X POST https://gdyhbuyhxs...supabase.co/functions/v1/post_notes \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Secure Note",
    "content": "This is confidential.",
    "priority": "High"
  }'
```
**Expected Output:**
```json
{
  "success": true
}
```

---

### 🔍 4. Fetch All Notes
```bash
curl -X GET https://gdyhbuyhxs...supabase.co/functions/v1/get_notes \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```
**Expected Output:**
```json
[
  {
    "id": "...",
    "user_id": "...",
    "title": "My Secure Note",
    "content": "This is confidential.",
    "priority": "High",
    "status": "active",
    "created_at": "2025-05-01T..."
  }
]
```

---

## ⚠️ Note on Expiring Tokens
The JWT tokens expire after 60 minutes. These examples use static tokens for demonstration only. In a real frontend, you'd use Supabase Auth Client to auto-refresh tokens securely.

