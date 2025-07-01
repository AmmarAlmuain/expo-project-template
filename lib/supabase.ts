import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fikjcnhmzdxrvxzeufeg.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpa2pjbmhtemR4cnZ4emV1ZmVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwOTg4NTUsImV4cCI6MjA2NjY3NDg1NX0.f-InzZR1PBan87eOYoQhqACSOqfu3pEbUYD9GjlNb90";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export async function sendPhoneOtp(phone: string): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({
    phone,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function verifyPhoneOtp(
  phone: string,
  token: string
): Promise<void> {
  const {
    data: { session },
    error,
  } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: "sms",
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!session) {
    throw new Error("OTP verification failed. Please try again.");
  }
}
