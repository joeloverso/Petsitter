import AdminSidebar from '@/components/admin/Sidebar'
import PWASetup from '@/components/PWASetup'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <PWASetup />
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10 overflow-auto">{children}</main>
    </div>
  )
}
