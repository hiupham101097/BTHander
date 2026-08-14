# Aurix — Landing Page (React + Vite + React Router)

Trang giới thiệu sản phẩm công nghệ: Hero, Thành tựu, Dự án nổi bật (tab theo ngành),
Sản phẩm (tab Trải nghiệm miễn phí / Sản phẩm bán), Đội ngũ, CTA, Footer.

## Kiến trúc dự án

Cấu trúc tuân theo mô hình chuẩn của một ứng dụng React thực tế: tách rõ **routing**,
**layout**, **trang (pages)**, **thành phần giao diện (components)**, **logic tái sử dụng
(hooks)** và **dữ liệu (constants)** — thay vì gộp tất cả vào một file duy nhất.

```
aurix-app/
├── index.html
├── package.json
├── vite.config.js
├── .eslintrc.cjs
├── public/
└── src/
    ├── main.jsx                 # entry point — mount App, import global.css 1 lần duy nhất
    ├── App.jsx                  # khai báo Router (react-router-dom), không chứa UI
    │
    ├── layouts/
    │   └── MainLayout.jsx       # khung chung: Navbar + <Outlet/> + Footer
    │
    ├── pages/
    │   └── Home.jsx             # trang chủ — ghép các section lại
    │
    ├── components/
    │   ├── layout/               # thành phần khung: Navbar, Footer
    │   │   ├── Navbar.jsx
    │   │   └── Footer.jsx
    │   ├── sections/             # từng khối nội dung của trang chủ
    │   │   ├── Hero.jsx
    │   │   ├── Stats.jsx
    │   │   ├── Projects.jsx      # tab theo ngành (dùng useState nội bộ)
    │   │   ├── Products.jsx      # tab trải nghiệm / bán (dùng useState nội bộ)
    │   │   ├── Team.jsx
    │   │   └── CTA.jsx
    │   └── ui/                   # thành phần dùng lại nhiều nơi, thuần trình bày
    │       ├── Reveal.jsx        # animation cuộn xuất hiện
    │       └── SectionEyebrow.jsx
    │
    ├── hooks/
    │   └── useReveal.js          # custom hook — tách logic IntersectionObserver khỏi UI
    │
    ├── constants/
    │   └── data.js               # toàn bộ dữ liệu tĩnh: dự án, sản phẩm, đội ngũ, thống kê
    │
    └── styles/
        └── global.css            # design token (CSS variables), reset, animation dùng chung
```

### Nguyên tắc áp dụng

- **1 component = 1 trách nhiệm**: `sections/*` chỉ lo hiển thị một khối nội dung,
  không chứa dữ liệu cứng — dữ liệu lấy từ `constants/data.js`.
- **Logic tách khỏi giao diện**: hiệu ứng cuộn nằm trong `hooks/useReveal.js`,
  component `ui/Reveal.jsx` chỉ gọi hook và render.
- **Routing chuẩn**: `App.jsx` chỉ khai báo `<Routes>`, giao diện thực tế nằm ở
  `layouts/` và `pages/` — dễ mở rộng thêm trang mới (vd. `/products`, `/team`)
  mà không phải sửa `App.jsx`.
- **Style tập trung 1 nơi**: `global.css` chỉ được import một lần duy nhất tại
  `main.jsx`, tránh trùng lặp import CSS ở nhiều component.

## Chạy dự án

```bash
npm install
npm run dev
```

Mở trình duyệt tại `http://localhost:5173`.

## Build production

```bash
npm run build
npm run preview
```

## Mở rộng thêm trang mới

Thêm route mới chỉ cần 2 bước:

1. Tạo file trong `src/pages/`, ví dụ `Products.jsx`.
2. Khai báo trong `src/App.jsx`:
   ```jsx
   <Route path="/products" element={<ProductsPage />} />
   ```

## Ghi chú

- Toàn bộ nội dung mẫu (dự án, sản phẩm, đội ngũ, giá) nằm trong `src/constants/data.js`
  — chỉnh sửa trực tiếp file này để thay bằng thông tin thật.
- Icon: `lucide-react`. Font: Sora (tiêu đề) + Inter (nội dung) qua Google Fonts.

## Cloudflare Workers — Deploy

Hướng dẫn nhanh để deploy site và API lên Cloudflare Workers bằng GitHub Actions.

- Tạo Worker theo cấu hình trong `wrangler.jsonc`.
- Tạo một API token có quyền *Workers Scripts:Edit* và *D1:Edit*, sau đó lấy `Account ID` từ dashboard.
- Thêm 2 secret trong repository GitHub: `CF_PAGES_API_TOKEN` và `CF_ACCOUNT_ID`.

Workflow CI nằm ở `.github/workflows/deploy-pages.yml` và sẽ:

- Chạy `npm ci` rồi `npm run build`.
- Chạy D1 migrations, sau đó đẩy Worker và thư mục `dist` cùng lúc.

Khi cần deploy thủ công từ máy local, bạn vẫn có thể build và preview:

```bash
npm run build
npm run preview
```

Để deploy từ máy local, chạy `npm run deploy:worker`. Lệnh này build giao diện, áp dụng D1 migrations và deploy Worker. Sau lần deploy đầu tiên, gán tên miền của site vào Worker thay vì Cloudflare Pages để request `/api/*` đi tới backend.
