"use client"
import { LayoutDashboard, Package, Tags, Scissors, GraduationCap, BookOpen, Images, ShoppingBag, Users, UserCog, ImageIcon, Settings, LogOut, Menu, Ticket, X, HelpCircle, MessageSquare, BookOpenCheck, Dices } from "lucide-react"; import { useState, useEffect } from "react"; import { useAuthStore } from "@/store/auth-store"; import { usePathname, useRouter } from "next/navigation"; import Link from "next/link"; import { useDataStore } from "@/store/data-store"; import { toast } from "sonner";
const navGroups = [
  {
    title: 'Hệ thống',
    items: [
      ['dashboard', 'Tổng quan', LayoutDashboard],
      ['messages', 'Tin nhắn', MessageSquare]
    ]
  },
  {
    title: 'Kinh doanh',
    items: [
      ['orders', 'Đơn hàng', ShoppingBag],
      ['customers', 'Khách hàng', Users],
      ['promo-codes', 'Mã giảm giá', Ticket],
      ['lucky-wheel', 'Vòng quay', Dices],
    ]
  },
  {
    title: 'Sản phẩm & Dịch vụ',
    items: [
      ['products', 'Sản phẩm', Package],
      ['categories', 'Danh mục', Tags],
      ['services', 'Dịch vụ', Scissors],
      ['training', 'Đào tạo', GraduationCap],
    ]
  },
  {
    title: 'Nội dung (CMS)',
    items: [
      ['merchandise-stories', 'Stories', BookOpen],
      ['lookbook', 'Lookbook', Images],
      ['media', 'Media', ImageIcon],
      ['faqs', 'FAQ', HelpCircle],
    ]
  },
  {
    title: 'Quản trị',
    items: [
      ['staff', 'Nhân viên', UserCog],
      ['settings', 'Cài đặt', Settings],
      ['guide', 'Hướng dẫn', BookOpenCheck],
    ]
  }
] as const;

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

      <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col w-64 bg-neutral-950 text-white transition-transform ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6 pb-4 shrink-0">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-display text-3xl font-bold">TOTO<span className="text-emerald-400">.</span></Link>
            <button onClick={() => setOpen(false)} className="lg:hidden p-1 text-white/50 hover:text-white transition-colors cursor-pointer">
              <X className="size-5" />
            </button>
          </div>
          <p className="mt-1 text-[10px] uppercase tracking-[.2em] text-white/40 font-semibold">Quản trị viên</p>
        </div>
        
        <div className="flex-1 overflow-y-auto px-4 pb-20 scrollbar-none space-y-6 mt-2">
          {navGroups.map(group => (
            <div key={group.title}>
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">{group.title}</h3>
              <nav className="space-y-1">
                {group.items.map(([id, label, Icon]) => {
                  const isMessages = id === 'messages';
                  const isActive = path === `/admin/${id}`;
                  return (
                    <Link key={id} href={`/admin/${id}`} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${isActive ? 'bg-primary/20 text-emerald-400 font-bold border-l-2 border-emerald-400' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}>
                      <Icon className="size-[18px]" />{label}
                      {isMessages && unreadCount > 0 && (
                        <span className="ml-auto inline-flex items-center justify-center rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                  )
                })}
              </nav>
            </div>
          ))}
        </div>
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
