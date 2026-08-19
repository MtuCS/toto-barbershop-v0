"use client"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCurrency } from "@/lib/format";
import { useDataStore } from "@/store/data-store";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

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

const CHART_FILTERS = [
  { label: '7 ngày', days: 7 },
  { label: '30 ngày', days: 30 },
  { label: '6 tháng', days: 180 },
  { label: 'Năm nay', days: 365 },
] as const

export function DashboardContent() {
  const orders = useDataStore(s => s.orders);
  const customers = useDataStore(s => s.customers);
  const [chartDays, setChartDays] = useState<number>(365)

  const { stats, topProductsList, revenueByMonth } = useMemo(() => {
    const revenue = orders.reduce((acc, o) => acc + o.total, 0);
    const orderCount = orders.length;
    const customerCount = customers.length || new Set(orders.map(o => o.customer?.email)).size;
    const aov = orderCount > 0 ? Math.round(revenue / orderCount) : 0;

    const computedStats = [
      ['Doanh thu', formatCurrency(revenue), 'Toàn thời gian'],
      ['Đơn hàng', String(orderCount), 'Toàn thời gian'],
      ['Khách hàng', String(customerCount), 'Hệ thống'],
      ['Giá trị TB', formatCurrency(aov), 'Trên mỗi đơn']
    ];

    const productSales: Record<string, number> = {};
    orders.forEach(o => {
      o.items?.forEach(i => {
        const name = i.title || 'Unknown';
        productSales[name] = (productSales[name] || 0) + i.quantity;
      });
    });
    
    const computedTop = Object.entries(productSales)
      .map(([name, sold]) => ({ name, sold }))
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    // Filter theo khoảng ngày được chọn + dùng timezone VN
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - chartDays);

    const monthlyRevenue: Record<string, number> = {};
    orders.forEach(o => {
      const d = o.createdAt ? new Date(new Date(o.createdAt).toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })) : new Date();
      if (d < cutoff) return;
      const key = chartDays <= 30
        ? `${d.getDate()}/${d.getMonth() + 1}`  // Theo ngày nếu <= 30 ngày
        : `T${d.getMonth() + 1}/${d.getFullYear().toString().slice(-2)}`;  // Theo tháng nếu > 30 ngày
      monthlyRevenue[key] = (monthlyRevenue[key] || 0) + o.total;
    });

    let computedRevenue = Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue }));
    if (computedRevenue.length === 0) {
      computedRevenue = [{ month: "T1", revenue: 0 }, { month: "T2", revenue: 0 }];
    }

    return { stats: computedStats, topProductsList: computedTop, revenueByMonth: computedRevenue };
  }, [orders, customers, chartDays]);

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Admin dashboard</p>
          <h1 className="mt-2 font-display text-4xl font-bold uppercase">Tổng quan</h1>
        </div>
        <Button onClick={() => window.open(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/stats/export`, '_blank')} className="bg-primary hover:bg-primary/90 text-white rounded-xl h-10 px-4 flex items-center gap-2">
          <Download className="w-4 h-4" />
          Xuất báo cáo (Excel)
        </Button>
      </header>
      
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(x => (
          <div key={x[0]} className="border bg-white p-5">
            <p className="text-sm text-neutral-500">{x[0]}</p>
            <b className="mt-2 block text-2xl">{x[1]}</b>
            <span className="text-xs text-primary">{x[2]}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_1fr]">
        <section className="border bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-semibold">Doanh thu</h2>
            <div className="flex gap-1">
              {CHART_FILTERS.map(f => (
                <button
                  key={f.days}
                  onClick={() => setChartDays(f.days)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${chartDays === f.days ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueByMonth}>
                <defs>
                  <linearGradient id="green" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#13443B" stopOpacity={.45}/>
                    <stop offset="1" stopColor="#13443B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="month" tick={{ fontSize: 11 }}/>
                <YAxis hide/>
                <Tooltip formatter={v => formatCurrency(Number(v))}/>
                <Area dataKey="revenue" stroke="#13443B" fill="url(#green)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        
        <section className="border bg-white p-5">
          <h2 className="font-semibold">Bán chạy</h2>
          <div className="mt-4 space-y-4">
            {topProductsList.length > 0 ? topProductsList.map((p, i) => (
              <div key={p.name} className="flex gap-3 border-b pb-3">
                <b className="text-primary">0{i+1}</b>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-neutral-500">{p.sold} đã bán</p>
                </div>
              </div>
            )) : (
              <p className="text-sm text-neutral-500">Chưa có dữ liệu bán hàng</p>
            )}
          </div>
        </section>
      </div>
      
      <section className="mt-6 border bg-white p-5">
        <h2 className="font-semibold">Đơn hàng gần đây</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-neutral-500">
              <tr>
                <th className="py-3">Mã đơn</th>
                <th>Khách hàng</th>
                <th>Trạng thái</th>
                <th className="text-right">Tổng</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map(o => (
                <tr key={o.id} className="border-t">
                  <td className="py-4 font-medium">{(o as any).orderCode || o.code || `#${o.id}`}</td>
                  <td>{o.customer?.name}</td>
                  <td>
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${STATUS_COLOR[o.status] || 'bg-neutral-100 text-neutral-600'}`}>
                      {STATUS_LABEL[o.status] || o.status}
                    </span>
                  </td>
                  <td className="text-right">{formatCurrency(o.total)}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-neutral-500">Chưa có đơn hàng nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}


