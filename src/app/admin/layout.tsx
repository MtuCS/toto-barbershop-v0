import { AdminShell } from "@/components/admin/admin-shell";
import { DataFetcher } from "@/components/website/data-fetcher";
import { AdminDataFetcher } from "@/components/admin/admin-data-fetcher";

export default function Layout({children}:{children:React.ReactNode}){
  return (
    <div className="relative w-full max-w-[100vw] overflow-x-hidden">
      <DataFetcher />
      <AdminDataFetcher />
      <AdminShell>{children}</AdminShell>
    </div>
  )
}
