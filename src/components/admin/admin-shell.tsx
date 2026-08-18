"use client"
import { LayoutDashboard, Package, Tags, Scissors, GraduationCap, BookOpen, Images, ShoppingBag, Users, UserCog, ImageIcon, Settings, LogOut, Menu, Ticket, X, HelpCircle, MessageSquare } from "lucide-react"; import { useState, useEffect } from "react"; import { useAuthStore } from "@/store/auth-store"; import { usePathname, useRouter } from "next/navigation"; import Link from "next/link"; import { useDataStore } from "@/store/data-store"; import { toast } from "sonner";
const nav=[['dashboard','Tổng quan',LayoutDashboard],['messages','Tin nhắn',MessageSquare],['products','Sản phẩm',Package],['categories','Danh mục',Tags],['services','Dịch vụ',Scissors],['training','Đào tạo',GraduationCap],['merchandise-stories','Stories',BookOpen],['lookbook','Lookbook',Images],['orders','Đơn hàng',ShoppingBag],['customers','Khách hàng',Users],['staff','Nhân viên',UserCog],['media','Media',ImageIcon],['promo-codes','Mã giảm giá',Ticket],['faqs','FAQ',HelpCircle],['settings','Cài đặt',Settings]] as const
export function AdminShell({children}:{children:React.ReactNode}){
  const path=usePathname(),router=useRouter(),logout=useAuthStore(s=>s.logout),session=useAuthStore(s=>s.session),[open,setOpen]=useState(false);
  const [mounted, setMounted] = useState(false);
  const d = useDataStore();
  const unreadCount = d.messages?.filter((m) => m.status === 'unread').length || 0;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    if (session) {
      d.fetchMessages();
    }
  }, [session]);

  useEffect(() => {
    if (mounted && path !== '/admin/login' && !session) {
      router.push('/admin/login');
    }
  }, [mounted, path, session, router]);

  // Show toast notification ONCE when user logs in and there are unread messages
  useEffect(() => {
    if (mounted && session && unreadCount > 0) {
      const shown = sessionStorage.getItem('unreadToastShown');
      if (!shown) {
        toast.info(`Bạn có ${unreadCount} tin nhắn liên hệ chưa đọc!`);
        sessionStorage.setItem('unreadToastShown', 'true');
      }
    }
  }, [mounted, session, unreadCount]);

  if (!mounted) return null;
  if (path === '/admin/login') return children;
  if (!session) return null;

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-950 overflow-x-hidden">
      <button onClick={() => setOpen(!open)} className={`fixed left-4 top-4 z-50 bg-primary p-2 text-white lg:hidden rounded-md shadow-lg transition-opacity duration-200 ${open ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Menu />
      </button>

      {/* Overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity" 
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-neutral-950 p-5 text-white transition-transform ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between">
          <Link href="/" className="font-display text-3xl font-bold">TOTO<span className="text-emerald-400">.</span></Link>
          <button onClick={() => setOpen(false)} className="lg:hidden p-1 text-white/50 hover:text-white transition-colors cursor-pointer">
            <X className="size-5" />
          </button>
        </div>
        <p className="mt-1 text-[10px] uppercase tracking-[.2em] text-white/40">Quản trị viên</p>
        <nav className="mt-8 space-y-1">
          {nav.map(([id, label, Icon]) => {
            const isMessages = id === 'messages';
            return (
              <Link key={id} href={`/admin/${id}`} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${path === `/admin/${id}` ? 'bg-primary font-bold text-white' : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'}`}>
                <Icon className="size-4" />{label}
                {isMessages && unreadCount > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>
        <button 
          onClick={() => { logout(); router.push('/admin/login'); }} 
          className="absolute bottom-5 left-5 flex w-[calc(100%-40px)] items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer active:scale-95"
        >
          <LogOut className="size-4 text-red-400" />Đăng xuất
        </button>
      </aside>

      <main className="min-h-screen p-4 pt-20 lg:ml-64 lg:p-8">
        {children}
      </main>
    </div>
  )
}
