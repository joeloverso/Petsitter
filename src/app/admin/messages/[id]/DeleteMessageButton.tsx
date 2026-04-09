'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function DeleteMessageButton({ id }: { id: string }) {
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete() {
    if (!confirm('Delete this message? This cannot be undone.')) return
    await supabase.from('messages').delete().eq('id', id)
    router.push('/admin/messages')
  }

  return (
    <button
      onClick={handleDelete}
      className="text-xs text-gray-400 hover:text-coral transition-colors font-semibold px-3 py-1.5 rounded-lg hover:bg-coral/10"
    >
      Delete
    </button>
  )
}
