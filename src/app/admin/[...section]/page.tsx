import { CrudPage } from "@/components/admin/crud-page";
import { OrderAdminPage } from "@/components/admin/order-admin-page";

export default async function Page({params}:{params:Promise<{section:string[]}>}) {
  const {section} = await params;
  
  if (section[0] === "orders") {
    return <OrderAdminPage />
  }

  return <CrudPage section={section[0]}/>
} 
