INSERT INTO team_members (name, title, bio, profile_intro, skills, experience, featured_projects, articles, sort_order, status)
SELECT
  'Phạm Văn Bình',
  'Kỹ sư phần mềm',
  'Xây dựng sản phẩm số có nền tảng kỹ thuật vững chắc.',
  'Tập trung vào kiến trúc web, trải nghiệm vận hành và các giải pháp có thể mở rộng cho doanh nghiệp.',
  '["React","Node.js","Cloudflare","SQL"]',
  '["2023–nay · Kỹ sư phần mềm tại BThander","2021–2023 · Phát triển web application"]',
  '["Hệ thống quản trị nội bộ","Landing page chuyển đổi"]',
  '["Tối ưu hiệu năng web từ những phần nhỏ nhất","Cách tổ chức một dự án React dễ mở rộng"]',
  1,
  'active'
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Phạm Văn Bình');

INSERT INTO team_members (name, title, bio, profile_intro, skills, experience, featured_projects, articles, sort_order, status)
SELECT
  'Lê Thu Hà',
  'UI/UX Designer',
  'Thiết kế trải nghiệm sản phẩm rõ ràng, dễ dùng và nhất quán.',
  'Tin rằng thiết kế tốt bắt đầu từ việc thấu hiểu người dùng, sau đó chuyển nhu cầu thành hành trình đơn giản và có cảm xúc.',
  '["Figma","UI Design","UX Research","Design System"]',
  '["2022–nay · UI/UX Designer tại BThander","2020–2022 · Thiết kế sản phẩm số"]',
  '["Thiết kế dashboard vận hành","Design system cho nền tảng web"]',
  '["Thiết kế giao diện bắt đầu từ câu hỏi nào?","Làm sao để một design system thực sự được dùng?"]',
  2,
  'active'
WHERE NOT EXISTS (SELECT 1 FROM team_members WHERE name = 'Lê Thu Hà');
