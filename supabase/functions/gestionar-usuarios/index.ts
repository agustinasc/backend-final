import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { accion, username, password, nombre, userId, nuevaPassword } = await req.json()

    if (accion === 'login') {
      const { data: perfil, error } = await supabaseAdmin
        .from('perfiles')
        .select('*')
        .eq('username', username)
        .single()

      if (error || !perfil) throw new Error('Usuario no encontrado')

        const email = `${username}@panaderia.internal`

      return new Response(JSON.stringify({ email }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (accion === 'crear') {
      const email = `${username}@panaderia.internal`
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true
      })

      if (error) throw error

      await supabaseAdmin.from('perfiles').insert({
        id: data.user.id,
        nombre,
        username,
        rol: 'vendedor'
      })

      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (accion === 'cambiar-password') {
      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: nuevaPassword
      })
      if (error) throw error

      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (accion === 'eliminar') {
      await supabaseAdmin.from('perfiles').delete().eq('id', userId)
      const { error } = await supabaseAdmin.auth.admin.deleteUser(userId)
      if (error) throw error

      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    if (accion === 'listar') {
      const { data } = await supabaseAdmin.from('perfiles').select('*').order('nombre')
      return new Response(JSON.stringify({ data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})