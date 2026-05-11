import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://nbvvzaausrqrqhtuptqi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5idnZ6YWF1c3JxcnFodHVwdHFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNjI4OTQsImV4cCI6MjA5MTczODg5NH0.oLkIV4-vyx3cc8xZWljW-r7iwnNsdmfTauwLjg4Sqk4'

export const supabase = createClient(supabaseUrl, supabaseKey)