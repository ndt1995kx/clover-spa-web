# Soát SEO · cloverspa.vn · trang chủ

Ngày soát 05/09/2026. Đối tượng: `index.html` (103 KB), `robots.txt`, `sitemap.xml`.
Phương pháp: bóc tĩnh từ mã nguồn — heading, alt, href, JSON-LD, meta — và đối chiếu
structured data với nội dung hiển thị. Không dùng công cụ bên thứ ba.

Kết luận ngắn: **nền kỹ thuật tốt, nhưng chưa phát hành được.** Có 4 lỗi chặn.

---

## A · Đang làm đúng

| Hạng mục | Trạng thái |
|---|---|
| HTML tĩnh, chữ nằm sẵn trong nguồn | Google đọc 100%, không phụ thuộc JS |
| `<title>` 61 ký tự · meta description 168 ký tự | Trong ngưỡng hiển thị, không bị cắt |
| canonical · meta robots · theme-color · geo | Đủ |
| Open Graph + Twitter Card | Đủ, có `og:image` kèm kích thước và alt |
| JSON-LD `DaySpa` + `WebSite` | Có `department[]` 4 chi nhánh kèm toạ độ, giờ mở cửa, `availableLanguage` |
| **Không** gắn `Review` / `AggregateRating` | Đúng — chưa có review xác minh thì không được đánh dấu |
| 13/13 ảnh có `alt` mô tả thật | Không nhồi từ khoá |
| 13/13 ảnh có `width`/`height` | Không gây CLS |
| 1 `<h1>`, thứ tự h1→h2→h3 không nhảy cấp | Đúng |
| `header` `nav` `main` `footer` `section` + `aria-labelledby` | Có skip link tới `#noi-dung` |
| `prefers-reduced-motion` · `scroll-margin-top` cho anchor | Có |
| `preload` ảnh hero + `fetchpriority="high"` · `preconnect` font | Có |
| `robots.txt` + `sitemap.xml` | Đã thay bản cũ trỏ 100% sang `cloverspadalat.com` |
| Lỗi console | 0 |

---

## B · Chặn phát hành

### B1 · hreflang trỏ vào 4 URL không tồn tại — nội dung 4 ngôn ngữ vô hình với Google

`<head>` khai `/vn` `/en` `/kr` `/cn`. Không URL nào tồn tại. Việc đổi ngôn ngữ hiện
làm hoàn toàn bằng JS trên cùng một URL, không đụng `history`, không đổi đường dẫn.

Hệ quả:
- Google chỉ index được bản tiếng Việt. **Bản tiếng Hàn — thị trường ưu tiên số 1 —
  không tồn tại với Google.**
- Cụm hreflang trỏ 404 bị Google bỏ qua toàn bộ, không chỉ URL sai.
- Tiếng Nga có trong bộ chuyển ngôn ngữ nhưng không có thẻ hreflang nào.

Cách sửa không cần server: sinh 5 file tĩnh (`/`, `/en/`, `/kr/`, `/cn/`, `/ru/`), mỗi
file đã dịch sẵn trong HTML, `<html lang>` đúng, canonical riêng, hreflang trỏ chéo đủ
5 chiều. Toàn bộ bản dịch đã nằm sẵn trong object `I18N` — sinh được tự động.

### B2 · Giá trong structured data lệch với giá hiển thị

| Dịch vụ | JSON-LD | Bảng giá trên trang |
|---|---|---|
| Foot Massage / Massage Chân | 690.000 | **460** |
| Massage Cổ Truyền | 690.000 | không có trong bảng |
| Massage Couple | 690.000 | không có trong bảng |
| `priceRange` | tới **1.290.000đ** | cao nhất hiển thị là 840 |

Bốn thẻ dịch vụ cũng đều ghi 690.000đ trong khi bảng giá bên dưới ghi khác — mâu thuẫn
ngay trong nội dung hiển thị.

Google có đối chiếu. Lệch giá là nguyên nhân phổ biến nhất bị gỡ rich result và dính
manual action *Structured data mismatch*.

### B3 · Ba đánh giá có tên người nhưng không có nguồn xác minh

`김서연 · Kim Seo-yeon` (Google Maps), `Martin Keller` (Tripadvisor), `王雨桐` (大众点评).

Đã không gắn schema — đúng. Nhưng vẫn hiển thị công khai như review thật.
Rủi ro: quảng cáo sai sự thật theo pháp luật VN, và nếu bị báo cáo có thể ảnh hưởng
Google Business Profile. Đây cũng trái với chính yêu cầu ban đầu của bạn.

Xử lý: gỡ, hoặc thay bằng review Google thật kèm link về hồ sơ.

### B4 · Sitemap khai 7 URL không tồn tại

Khai 8 URL, chỉ `https://cloverspa.vn/` là có thật. Bảy URL còn lại
(`/vn` `/en` `/kr` `/cn` `gioi-thieu.html` `chi-nhanh.html` `lien-he.html`) sẽ trả 404
→ Search Console báo lỗi hàng loạt, hao crawl budget.

---

## C · Quan trọng

### C1 · 25 trang dịch vụ đang có thứ hạng sẽ biến mất

Xem `_audit/rui-ro-chuyen-doi.md`. Đây là rủi ro SEO lớn nhất của cả dự án, lớn hơn mọi
mục trong file này. Không có bảng 301 thì mất toàn bộ traffic của các truy vấn dài như
*"massage chân đà nẵng"*.

**Không quyết được nếu không có Google Search Console.** Tôi đã hỏi hai lần và chưa có
quyền truy cập.

### C2 · Địa chỉ và số điện thoại — nền của local SEO

- `123 Trần Hưng Đạo, Sơn Trà` xuất hiện ở JSON-LD, footer và ô chi nhánh. Nếu đây là
  placeholder thì NAP (Name–Address–Phone) không khớp Google Business Profile, và NAP
  khớp là yếu tố số 1 để lọt local pack.
- Chỉ Đà Nẵng có địa chỉ và số điện thoại. Huế, Nha Trang, Đà Lạt chỉ có tên thành phố
  → **không có cơ hội xếp hạng local ở ba thành phố đó.**

### C3 · Nội dung mỏng và trùng lặp

629 từ hiển thị. Trang chủ local business nên ở khoảng 800–1200 từ.

Nghiêm trọng hơn số từ: **bốn thẻ dịch vụ dùng chung một đoạn mô tả y hệt**, và ba trong
bốn đoạn sai nội dung — Massage Cổ Truyền, Couple và Foot đều mô tả *"trải nghiệm độc
đáo từ ốc biển"*.

### C4 · H1 không chứa từ khoá nào

`CLOVER SPA / ĐIỂM ĐẾN CỦA SỰ AN YÊN` — không có "massage", không có tên thành phố.
H1 là tín hiệu on-page mạnh nhất. H2 đầu tiên (*"Bốn dịch vụ được chọn nhiều nhất"*)
cũng không có từ khoá.

Bạn yêu cầu không sửa thiết kế, nên đây là đề xuất để bạn quyết, không phải việc tôi tự
làm. Cách ít đụng chạm nhất: giữ nguyên H1, đổi chữ trong hai H2 sang dạng có từ khoá và
giữ đúng số dòng để không vỡ khung.

### C5 · Ảnh chưa tối ưu

1,41 MB ảnh đang dùng, không có WebP/AVIF. Nặng nhất là `promo-29.jpg` 418 KB.
Chuyển WebP giảm khoảng 60–70%. LCP là yếu tố xếp hạng trực tiếp.

Ngoài ra thư mục `images/` còn **1,84 MB gồm 9 file không dùng** — sẽ bị upload lên host
nếu copy cả thư mục.

### C6 · Google Fonts chặn render

Ba họ font, riêng Be Vietnam Pro tải 8 weight. Thẻ `<link>` chặn first paint khoảng
200–400 ms trên mạng chậm. Nên self-host và subset (`font-display:swap` đã có sẵn).

### C7 · Thiếu trang chính sách

Ba link footer trỏ `href="#"`: Chính sách huỷ lịch, Điều khoản dịch vụ, Quà tặng &
voucher. Với ngành sức khoẻ, Google đánh giá E-E-A-T cao hơn khi có các trang này.
Link `#` cũng là dead link.

---

## D · Nên có

- **FAQPage schema** — cơ hội rich result dễ nhất cho spa: giờ mở cửa, có phục vụ nam
  không, đặt lịch thế nào, giá bao nhiêu, có đón khách không. Cần nội dung thật.
- **BreadcrumbList schema** — khi có trang con.
- JSON-LD bổ sung: `hasMap` (link Google Maps), giờ mở cửa riêng từng chi nhánh,
  `image` dạng mảng nhiều ảnh, `sameAs` thêm Instagram và Google Business Profile
  (hiện chỉ có 1 Facebook).
- Thẻ xác minh Google Search Console — chưa có.
- Banner **2/9 đã hết hạn** (hôm nay 05/09). Nội dung lỗi thời nằm ngay trang chủ.
- `alt` của `promo-29.jpg` ghi *"giảm giá tới 30%"* nhưng nội dung hiển thị là
  −15% / −10% / −5%. Không khớp.
- Ghi chú ngoài SEO: mục ưu đãi đang dùng banner phần trăm, trái với yêu cầu ban đầu
  của bạn là không dùng % giảm giá.

---

## E · Thứ tự làm

1. Lấy quyền Google Search Console → quyết bảng 301 cho 25 trang đang có thứ hạng (C1)
2. Xác nhận địa chỉ và số điện thoại thật của cả 4 chi nhánh (C2)
3. Chốt bảng giá thật → đồng bộ JSON-LD, thẻ dịch vụ, bảng giá (B2)
4. Gỡ hoặc thay 3 review chưa xác minh (B3)
5. Sinh 5 file ngôn ngữ + sửa hreflang + sửa sitemap (B1, B4)
6. WebP + self-host font (C5, C6)
7. Viết 3 trang chính sách + FAQ (C7, D)

Mục 5 và 6 tôi làm được ngay, không cần thêm dữ liệu từ bạn.
Mục 1–4 và 7 phải có dữ liệu thật.
