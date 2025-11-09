import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xmnkaawpgulqpcjpudmw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtbmthYXdwZ3VscXBjanB1ZG13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI2NDc0NjMsImV4cCI6MjA3ODIyMzQ2M30.0ZmvKejuqJBYUaXQUB21FRu7Po5Mi4NYFPRbvCqFCCM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: number;
  href: string;
  img_src: string;
  alt: string;
  created_at: string;
};
