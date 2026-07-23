import { AdminShell } from "@/components/admin/admin-shell";
import { DataFetcher } from "@/components/website/data-fetcher";

export default function Layout({children}:{children:React.ReactNode}){
  return (
    <>
      <DataFetcher />
      <AdminShell>{children}</AdminShell>
    </>
  )
}
