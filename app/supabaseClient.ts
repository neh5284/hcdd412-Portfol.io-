import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mskrcbatvqhechujoqwc.supabase.co'
const supabaseAnonKey = 'sb_publishable_VXdILV9IRjtZfs_GKfCDcw_K94uTdqC'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)