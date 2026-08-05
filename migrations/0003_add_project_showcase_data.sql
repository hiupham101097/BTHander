ALTER TABLE projects ADD COLUMN description TEXT;

INSERT INTO projects (name, description, languages, configuration, price, currency)
VALUES
  (
    'SPACE BLAST',
    'Game hành động không gian do Brave Trust Hander phát triển như một dự án cá nhân.',
    '["Game di động"]',
    '{"Loại":"Game","Mô hình":"Dự án cá nhân"}',
    0,
    'VND'
  ),
  (
    'Bang Bang',
    'Game giải trí với trải nghiệm chơi nhanh, trực quan và dễ tiếp cận.',
    '["Game di động"]',
    '{"Loại":"Game","Mô hình":"Dự án cá nhân"}',
    0,
    'VND'
  ),
  (
    'Chém hoa quả',
    'Game giải trí lấy cảm hứng từ thao tác chém trái cây, tối ưu cho người dùng phổ thông.',
    '["Game di động"]',
    '{"Loại":"Game","Mô hình":"Dự án cá nhân"}',
    0,
    'VND'
  ),
  (
    'Ứng dụng miễn phí',
    'Nhóm ứng dụng tiện ích miễn phí được xây dựng để phục vụ nhu cầu hằng ngày của người dùng.',
    '["Ứng dụng người dùng"]',
    '{"Loại":"Ứng dụng","Mô hình":"Miễn phí"}',
    0,
    'VND'
  );
