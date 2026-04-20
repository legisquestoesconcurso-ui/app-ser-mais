import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Corpo recebido:", body); // Isso vai aparecer nos logs da Vercel

    // Captura os dados ou usa valores de teste se vierem vazios
    const emailComprador = body.Customer?.email || 'teste_kiwifi@email.com';
    const idDoProduto = body.product_id || 'produto_teste_123';
    const statusVenda = body.status || 'sem_status';

    // AGORA A MÁGICA: Ele salva se for aprovado OU se for o teste do Kiwifi
    if (statusVenda === 'approved' || statusVenda === 'sem_status' || !body.status) {
      const { error } = await supabase
        .from('user_access')
        .insert([
          { 
            user_id: emailComprador, 
            book_id: idDoProduto.toString() 
          }
        ]);

      if (error) {
        console.error("Erro no Supabase:", error);
        throw error;
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao processar' }, { status: 400 });
  }
}
