// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qenoqqwhoptrjxflzvdl.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlbm9xcXdob3B0cmp4Zmx6dmRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMDgzMzYsImV4cCI6MjA2NzY4NDMzNn0.hFOMER786GRvUK9neJTCrQ4fB2dHWH7cXuD1er6IuZE';

export const supabase = createClient(supabaseUrl, supabaseKey);