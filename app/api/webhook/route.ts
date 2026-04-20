import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Verificamos o status real enviado pelo Kiwifi
    const statusVenda = body.status;
    const emailComprador = body.Customer?.email;
    const idDoProduto = body.product_id;

    // FILTRO PROFISSIONAL: 
    // Só entra no banco de dados se o status for exatamente 'approved'
    // E se houver um e-mail válido.
    if (statusVenda === 'approved' && emailComprador) {
      const { error } = await supabase
        .from('user_access')
        .insert([
          { 
            user_id: emailComprador, 
            book_id: idDoProduto ? idDoProduto.toString() : 'produto_principal' 
          }
        ]);

      if (error) {
        console.error("Erro ao inserir no Supabase:", error);
        throw error;
      }
    }

    // Retornamos 200 (OK) para o Kiwifi entender que o sinal chegou, 
    // mesmo que o status não seja 'approved' (evita que o Kiwifi fique tentando reenviar)
    return NextResponse.json({ ok: true }, { status: 200 });
    
  } catch (err) {
    console.error("Erro interno no Webhook:", err);
    return NextResponse.json({ error: 'Erro ao processar' }, { status: 400 });
  }
}
