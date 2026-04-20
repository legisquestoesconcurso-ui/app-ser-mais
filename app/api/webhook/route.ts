import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Verificamos se o pagamento foi aprovado no Kiwifi
    if (body.status === 'approved') {
      const emailComprador = body.Customer.email;
      const idDoProduto = body.product_id; 

      // Insere na tabela user_access (que você já tem no Supabase)
      const { error } = await supabase
        .from('user_access')
        .insert([
          { 
            user_id: emailComprador, 
            book_id: idDoProduto.toString() 
          }
        ]);

      if (error) throw error;
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Erro ao processar' }, { status: 400 });
  }
}
