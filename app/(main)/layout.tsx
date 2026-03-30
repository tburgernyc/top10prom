import { ToastProvider } from '@/components/ui/Toast'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import Footer from '@/components/layout/Footer'
import { AriaButton } from '@/components/aria/AriaButton'
import FittingRoomWidget from '@/components/layout/FittingRoomWidget'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ToastProvider>
      <Navbar />
      <main className="pb-20 md:pb-0 min-h-screen">
        {children}
      </main>
      <Footer />
      <BottomNav />
      <AriaButton />
      <FittingRoomWidget />
    </ToastProvider>
  )
}
