// /app/api/auth/[...nextauth].js
import { supabase } from '../../utils/supabase';

export default async function handler(req, res) {
	supabase.auth.api.setAuthCookie(req, res);
}
