"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { useDataStore } from "@/store/data-store";
import { useCustomerUserStore } from "@/store/customer-user-store";
import { formatCurrency } from "@/lib/format";
import { Button } from "@/components/ui/button"
import { Loader2, MapPin, Tag } from "lucide-react";
import { toast } from "sonner";

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const place = useDataStore((s) => s.placeOrder);
  const { user, token, setUser, setAuthModalOpen, logout } = useCustomerUserStore();
  
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Idempotency key để tránh double-submit
  const [idempotencyKey, setIdempotencyKey] = useState("");
  
  useEffect(() => {
    setIdempotencyKey(crypto.randomUUID());
  }, []);
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    addressId: "default",
  });

  const [provinces, setProvinces] = useState<any[]>([])
  const [districts, setDistricts] = useState<any[]>([])
  const [wards, setWards] = useState<any[]>([])
  
  const [newAddress, setNewAddress] = useState({
    provinceCode: "", provinceName: "",
    districtCode: "", districtName: "",
    wardCode: "", wardName: "",
    street: ""
  })

  // Promo Code State
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoCodeError, setPromoCodeError] = useState("");
  const [validPromoCode, setValidPromoCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [verifyingPromo, setVerifyingPromo] = useState(false);

  const subtotal = items.reduce((n, x) => n + x.price * x.quantity, 0);
  const shipping = subtotal >= 500000 ? 0 : 30000;
  
  // Tổng tiền phải thanh toán
  const total = Math.max(0, subtotal - discountAmount) + shipping;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !user) {
      setAuthModalOpen(true);
      router.push("/");
    }
  }, [user, mounted, router, setAuthModalOpen]);

  useEffect(() => {
    if (user && token && mounted) {
      fetch("/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setUser(data, token);
          
          let defaultAddrId = "new";
          if (data.addresses && data.addresses.length > 0) {
            const def = data.addresses.find((a: any) => a.isDefault);
            defaultAddrId = def ? String(def.id) : String(data.addresses[0].id);
          } else {
            fetchProvinces();
          }
          
          setFormData({
            name: data.name || "",
            phone: data.phone || "",
            addressId: defaultAddrId,
          });
        }
      })
      .finally(() => {
        setLoading(false);
      });
    } else if (mounted && !user) {
      setLoading(false);
    }
  }, [user?.id, token, mounted, setUser]);

  const fetchProvinces = async () => {
    const res = await fetch("https://provinces.open-api.vn/api/p/")
    const data = await res.json()
    setProvinces(data)
  }
  const fetchDistricts = async (pCode: string) => {
    const res = await fetch(`https://provinces.open-api.vn/api/p/${pCode}?depth=2`)
    const data = await res.json()
    setDistricts(data.districts)
  }
  const fetchWards = async (dCode: string) => {
    const res = await fetch(`https://provinces.open-api.vn/api/d/${dCode}?depth=2`)
    const data = await res.json()
    setWards(data.wards)
  }

  const handleApplyPromo = async () => {
    if (!promoCodeInput.trim()) return;
    setVerifyingPromo(true);
    setPromoCodeError("");

    try {
      const res = await fetch("/api/promo/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          code: promoCodeInput.trim(),
          subtotal
        })
      });

      const data = await res.json();
      if (res.ok) {
        setValidPromoCode(data.code);
        setDiscountAmount(data.discount);
      } else {
        setPromoCodeError(data.error || "Mã không hợp lệ.");
        setValidPromoCode(null);
        setDiscountAmount(0);
      }
    } catch (err) {
      setPromoCodeError("Lỗi kết nối khi kiểm tra mã.");
    } finally {
      setVerifyingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setValidPromoCode(null);
    setDiscountAmount(0);
    setPromoCodeInput("");
    setPromoCodeError("");
  };

  if (!mounted || !user) return null;

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  const getAddressText = () => {
    if (formData.addressId === "new") {
      if (!newAddress.provinceCode || !newAddress.districtCode || !newAddress.wardCode || !newAddress.street) return "";
      return `${newAddress.street}, ${newAddress.wardName}, ${newAddress.districtName}, ${newAddress.provinceName}`;
    }
    const addr = user.addresses?.find(a => String(a.id) === formData.addressId);
    if (addr) {
      return `${addr.street}, ${addr.ward}, ${addr.district}, ${addr.province}`;
    }
    return "";
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 md:grid-cols-[1fr_420px] md:px-8">
      <form
        className="grid gap-6"
        onSubmit={async (e) => {
          e.preventDefault();
          if (isSubmitting) return;

          const f = new FormData(e.currentTarget);
          const finalAddress = getAddressText();
          if (!finalAddress.trim()) {
            toast.error("Vui lòng điền đầy đủ địa chỉ giao hàng");
            return;
          }

          setIsSubmitting(true);
          try {
            const res = await fetch("/api/orders/checkout", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
              body: JSON.stringify({
                items: items.map(i => ({
                  productId: i.productId,
                  variantId: i.variantId,
                  quantity: i.quantity,
                  price: i.price
                })),
                total,
                discount: discountAmount,
                promoCode: validPromoCode || undefined,
                idempotencyKey,
                paymentMethod: String(f.get("payment")),
                address: finalAddress,
                note: String(f.get("note")),
              })
            });

            if (!res.ok) {
              const errData = await res.json();
              throw new Error(errData.error || "Có lỗi xảy ra khi tạo đơn hàng.");
            }

            const newOrder = await res.json();

            // payOS: redirect sang trang thanh toán QR
            if (newOrder.checkoutUrl) {
              clear();
              window.location.href = newOrder.checkoutUrl;
              return;
            }

            clear();
            router.push(`/order-success?code=${newOrder.id}`);
          } catch (err: any) {
            const msg = err.message || "Có lỗi xảy ra";
            // Token hết hạn → đăng xuất tự động và mở modal đăng nhập
            if (msg.toLowerCase().includes("invalid or expired token") || msg.toLowerCase().includes("unauthorized")) {
              logout();
              toast.error("Phiên đăng nhập hết hạn", {
                description: "Vui lòng đăng nhập lại để tiếp tục.",
                action: { label: "Đăng nhập", onClick: () => setAuthModalOpen(true) },
                duration: 6000,
              });
            } else {
              toast.error(msg, { duration: 5000 });
            }
          } finally {
            setIsSubmitting(false);
          }
        }}
      >
        <div>
          <h1 className="font-display text-5xl font-bold uppercase">Checkout</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Thanh toán an toàn — xác nhận đơn hàng thành công.
          </p>
        </div>
        
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">1. Thông tin liên hệ</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <input
              required
              name="name"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              placeholder="Họ và tên"
              className="border px-4 py-3 outline-none focus:border-primary rounded-lg"
            />
            <input
              required
              name="phone"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              placeholder="Số điện thoại"
              className="border px-4 py-3 outline-none focus:border-primary rounded-lg"
            />
            <input
              required
              type="email"
              name="email"
              defaultValue={user?.email || ""}
              disabled
              placeholder="Email"
              className="border px-4 py-3 bg-neutral-100 text-neutral-500 cursor-not-allowed rounded-lg sm:col-span-2"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">2. Địa chỉ giao hàng</h3>
          <div className="space-y-3">
            {user.addresses && user.addresses.length > 0 && user.addresses.map(addr => (
              <label 
                key={addr.id} 
                className={`flex items-start gap-3 border p-4 rounded-xl cursor-pointer transition-colors ${formData.addressId === String(addr.id) ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-neutral-400'}`}
              >
                <input 
                  type="radio" 
                  name="addressId" 
                  value={String(addr.id)} 
                  checked={formData.addressId === String(addr.id)} 
                  onChange={e => setFormData({...formData, addressId: e.target.value})} 
                  className="mt-1" 
                />
                <div className="flex-1">
                  <p className="font-semibold flex items-center gap-2">
                    <MapPin className="size-4 text-primary" /> {addr.street}
                  </p>
                  <p className="text-sm text-neutral-600 mt-1.5 ml-6">{addr.ward}, {addr.district}, {addr.province}</p>
                  {addr.isDefault && <span className="inline-block mt-2 ml-6 text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">Mặc định</span>}
                </div>
              </label>
            ))}

            <label 
              className={`flex items-center gap-3 border p-4 rounded-xl cursor-pointer transition-colors ${formData.addressId === "new" ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'hover:border-neutral-400'}`}
            >
              <input 
                type="radio" 
                name="addressId" 
                value="new" 
                checked={formData.addressId === "new"} 
                onChange={e => {
                  setFormData({...formData, addressId: e.target.value});
                  if (provinces.length === 0) fetchProvinces();
                }} 
                className="mt-0.5" 
              />
              <span className="font-medium">+ Giao đến địa chỉ khác</span>
            </label>
          </div>

          {formData.addressId === "new" && (
            <div className="grid gap-3 p-5 border rounded-xl bg-neutral-50 mt-4 animate-in fade-in slide-in-from-top-2">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600">Tỉnh / Thành phố</label>
                  <select 
                    className="w-full h-11 px-3 rounded-md border outline-none bg-white focus:border-primary"
                    value={newAddress.provinceCode}
                    onChange={e => {
                      const name = e.target.options[e.target.selectedIndex].text
                      setNewAddress({...newAddress, provinceCode: e.target.value, provinceName: name, districtCode: "", districtName: "", wardCode: "", wardName: ""})
                      if (e.target.value) fetchDistricts(e.target.value)
                    }}
                  >
                    <option value="">Chọn Tỉnh/Thành</option>
                    {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-600">Quận / Huyện</label>
                  <select 
                    disabled={!newAddress.provinceCode}
                    className="w-full h-11 px-3 rounded-md border outline-none disabled:bg-neutral-100 bg-white focus:border-primary"
                    value={newAddress.districtCode}
                    onChange={e => {
                      const name = e.target.options[e.target.selectedIndex].text
                      setNewAddress({...newAddress, districtCode: e.target.value, districtName: name, wardCode: "", wardName: ""})
                      if (e.target.value) fetchWards(e.target.value)
                    }}
                  >
                    <option value="">Chọn Quận/Huyện</option>
                    {districts.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-neutral-600">Phường / Xã</label>
                  <select 
                    disabled={!newAddress.districtCode}
                    className="w-full h-11 px-3 rounded-md border outline-none disabled:bg-neutral-100 bg-white focus:border-primary"
                    value={newAddress.wardCode}
                    onChange={e => {
                      const name = e.target.options[e.target.selectedIndex].text
                      setNewAddress({...newAddress, wardCode: e.target.value, wardName: name})
                    }}
                  >
                    <option value="">Chọn Phường/Xã</option>
                    {wards.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5 mt-2">
                <label className="text-xs font-semibold text-neutral-600">Số nhà, Tên đường</label>
                <input 
                  placeholder="VD: 123 Đường Lê Lợi"
                  value={newAddress.street}
                  onChange={e => setNewAddress({...newAddress, street: e.target.value})}
                  className="w-full border px-4 py-3 rounded-md outline-none focus:border-primary bg-white"
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">3. Thanh toán & Ghi chú</h3>
          <textarea
            name="note"
            placeholder="Ghi chú thêm cho đơn hàng (không bắt buộc)"
            className="min-h-24 w-full border px-4 py-3 outline-none focus:border-primary rounded-lg"
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="flex items-center gap-3 border p-4 rounded-xl cursor-pointer hover:bg-neutral-50 hover:border-primary transition-colors">
              <input defaultChecked type="radio" name="payment" value="cod" className="size-4 text-primary" /> 
              <span className="font-medium">Thanh toán khi nhận hàng (COD)</span>
            </label>
            <label className="flex items-center gap-3 border-2 border-primary/30 bg-primary/5 p-4 rounded-xl cursor-pointer hover:border-primary transition-colors">
              <input type="radio" name="payment" value="payos" className="size-4 text-primary" />
              <span className="flex flex-col">
                <span className="font-bold text-primary">Chuyển khoản / VietQR</span>
                <span className="text-xs text-muted-foreground mt-0.5">Quét mã QR qua app ngân hàng</span>
              </span>
            </label>
          </div>
        </div>
        
        <Button type="submit" disabled={!items.length || isSubmitting} className="h-14 text-base uppercase mt-4 rounded-xl shadow-lg hover:shadow-xl transition-all">
          {isSubmitting ? 'Đang xử lý...' : `Xác nhận đặt hàng — ${formatCurrency(total)}`}
        </Button>
      </form>
      
      <aside className="h-fit bg-white border rounded-2xl p-6 shadow-sm sticky top-24">
        <h2 className="font-display text-2xl font-bold uppercase mb-6">Đơn hàng của bạn</h2>
        {items.length === 0 ? (
          <p className="text-muted-foreground text-center py-10">Giỏ hàng đang trống.</p>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4 max-h-[300px] overflow-y-auto overflow-x-hidden p-2 -m-2">
              {items.map((x) => (
                <div key={x.variantId} className="flex gap-4">
                  <div className="relative size-20 shrink-0">
                    <Image src={x.image} alt="" fill className="object-cover rounded-md border" />
                    <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white z-10 shadow-sm ring-2 ring-white">
                      {x.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <b className="text-sm truncate block" title={x.title}>{x.title}</b>
                    <p className="text-xs text-muted-foreground mt-1">
                      {x.variantName}
                    </p>
                    <span className="text-sm font-semibold mt-1 block">
                      {formatCurrency(x.price * x.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-5">
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <Tag className="size-4" /> Mã khuyến mãi
              </h3>
              
              {!validPromoCode ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Nhập mã (VD: WELCOME10)" 
                      value={promoCodeInput}
                      onChange={e => setPromoCodeInput(e.target.value.toUpperCase())}
                      className="flex-1 border px-3 py-2 rounded-lg outline-none focus:border-primary text-sm uppercase"
                    />
                    <Button 
                      type="button" 
                      onClick={handleApplyPromo}
                      disabled={verifyingPromo || !promoCodeInput.trim()}
                      className="px-4"
                    >
                      {verifyingPromo ? <Loader2 className="size-4 animate-spin" /> : "Áp dụng"}
                    </Button>
                  </div>
                  {promoCodeError && <p className="text-xs text-red-500 font-medium">{promoCodeError}</p>}
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                  <div className="flex items-center gap-2">
                    <Tag className="size-4" />
                    <span className="font-bold text-sm">{validPromoCode}</span>
                  </div>
                  <button type="button" onClick={handleRemovePromo} className="text-xs font-medium hover:underline">
                    Bỏ mã
                  </button>
                </div>
              )}
            </div>

            <div className="border-t pt-5 space-y-3">
              <p className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tạm tính</span>
                <b className="font-semibold">{formatCurrency(subtotal)}</b>
              </p>
              {discountAmount > 0 && (
                <p className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Khuyến mãi</span>
                  <b className="font-semibold text-emerald-600">-{formatCurrency(discountAmount)}</b>
                </p>
              )}
              <p className="flex justify-between text-sm">
                <span className="text-muted-foreground">Phí vận chuyển</span>
                <b className="font-semibold">{shipping ? formatCurrency(shipping) : "Miễn phí"}</b>
              </p>
              <div className="pt-3 border-t mt-3 flex justify-between items-center">
                <span className="font-medium text-lg">Tổng cộng</span>
                <b className="text-2xl text-primary font-bold">{formatCurrency(total)}</b>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
