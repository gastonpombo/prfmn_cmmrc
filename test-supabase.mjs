import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase credentials")
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
    console.log("Testing connection to:", supabaseUrl)
    const { data, error } = await supabase.from("products").select("count").limit(1)

    if (error) {
        console.error("Connection failed:", error.message)
        process.exit(1)
    }

    console.log("Connection successful! Data:", data)
}

test()
