// lib/supabase.ts

// Esta importação é crucial. Ela "preenche" funcionalidades de URL que a biblioteca do Supabase espera
// que existam, mas que não são nativas do ambiente React Native.
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Substitua pelas credenciais do seu projeto Supabase (encontradas nas Configurações -> API).
const supabaseUrl = 'https://jipbwktfmepkdeojvjaw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImppcGJ3a3RmbWVwa2Rlb2p2amF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMTI1MzQsImV4cCI6MjA3OTc4ODUzNH0.700lOIMnqBNPn_jYHMkKMyqWs27G8Crx6qlvb8I1-fg';

// Aqui criamos e exportamos uma instância única (singleton) do cliente Supabase.
// Isso permite que importemos 'supabase' em qualquer parte do nosso app para interagir com o banco.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
