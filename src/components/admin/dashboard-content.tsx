"use client"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from "recharts";
import { formatCurrency } from "@/lib/format";
import { useDataStore } from "@/store/data-store";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, DollarSign, ShoppingBag, Users, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, Minus, ArrowRight, Package } from "lucide-react";
import Link from "next/link";

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Chờ xử lý', PROCESSING: 'Đang chuẩn bị',
  SHIPPED: 'Đang giao', COMPLETED: 'Hoàn thành', CANCELLED: 'Đã hủy',
}
const STATUS_COLOR: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
}
const STATUS_PIE_COLOR: Record<string, string> = {
  PENDING: '#f59e0b',
  PROCESSING: '#3b82f6',
  SHIPPED: '#8b5cf6',
  COMPLETED: '#10b981',
  CANCELLED: '#ef4444',
}

const CHART_FILTERS = [
  { label: '7 ngày qua', days: 7 },
  { label: '30 ngày qua', days: 30 },
  { label: '6 tháng qua', days: 180 },
  { label: 'Năm nay', days: 365 },
] as const

export function DashboardContent() {
  const orders = useDataStore(s => s.orders);
  const customers = useDataStore(s => s.customers);
  const products = useDataStore(s => s.products);
  const [chartDays, setChartDays] = useState<number>(30)

  const { stats, topProductsList, revenueByMonth, pieData, lowStockProducts, totalOrdersCp } = useMemo(() => {
    const now = new Date();
    const cpStart = new Date(now);
    cpStart.setDate(cpStart.getDate() - chartDays);
    const ppStart = new Date(cpStart);
    ppStart.setDate(ppStart.getDate() - chartDays);

    const filterByDate = (dateStr: string, start: Date, end: Date) => {
      const d = dateStr ? new Date(new Date(dateStr).toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })) : new Date();
      return d >= start && d <= end;
    };

    const allCompletedOrders = orders.filter(o => {
      const st = (o.status || '').toUpperCase();
      const ps = (o.paymentStatus || '').toUpperCase();
      return st === 'COMPLETED' || (ps === 'PAID' && st !== 'CANCELLED');
    });

    const cpCompletedOrders = allCompletedOrders.filter(o => filterByDate(o.createdAt, cpStart, now));
    const ppCompletedOrders = allCompletedOrders.filter(o => filterByDate(o.createdAt, ppStart, cpStart));

    const cpOrders = orders.filter(o => filterByDate(o.createdAt, cpStart, now));
    const ppOrders = orders.filter(o => filterByDate(o.createdAt, ppStart, cpStart));

    const cpRevenue = cpCompletedOrders.reduce((acc, o) => acc + o.total, 0);
    const ppRevenue = ppCompletedOrders.reduce((acc, o) => acc + o.total, 0);
    
    const cpOrderCount = cpOrders.length;
    const ppOrderCount = ppOrders.length;

    const cpCustomerCount = new Set(cpOrders.filter(o => o.customer?.email).map(o => o.customer?.email)).size;
    const ppCustomerCount = new Set(ppOrders.filter(o => o.customer?.email).map(o => o.customer?.email)).size;

    const cpCompletedOrderCount = cpCompletedOrders.length;
    const ppCompletedOrderCount = ppCompletedOrders.length;
    const cpAov = cpCompletedOrderCount > 0 ? Math.round(cpRevenue / cpCompletedOrderCount) : 0;
    const ppAov = ppCompletedOrderCount > 0 ? Math.round(ppRevenue / ppCompletedOrderCount) : 0;

    const calcTrend = (cp: number, pp: number) => {
      if (pp === 0) return cp > 0 ? 100 : 0;
      return Math.round(((cp - pp) / pp) * 100);
    };

    const computedStats = [
      { label: 'Doanh thu', value: formatCurrency(cpRevenue), trend: calcTrend(cpRevenue, ppRevenue), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-100' },
      { label: 'Đơn hàng', value: String(cpOrderCount), trend: calcTrend(cpOrderCount, ppOrderCount), icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-100' },
      { label: 'Khách hàng', value: String(cpCustomerCount), trend: calcTrend(cpCustomerCount, ppCustomerCount), icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
      { label: 'Giá trị TB', value: formatCurrency(cpAov), trend: calcTrend(cpAov, ppAov), icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-100' }
    ];

    const productSales: Record<string, { sold: number, image: string | undefined }> = {};
    cpCompletedOrders.forEach(o => {
      o.items?.forEach(i => {
        const name = i.product?.title || i.title || 'Unknown';
        if (!productSales[name]) {
          productSales[name] = { sold: 0, image: i.product?.images?.[0] || i.image };
        }
        productSales[name].sold += i.quantity;
      });
    });
    
    const computedTop = Object.entries(productSales)
      .map(([name, data]) => ({ name, sold: data.sold, image: data.image }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    const orderStatusCount: Record<string, number> = {};
    cpOrders.forEach(o => {
      orderStatusCount[o.status] = (orderStatusCount[o.status] || 0) + 1;
    });
    const computedPie = Object.entries(orderStatusCount).map(([name, value]) => {
      const upperName = name.toUpperCase();
      return {
        name: STATUS_LABEL[upperName] || name,
        value,
        color: STATUS_PIE_COLOR[upperName] || '#ccc'
      }
    });

    const monthlyRevenue: Record<string, number> = {};
    
    if (chartDays <= 30) {
      for (let i = chartDays - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = `${d.getDate()}/${d.getMonth() + 1}`;
        monthlyRevenue[key] = 0;
      }
    } else {
      const monthsCount = chartDays === 180 ? 6 : 12;
      for (let i = monthsCount - 1; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = `T${d.getMonth() + 1}/${d.getFullYear().toString().slice(-2)}`;
        monthlyRevenue[key] = 0;
      }
    }

    cpCompletedOrders.forEach(o => {
      const d = o.createdAt ? new Date(new Date(o.createdAt).toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })) : new Date();
      const key = chartDays <= 30
        ? `${d.getDate()}/${d.getMonth() + 1}`
        : `T${d.getMonth() + 1}/${d.getFullYear().toString().slice(-2)}`;
      
      if (monthlyRevenue[key] !== undefined) {
        monthlyRevenue[key] += o.total;
      }
    });

    const computedRevenue = Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue }));

    const lowStock: { name: string, variant: string, stock: number, id: string, image?: string }[] = [];
    products.forEach(p => {
      if (p.variants && p.variants.length > 0) {
        p.variants.forEach((v: any) => {
          if (v.stock < 5) {
            lowStock.push({ name: p.title, variant: v.name, stock: v.stock, id: p.id as string, image: p.images?.[0] });
          }
        });
      }
    });

    return { 
      stats: computedStats, 
      topProductsList: computedTop, 
      revenueByMonth: computedRevenue,
      pieData: computedPie,
      lowStockProducts: lowStock.sort((a, b) => a.stock - b.stock),
      totalOrdersCp: cpOrderCount
    };
  }, [orders, customers, products, chartDays]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
        <div>
          <h1 className="text-2xl font-bold tracking-tight uppercase font-display flex items-center gap-2">
            <TrendingUp className="size-6 text-primary" /> Tổng quan
          </h1>
          <p className="text-neutral-500 mt-1">Theo dõi hoạt động kinh doanh và thống kê cửa hàng</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex bg-neutral-100 p-1 rounded-lg">
            {CHART_FILTERS.map(f => (
              <button
                key={f.days}
                onClick={() => setChartDays(f.days)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${chartDays === f.days ? 'bg-white text-primary shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <Button onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/stats/export`, '_blank')} className="bg-primary hover:bg-primary/90 text-white rounded-xl h-9 px-4 flex items-center gap-2 text-sm">
            <Download className="w-4 h-4" />
            Xuất Excel
          </Button>
        </div>
      </header>
      
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(x => {
          const Icon = x.icon;
          const isPositive = x.trend > 0;
          const isNegative = x.trend < 0;
          return (
            <div key={x.label} className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100 flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-500 mb-1">{x.label}</p>
                <b className="block text-2xl text-neutral-900 mb-3">{x.value}</b>
                <div className="flex items-center gap-1.5">
                  <span className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded-md ${isPositive ? 'text-emerald-700 bg-emerald-100' : isNegative ? 'text-red-700 bg-red-100' : 'text-neutral-600 bg-neutral-100'}`}>
                    {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : isNegative ? <ArrowDownRight className="w-3 h-3 mr-0.5" /> : <Minus className="w-3 h-3 mr-0.5" />}
                    {Math.abs(x.trend)}%
                  </span>
                  <span className="text-xs text-neutral-400">so với kỳ trước</span>
                </div>
              </div>
              <div className={`size-12 rounded-full flex items-center justify-center ${x.bg} ${x.color} shrink-0`}>
                <Icon className="size-6" />
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex flex-col h-full">
          <div className="flex items-center justify-between gap-3 mb-6">
            <h2 className="text-lg font-bold text-neutral-800">Biểu đồ Doanh thu</h2>
          </div>
          <div className="flex-1 min-h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByMonth}>
                <defs>
                  <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#13443B" stopOpacity={0.4}/>
                    <stop offset="100%" stopColor="#13443B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5"/>
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#737373' }} axisLine={false} tickLine={false} dy={10}/>
                <YAxis hide domain={[0, 'auto']} />
                <Tooltip 
                  formatter={(v: any) => [formatCurrency(Number(v)), 'Doanh thu']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#13443B" strokeWidth={3} fill="url(#primaryGradient)" activeDot={{ r: 6, strokeWidth: 0 }} dot={{ r: 3, fill: '#13443B', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        
        <div className="flex flex-col gap-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex-1">
            <h2 className="text-lg font-bold text-neutral-800 mb-2">Trạng thái Đơn hàng</h2>
            <div className="h-48 relative flex items-center justify-center">
              {pieData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value">
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-neutral-900">{totalOrdersCp}</span>
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Đơn hàng</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-neutral-400">
                  <PieChart className="w-12 h-12 mb-2 text-neutral-200" />
                  <p className="text-sm">Chưa có dữ liệu</p>
                </div>
              )}
            </div>
            {pieData.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {pieData.map((d, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-neutral-600">
                    <div className="size-3 rounded-full shrink-0" style={{ backgroundColor: d.color }}></div>
                    <span className="truncate">{d.name} ({d.value})</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
      
      <div className="grid gap-6 xl:grid-cols-3">
        <section className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-neutral-100 flex items-center gap-2 bg-amber-50/30">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold text-neutral-800">Cảnh báo tồn kho</h2>
          </div>
          <div className="p-2 flex-1 overflow-y-auto max-h-[350px]">
            {lowStockProducts.length > 0 ? (
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-neutral-50">
                  {lowStockProducts.map((p, i) => (
                    <tr key={i} className="hover:bg-neutral-50/50">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-neutral-100 overflow-hidden shrink-0">
                            <img src={p.image || "https://placehold.co/40x40"} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-neutral-900 text-xs truncate">{p.name}</p>
                            <p className="text-[10px] text-neutral-500 truncate">{p.variant}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <span className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs font-bold ${p.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                          {p.stock}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-8 text-neutral-400">
                <Package className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">Tất cả sản phẩm đều đủ hàng</p>
              </div>
            )}
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-800">Sản phẩm Bán chạy</h2>
            <Link href="/admin/products" className="text-xs font-bold text-primary flex items-center hover:underline">
              Xem tất cả <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
          <div className="p-6 flex-1">
            <div className="space-y-5">
              {topProductsList.length > 0 ? topProductsList.map((p, i) => (
                <div key={p.name} className="flex gap-3 items-center group">
                  <div className="size-8 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-500 group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                    {i+1}
                  </div>
                  <div className="w-10 h-10 rounded bg-neutral-100 overflow-hidden shrink-0">
                    <img src={p.image || "https://placehold.co/40x40"} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-neutral-900">{p.name}</p>
                    <p className="text-xs text-neutral-500">{p.sold} đã bán</p>
                  </div>
                </div>
              )) : (
                <div className="flex flex-col items-center justify-center py-8 text-neutral-400">
                  <ShoppingBag className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">Chưa có dữ liệu bán hàng</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden flex flex-col xl:col-span-1 sm:col-span-2">
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-neutral-800">Đơn hàng gần đây</h2>
            <Link href="/admin/orders" className="text-xs font-bold text-primary flex items-center hover:underline">
              Xem tất cả <ArrowRight className="w-3 h-3 ml-1" />
            </Link>
          </div>
          <div className="overflow-x-auto p-2 flex-1">
            <table className="w-full text-left text-sm">
              <thead className="text-neutral-500 text-xs uppercase bg-neutral-50/50">
                <tr>
                  <th className="px-4 py-3 font-semibold rounded-l-lg">Mã đơn</th>
                  <th className="px-4 py-3 font-semibold">Khách hàng</th>
                  <th className="px-4 py-3 font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 font-semibold text-right rounded-r-lg">Tổng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {orders.slice(0, 5).map(o => (
                  <tr key={o.id} className="hover:bg-neutral-50/30">
                    <td className="px-4 py-3 font-bold text-neutral-900">{(o as any).orderCode || o.code || `#${o.id}`}</td>
                    <td className="px-4 py-3 font-medium">{o.customer?.name}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${STATUS_COLOR[o.status.toUpperCase()] || 'bg-neutral-100 text-neutral-600'}`}>
                        {STATUS_LABEL[o.status.toUpperCase()] || o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-primary">{formatCurrency(o.total)}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-neutral-400">
                      <div className="flex flex-col items-center justify-center">
                        <ShoppingBag className="w-8 h-8 mb-2 opacity-50" />
                        <p className="text-sm">Chưa có đơn hàng nào</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
