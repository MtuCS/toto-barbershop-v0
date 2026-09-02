"use client"
import { useState } from "react"
import { LayoutDashboard, Package, Scissors, GraduationCap, ShoppingBag, Users, ImageIcon, Settings, Ticket, HelpCircle, MessageSquare, ChevronDown, ChevronRight, BookOpenCheck } from "lucide-react"

const SECTIONS = [
  {
    icon: LayoutDashboard, title: "Tổng quan (Dashboard)", color: "text-emerald-600",
    desc: "Xem thống kê nhanh về doanh thu, đơn hàng, khách hàng.",
    steps: [
      "Nhấn 'Tổng quan' trong menu để vào Dashboard.",
      "Chọn khoảng thời gian (7 ngày / 30 ngày / 6 tháng / Năm nay) để lọc biểu đồ doanh thu.",
      "Nhấn 'Xuất báo cáo (Excel)' để tải file báo cáo chi tiết.",
      "Bảng 'Đơn hàng gần đây' hiển thị 5 đơn mới nhất.",
    ],
    tip: "Biểu đồ doanh thu và các thẻ thống kê đều lọc theo khoảng thời gian bạn chọn. File Excel xuất báo cáo sẽ chứa toàn bộ đơn hàng (có tô màu để phân biệt đơn hủy / hoàn tiền).",
  },
  {
    icon: ShoppingBag, title: "Quản lý Đơn hàng", color: "text-blue-600",
    desc: "Theo dõi và xử lý các đơn hàng từ khách hàng.",
    steps: [
      "Tìm kiếm theo Mã đơn (TTB-...), Tên KH hoặc Số điện thoại.",
      "Dùng dropdown 'Trạng thái' để lọc: Chờ xử lý / Đang chuẩn bị / Đang giao / Hoàn thành / Đã hủy.",
      "Dùng bộ chọn ngày 'Từ / Đến' để lọc theo khoảng thời gian.",
      "Hover vào dòng đơn hàng → nhấn 'Xem chi tiết' để mở modal.",
      "Trong modal: chuyển trạng thái giao hàng và thanh toán bằng các nút.",
    ],
    tip: "Mã đơn dạng TTB-YYMMDD-XXXX. Đơn cũ trước khi cập nhật sẽ hiển thị dạng TOTO-DH0001.",
  },
  {
    icon: Package, title: "Sản phẩm & Danh mục", color: "text-orange-600",
    desc: "Quản lý sản phẩm bán lẻ và danh mục phân loại.",
    steps: [
      "Nhấn 'Thêm mới' → chọn Loại sản phẩm → hệ thống tự tạo biến thể.",
      "Tick chọn Size/Màu sắc để tạo tổ hợp biến thể tự động.",
      "Nhập Giá và Tồn kho cho từng biến thể trong bảng phía dưới.",
      "Nhấn 'Lưu sản phẩm' sau khi hoàn thành.",
    ],
    tip: "SKU tự động tạo nếu để trống. Tạo danh mục cha trước khi tạo danh mục con.",
  },
  {
    icon: Scissors, title: "Dịch vụ", color: "text-purple-600",
    desc: "Quản lý các dịch vụ cắt tóc, chăm sóc tại salon.",
    steps: [
      "Nhấn 'Thêm mới' → điền Tên, Danh mục, Giá, Thời gian, Mô tả.",
      "Phần 'Quy trình dịch vụ': Nhấn '+' để thêm từng bước.",
      "Sửa hoặc xóa từng bước bằng nút '×' bên phải.",
      "Nhấn 'Lưu lại' để cập nhật.",
    ],
    tip: "Quy trình hiển thị theo thứ tự cho khách hàng trên trang dịch vụ.",
  },
  {
    icon: GraduationCap, title: "Đào tạo (Khóa học)", color: "text-amber-600",
    desc: "Quản lý các khóa học, lớp đào tạo nghề.",
    steps: [
      "Nhấn 'Thêm mới' → điền Tiêu đề, Giá, Thời gian, Ngày khai giảng.",
      "Nhấn 'Lưu lại' sau khi hoàn thành.",
    ],
    tip: "Học viên đăng ký qua website sẽ gửi tin nhắn vào mục 'Tin nhắn liên hệ'.",
  },
  {
    icon: Ticket, title: "Mã giảm giá", color: "text-rose-600",
    desc: "Tạo và quản lý các chương trình khuyến mãi.",
    steps: [
      "Nhấn 'Thêm mới' để tạo mã.",
      "Chọn Loại giảm giá: Phần trăm (%) hoặc Số tiền cố định (VNĐ).",
      "Nhập Giá trị giảm, Đơn tối thiểu, Giảm tối đa (không bắt buộc).",
      "Đặt Ngày hết hạn nếu cần — bỏ trống = không giới hạn.",
      "Bật/tắt mã bằng 'Trạng thái kích hoạt'.",
    ],
    tip: "Mã phân biệt HOA/thường. Khuyến nghị dùng chữ HOA (VD: SUMMER20).",
  },
  {
    icon: HelpCircle, title: "FAQ", color: "text-teal-600",
    desc: "Quản lý câu hỏi thường gặp hiển thị trên website.",
    steps: [
      "Nhấn 'Thêm mới' → điền Câu hỏi, Câu trả lời, Danh mục.",
      "Dùng trường 'Thứ tự' để sắp xếp (số nhỏ = hiển thị trước).",
    ],
  },
  {
    icon: MessageSquare, title: "Tin nhắn liên hệ", color: "text-indigo-600",
    desc: "Xem và xử lý tin nhắn từ khách hàng.",
    steps: [
      "Tin nhắn chưa đọc: chấm đỏ + chữ đậm.",
      "Nhấn biểu tượng mắt để xem nội dung chi tiết.",
      "Nhấn 'Đánh dấu đã đọc' sau khi xử lý.",
    ],
    tip: "Số tin nhắn chưa đọc hiển thị badge đỏ trên menu sidebar.",
  },
  {
    icon: Users, title: "Khách hàng & Nhân viên", color: "text-neutral-600",
    desc: "Xem danh sách tài khoản người dùng.",
    steps: [
      "'Khách hàng': Tài khoản mua hàng (role CUSTOMER).",
      "'Nhân viên': Tài khoản Admin — nhấn 'Thêm mới' để tạo.",
    ],
    tip: "Tài khoản ADMIN không đăng nhập được trang mua hàng — cần tạo tài khoản riêng để mua.",
  },
  {
    icon: ImageIcon, title: "Thư viện Media", color: "text-neutral-400",
    desc: "Xem danh sách ảnh đã tải lên. Upload ảnh trực tiếp trong form từng mục.",
    steps: [
      "Ảnh tự lưu khi upload qua form Sản phẩm / Dịch vụ / Lookbook.",
      "Có thể xóa ảnh không còn sử dụng trong danh sách.",
    ],
  },
  {
    icon: Settings, title: "Cài đặt", color: "text-neutral-600",
    desc: "Cập nhật thông tin doanh nghiệp, liên hệ, mạng xã hội.",
    steps: [
      "Điền thông tin Tên, Email, SĐT, Địa chỉ.",
      "Thêm link Facebook, Instagram, TikTok.",
      "Nhấn 'Lưu thay đổi'.",
    ],
  },
]

function GuideSection({ section }: { section: typeof SECTIONS[0] }) {
  const [open, setOpen] = useState(false)
  const Icon = section.icon
  return (
    <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-4 p-5 text-left hover:bg-neutral-50 transition-colors">
        <div className={`p-2.5 rounded-lg bg-neutral-100 ${section.color}`}><Icon className="size-5" /></div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-neutral-900">{section.title}</p>
          <p className="text-sm text-neutral-500 mt-0.5 line-clamp-1">{section.desc}</p>
        </div>
        {open ? <ChevronDown className="size-4 text-neutral-400 shrink-0" /> : <ChevronRight className="size-4 text-neutral-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-neutral-100 bg-neutral-50/50">
          <ol className="mt-4 space-y-2.5">
            {section.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-neutral-700">
                <span className="shrink-0 flex size-5 items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold mt-0.5">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          {section.tip && (
            <div className="mt-4 flex gap-2 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
              <span className="shrink-0">💡</span><span>{section.tip}</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function GuidePage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex items-start gap-4">
        <div className="p-3 bg-primary/10 rounded-xl"><BookOpenCheck className="size-7 text-primary" /></div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">Admin</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight uppercase font-display">Hướng dẫn Sử dụng</h1>
          <p className="mt-1 text-neutral-500 text-sm">Nhấn vào từng mục để xem hướng dẫn chi tiết về cách sử dụng.</p>
        </div>
      </div>
      <div className="space-y-2.5">
        {SECTIONS.map((s) => <GuideSection key={s.title} section={s} />)}
      </div>
      <div className="bg-neutral-900 text-white p-6 rounded-2xl">
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">Cần hỗ trợ thêm?</p>
        <h2 className="mt-2 text-lg font-bold">Liên hệ Developer</h2>
        <p className="mt-1 text-sm text-neutral-400">Nếu gặp lỗi hoặc cần thêm tính năng, hãy liên hệ qua hệ thống quản lý dự án.</p>
      </div>
    </div>
  )
}
