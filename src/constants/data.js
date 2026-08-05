import {
  Radio, Ship, Sprout, ScanEye, Cloud, Boxes, Cpu, Wifi, ShieldCheck,
  Rocket, Users, Trophy, Zap,
} from "lucide-react";

export const STATS = [
  { icon: Rocket, value: "120+", label: "Dự án đã triển khai" },
  { icon: Users, value: "3.500+", label: "Khách hàng doanh nghiệp" },
  { icon: Trophy, value: "48", label: "Bằng sáng chế đã cấp" },
  { icon: Zap, value: "99.98%", label: "Uptime hệ thống" },
];

export const PROJECT_CATEGORIES = ["Sản xuất", "Năng lượng", "Logistics", "Nông nghiệp"];

export const PROJECTS = {
  "Sản xuất": {
    icon: ScanEye, name: "AURIX VISION", tag: "Thị giác máy trong sản xuất",
    desc: "Giám sát dây chuyền lắp ráp linh kiện điện tử theo thời gian thực, phát hiện lỗi ở tốc độ 40 khung hình/giây.",
    metric: "Giảm 32% tỉ lệ lỗi sản phẩm", grad: "var(--g-violet-pink)",
  },
  "Năng lượng": {
    icon: Radio, name: "GRIDSENSE", tag: "Mạng cảm biến lưới điện",
    desc: "Hệ thống cảm biến IoT phân tán cảnh báo sự cố quá tải và rò rỉ điện áp trên lưới trung thế.",
    metric: "Triển khai tại 12 tỉnh thành", grad: "var(--g-cyan-violet)",
  },
  "Logistics": {
    icon: Ship, name: "PORTFLOW", tag: "Tối ưu vận hành cảng biển",
    desc: "Mô hình dự đoán luồng container giúp điều phối cầu cảng và giảm thời gian tàu chờ neo đậu.",
    metric: "Giảm 18% thời gian chờ tàu", grad: "var(--g-amber-pink)",
  },
  "Nông nghiệp": {
    icon: Sprout, name: "AGROPULSE", tag: "Canh tác chính xác",
    desc: "Nền tảng phân tích ảnh vệ tinh kết hợp cảm biến đất, đưa ra khuyến nghị tưới tiêu theo từng lô đất.",
    metric: "4.200 ha canh tác được theo dõi", grad: "var(--g-cyan-amber)",
  },
};

export const TEAM = [
  { name: "Ngô Minh Khôi", role: "Nhà sáng lập & CEO", init: "MK", grad: "var(--g-violet-pink)" },
  { name: "Trần Bảo Anh", role: "Giám đốc Công nghệ", init: "BA", grad: "var(--g-cyan-violet)" },
  { name: "Lê Thu Hà", role: "Trưởng phòng AI Research", init: "TH", grad: "var(--g-amber-pink)" },
  { name: "Phạm Đức Long", role: "Trưởng phòng Phần cứng", init: "DL", grad: "var(--g-cyan-amber)" },
];

export const TRIAL_PRODUCTS = [
  { icon: ScanEye, name: "Aurix Vision SDK", desc: "Bộ công cụ nhận diện lỗi qua camera công nghiệp, tích hợp vào dây chuyền có sẵn trong vài giờ.", perk: "Miễn phí 14 ngày" },
  { icon: Cloud, name: "Aurix Cloud Sandbox", desc: "Môi trường huấn luyện và kiểm thử mô hình AI trên đám mây, không cần GPU riêng.", perk: "5 giờ tính toán / tháng" },
  { icon: Boxes, name: "Aurix Configurator AR", desc: "Dựng cấu hình thiết bị IoT trong thực tế tăng cường trước khi đặt hàng lắp đặt.", perk: "Trải nghiệm trên trình duyệt" },
];

export const SALE_PRODUCTS = [
  { icon: Cpu, name: "Aurix Edge Module X2", desc: "Board điện toán biên hỗ trợ suy luận AI thị giác tại chỗ, không phụ thuộc kết nối cloud.", specs: ["16 TOPS suy luận AI", "4 cổng camera MIPI-CSI", "Chống bụi/nước IP54"], price: "18.900.000₫" },
  { icon: Wifi, name: "Aurix Sensor Hub", desc: "Bộ thu thập dữ liệu cảm biến công nghiệp, kết nối LoRaWAN tầm xa cho môi trường ngoài trời.", specs: ["Tầm phát 8km (line-of-sight)", "Pin dự phòng 6 tháng", "Tối đa 64 node/hub"], price: "6.400.000₫" },
  { icon: ShieldCheck, name: "Aurix Cloud Pro", desc: "Gói dịch vụ đám mây cho giám sát, lưu trữ và cảnh báo tự động trên toàn bộ hệ thống Aurix.", specs: ["Lưu trữ 12 tháng dữ liệu", "SLA uptime 99.9%", "Hỗ trợ kỹ thuật 24/7"], price: "2.900.000₫ / tháng" },
];
