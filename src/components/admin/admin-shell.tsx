"use client"
import Link from "next/link"; import { usePathname, useRouter } from "next/navigation"; import { LayoutDashboard, Package, Tags, Scissors, GraduationCap, BookOpen, Images, ShoppingBag, Users, UserCog, ImageIcon, Settings, LogOut, Menu } from "lucide-react"; import { useState, useEffect } from "react"; import { useAuthStore } from "@/store/auth-store"
const nav=[['dashboard','Tổng quan',LayoutDashboard],['products','Sản phẩm',Package],['categories','Danh mục',Tags],['services','Dịch vụ',Scissors],['training','Đào tạo',GraduationCap],['merchandise-stories','Stories',BookOpen],['lookbook','Lookbook',Images],['orders','Đơn hàng',ShoppingBag],['customers','Khách hàng',Users],['staff','Nhân viên',UserCog],['media','Media',ImageIcon],['settings','Cài đặt',Settings]] as const
export function AdminShell({children}:{children:React.ReactNode}){
  const path=usePathname(),router=useRouter(),logout=useAuthStore(s=>s.logout),session=useAuthStore(s=>s.session),[open,setOpen]=useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && path !== '/admin/login' && !session) {
      router.push('/admin/login');
    }
  }, [mounted, path, session, router]);

  if (!mounted) return null;
  if (path === '/admin/login') return children;
  if (!session) return null;

  return <div className="min-h-screen bg-neutral-100 text-neutral-950"><button onClick={()=>setOpen(!open)} className="fixed left-4 top-4 z-50 bg-primary p-2 text-white lg:hidden"><Menu/></button><aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-neutral-950 p-5 text-white transition-transform ${open?'translate-x-0':'-translate-x-full'} lg:translate-x-0`}><Link href="/" className="font-display text-3xl font-bold">TOTO<span className="text-emerald-400">.</span></Link><p className="mt-1 text-[10px] uppercase tracking-[.2em] text-white/40">Quản trị viên</p><nav className="mt-8 space-y-1">{nav.map(([slug,label,Icon])=><Link onClick={()=>setOpen(false)} key={slug} href={`/admin/${slug}`} className={`flex items-center gap-3 px-3 py-2.5 text-sm ${path.includes(`/admin/${slug}`)?'bg-primary text-white':'text-white/65 hover:bg-white/10 hover:text-white transition-colors cursor-pointer'}`}><Icon className="size-4"/>{label}</Link>)}</nav><button onClick={()=>{logout();router.push('/admin/login')}} className="absolute bottom-5 left-5 flex w-[calc(100%-40px)] items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer active:scale-95"><LogOut className="size-4 text-red-400"/>Đăng xuất</button></aside><main className="min-h-screen p-5 pt-20 lg:ml-64 lg:p-8">{children}</main></div>
}
