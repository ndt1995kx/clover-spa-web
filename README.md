# Clover Spa · trang chủ

Trang chủ dựng lại từ bản thiết kế Figma. Một file HTML tĩnh, CSS và JS nội tuyến,
không cần build, không framework. Mở `index.html` bằng trình duyệt là chạy.

**Link xem thử:** xem mục Deployments của repo (GitHub Pages).

---

## Bản xem thử này KHÔNG phải bản chính thức

Trang đang ở giai đoạn duyệt thiết kế. Những phần dưới đây là **nội dung tạm**,
đừng lấy làm căn cứ:

| Phần | Tình trạng |
|---|---|
| 3 đánh giá khách hàng | **Chưa xác minh được nguồn.** Sẽ gỡ hoặc thay bằng review Google thật |
| Bảng giá và giá trên thẻ dịch vụ | Số tạm, chưa chốt |
| Mô tả 4 dịch vụ | Bốn thẻ đang dùng chung một đoạn, ba đoạn sai nội dung |
| Địa chỉ `123 Trần Hưng Đạo` | Cần xác nhận là địa chỉ thật |
| Địa chỉ Huế · Nha Trang · Đà Lạt | Chưa có, đang hiện "Đang cập nhật địa chỉ" |
| Ảnh 3 chi nhánh ngoài Đà Nẵng | Mượn tạm từ thư viện chung để xem được tương tác |
| Banner 2/9 | Chiến dịch đã hết hạn |
| 3 link Chính sách ở footer | Chưa có trang, đang trỏ `#` |

Mọi chỗ cần dữ liệu thật đều được đánh dấu bằng `CẦN DỮ LIỆU THẬT` ngay trong mã nguồn:

```
grep -n "CẦN DỮ LIỆU THẬT" index.html
```

Bản xem thử bị chặn Google index (`noindex` + `robots.txt`), cố ý, để nội dung chưa
thật không lọt lên kết quả tìm kiếm. Việc chặn chỉ áp dụng khi deploy — file
`index.html` trong repo vẫn giữ nguyên cấu hình dành cho tên miền thật.

---

## Đã làm được gì

- Khớp đúng bản thiết kế Figma ở cả desktop 1440 và mobile 390 (sai lệch 0 px trên mọi dải)
- Responsive liên tục từ 305 px đến 1905 px
- 5 ngôn ngữ, mỗi ngôn ngữ một URL riêng để Google index được từng bản
- Motion: ảnh mở dần khi cuộn, ken burns ở hero, chữ chạy, đường kẻ vẽ dần —
  toàn bộ tắt khi hệ điều hành bật "giảm chuyển động"
- Mục chi nhánh: bấm vào ô địa chỉ thì đổi ảnh, tên, địa chỉ, ghim bản đồ và đường nối
- SEO nền: JSON-LD `DaySpa` 4 chi nhánh, Open Graph, canonical, alt đầy đủ, sitemap, robots

## Còn lại

Xem [`_audit/soat-seo.md`](_audit/soat-seo.md) — soát SEO đầy đủ, xếp theo mức độ.
Xem [`_audit/rui-ro-chuyen-doi.md`](_audit/rui-ro-chuyen-doi.md) — rủi ro khi thay site cũ.

Việc gấp nhất không nằm trong mã nguồn: **cần quyền Google Search Console** để quyết
xem 25 trang dịch vụ đang có thứ hạng trên site cũ sẽ chuyển hướng đi đâu.

---

## Cấu trúc

```
index.html              trang gốc · HTML + CSS + JS trong một file · SỬA Ở ĐÂY
images/logo-clover.png  logo
images/design/          13 ảnh đang dùng
robots.txt              cho tên miền thật
sitemap.xml             cho tên miền thật
_build/                 script sinh bản 5 ngôn ngữ
_audit/                 báo cáo soát SEO và rủi ro chuyển đổi
.github/workflows/      dựng và deploy bản xem thử lên GitHub Pages
dist/                   KẾT QUẢ DỰNG · không có trong repo, sinh bằng lệnh
```

File thiết kế nguồn (Figma export, ảnh so sánh, bản backup) không đưa lên repo cho nhẹ.

---

## Dựng bản 5 ngôn ngữ

Chỉ sửa `index.html`. Năm bản còn lại sinh ra tự động từ chính nó — không chép tay,
không có bản dịch nào nằm rời ra ngoài.

```bash
cd _build && npm install && cd ..
node _build/dung-ngon-ngu.js index.html dist
```

Xong sẽ có thư mục `dist/` — đây mới là thứ đem upload lên host:

| Đường dẫn | Ngôn ngữ | Ghi chú |
|---|---|---|
| `/` | Tiếng Việt | bản chính tắc |
| `/vn/` | Tiếng Việt | bản trùng, canonical trỏ về `/`, giữ cho đường dẫn cũ không 404 |
| `/en/` | English | |
| `/kr/` | 한국어 | |
| `/cn/` | 中文 | |
| `/ru/` | Русский | |

Mỗi bản có `<html lang>` riêng, `<title>` và mô tả đã dịch, canonical riêng, cụm
hreflang đủ 6 chiều và `og:locale` đúng. Nhờ vậy Google index được từng ngôn ngữ
như một trang riêng — trước đây đổi ngôn ngữ chỉ chạy bằng JS trên cùng một URL
nên Google chỉ thấy mỗi bản tiếng Việt.

Bấm nút ngôn ngữ trên bản dựng sẽ chuyển sang URL tương ứng. Mở thẳng `index.html`
không qua bước dựng thì nút vẫn đổi chữ tại chỗ như cũ.
