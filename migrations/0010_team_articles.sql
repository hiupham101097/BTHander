CREATE TABLE IF NOT EXISTS team_articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  team_member_id INTEGER NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK(status IN ('draft', 'published')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_team_articles_member_status ON team_articles(team_member_id, status, created_at DESC);

INSERT INTO team_articles (team_member_id, title, excerpt, content, status)
SELECT id, 'Tối ưu hiệu năng web từ những phần nhỏ nhất', 'Một số góc nhìn thực tế khi cải thiện trải nghiệm web.', 'Hiệu năng là tổng hòa của rất nhiều quyết định nhỏ: từ cấu trúc giao diện, cách tải dữ liệu đến việc đo lường trước và sau khi cải thiện. Bài viết này chia sẻ cách tiếp cận thực tế để ưu tiên đúng vấn đề và tạo ra thay đổi có ý nghĩa cho người dùng.', 'published'
FROM team_members WHERE name='Phạm Văn Bình' AND NOT EXISTS (SELECT 1 FROM team_articles WHERE title='Tối ưu hiệu năng web từ những phần nhỏ nhất');

INSERT INTO team_articles (team_member_id, title, excerpt, content, status)
SELECT id, 'Thiết kế giao diện bắt đầu từ câu hỏi nào?', 'Từ nhu cầu thực tế đến một hành trình sản phẩm rõ ràng.', 'Một giao diện tốt không bắt đầu từ màu sắc hay thành phần có sẵn. Nó bắt đầu từ việc hiểu người dùng cần hoàn thành điều gì, ở đâu họ gặp trở ngại và đâu là thông tin quan trọng nhất trong từng thời điểm.', 'published'
FROM team_members WHERE name='Lê Thu Hà' AND NOT EXISTS (SELECT 1 FROM team_articles WHERE title='Thiết kế giao diện bắt đầu từ câu hỏi nào?');
