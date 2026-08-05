import {
  Code2, LayoutTemplate, MonitorSmartphone, PenTool, Smartphone,
  Users, Wrench, Zap,
} from "lucide-react";

export const STATS = [
  { icon: Code2, value: "50+", label: "Sản phẩm số đã triển khai" },
  { icon: Users, value: "30+", label: "Khách hàng và đối tác" },
  { icon: Wrench, value: "15+", label: "Dự án thiết kế kỹ thuật" },
  { icon: Zap, value: "Nhanh", label: "Quy trình làm việc linh hoạt" },
];

export const TEAM = [
  { name: "Phạm Minh Hiếu", role: "Đồng sáng lập & Product Lead", init: "MK", grad: "var(--g-violet-pink)" },
  { name: "Phạm Văn Bình", role: "Kỹ sư phần mềm", init: "BA", grad: "var(--g-cyan-violet)" },
  { name: "Lê Thu Hà", role: "UI/UX Designer", init: "TH", grad: "var(--g-amber-pink)" },
  { name: "Phạm Minh Hiệp", role: "Kỹ sư thiết kế cơ khí", init: "DL", grad: "var(--g-cyan-amber)" },
];

export const TRIAL_PRODUCTS = [
  { icon: Smartphone, name: "Phát triển ứng dụng di động", desc: "Thiết kế và lập trình ứng dụng iOS, Android hoặc đa nền tảng theo quy trình rõ ràng, dễ mở rộng.", perk: "Tư vấn giải pháp miễn phí" },
  { icon: MonitorSmartphone, name: "Web app & hệ thống nội bộ", desc: "Xây dựng dashboard, hệ thống quản lý và web app phù hợp đúng quy trình vận hành của doanh nghiệp.", perk: "Khảo sát yêu cầu ban đầu" },
  { icon: LayoutTemplate, name: "Landing page chuyển đổi", desc: "Thiết kế landing page nhanh, chuẩn responsive và tối ưu cho chiến dịch quảng cáo hoặc ra mắt sản phẩm.", perk: "Báo giá theo mục tiêu" },
];

export const SALE_PRODUCTS = [
  { icon: Code2, name: "Dự án freelance theo yêu cầu", desc: "Nhận triển khai tính năng, tích hợp API, tối ưu giao diện hoặc hoàn thiện sản phẩm đang dang dở.", specs: ["Phạm vi và mốc bàn giao rõ ràng", "Cập nhật tiến độ thường xuyên", "Bàn giao mã nguồn đầy đủ"], price: "Liên hệ báo giá" },
  { icon: PenTool, name: "Thiết kế bản vẽ chế tạo máy", desc: "Triển khai bản vẽ 2D/3D, cụm máy và đồ gá phục vụ gia công, lắp ráp và sản xuất.", specs: ["Bản vẽ kỹ thuật chi tiết", "File theo chuẩn sản xuất", "Hỗ trợ rà soát khả năng chế tạo"], price: "Liên hệ báo giá" },
  { icon: Wrench, name: "Tư vấn giải pháp kỹ thuật", desc: "Kết nối tư duy phần mềm với kỹ thuật chế tạo để biến ý tưởng thành quy trình và sản phẩm có thể vận hành.", specs: ["Phân tích yêu cầu", "Đề xuất phương án", "Đồng hành triển khai"], price: "Theo phạm vi dự án" },
];
