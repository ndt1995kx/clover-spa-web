# cloverspa.vn · rà soát trước khi thay thế

Quét ngày 01/09/2026. 42 URL nội dung, tất cả trả về 200.

## Vấn đề 1 · Sitemap trỏ sai hoàn toàn sang tên miền khác

`https://cloverspa.vn/sitemap.xml` chứa **51 URL, 100% trỏ về `cloverspadalat.com`**, toàn bộ đề `lastmod` năm 2021. Không có một URL nào của cloverspa.vn.

`robots.txt` có dòng `Sitemap:` để trống.

Nghĩa là suốt nhiều năm nay Google được đưa cho một danh sách URL sai. Đây là lỗi có sẵn, không phải do việc thay site gây ra, nhưng phải sửa trong lần thay này.

## Vấn đề 2 · Thiết kế 6 trang sẽ xoá 25 trang đang có thứ hạng

Site hiện tại có **25 trang dịch vụ riêng lẻ**, mỗi trang nhắm một từ khoá dài:

```
massage-thai-tai-da-nang.html          massage-chan-tai-da-nang.html
massage-da-nong-tai-da-nang.html       massage-bau-tai-da-nang.html
massage-cap-doi-tai-da-nang.html       massage-gia-dinh-tai-da-nang.html
massage-danh-cho-nam-o-da-nang.html    massage-truyen-thong-viet-nam-tai-da-nang.html
massage-toan-than.html                 massage-xuong-rong.html
tay-u-da-chet-toan-than.html           ngam-bon.html
oc-massage.html                        kid-massage.html
goi-dau-...                            combo-massage-tai-da-nang.html
huong-thom-tri-lieu-tai-da-nang.html   cac-goi-massage-tri-lieu-mat-tai-da-nang.html
...
```

Brief hiện tại gộp toàn bộ vào **một** trang `dich-vu.html`. Nếu làm đúng vậy rồi thay tên miền, 25 trang này biến mất. Khách tìm "massage chân đà nẵng" trên Google đang vào thẳng trang chuyên đề; sau khi đổi họ sẽ vào một trang gộp không khớp truy vấn, hoặc gặp 404.

Đây là mâu thuẫn giữa **quyết định thiết kế** (6 trang gọn) và **thực tế SEO** (42 trang đang chạy). Phải chọn, không thể có cả hai.

## Vấn đề 3 · Lỗi kỹ thuật rải rác

| Lỗi | Số trang |
|---|---|
| Thiếu thẻ `<title>` | 4 |
| Thiếu meta description | 4 |
| Thiếu `<h1>` | 13 |
| Title trùng lặp giữa các trang | 2 nhóm |

Một số ví dụ cụ thể:

- `/kr` (bản tiếng Hàn) **không có title**. Đây là thị trường ưu tiên số 1 theo brief.
- `/sale-off-popup.html` title ghi `Clover Spa Dalat | Sale up to 20% Off` — sót lại từ site Đà Lạt.
- `/dao-tao` title ghi `spa nha trang - massage nha trang - Clover Spa – Massage Đà Nẵng...` — nhồi từ khoá, sai chi nhánh.
- `/massage-thao-duoc-tai-da-lat.html` — trang Đà Lạt nằm trên tên miền Đà Nẵng.

## Vấn đề 4 · 9 trang khuyến mãi mâu thuẫn với định vị mới

```
-khuyen-mai-clover-spa-da-nang-giam-30-tang-kem-ngam-chan-thao-duoc.html
-tuan-vang-thang-11-...-giam-soc-den-30-uu-dai-chi-trong-7-ngay-duy-nhat.html
clover-spa-mung-quoc-khanh-29-giam-den-30-khi-dat-lich-truoc.html
sale-off-popup.html
khuyen-mai-20
```

Brief mới cấm giảm giá. Nhưng đây có thể đang là nguồn traffic thật. Cần xem Google Search Console để biết trước khi xoá.

## Vấn đề 5 · Đa ngữ đang theo đường dẫn

Bản dịch nằm ở `/vn`, `/en`, `/kr`, `/cn` — Google đã index từng bản riêng.

Thiết kế mới của chúng ta đổi ngôn ngữ bằng JavaScript trong cùng một URL. **Google không index được cách này.** Bốn phiên bản ngôn ngữ sẽ sập thành một. Với tệp khách Hàn/Trung/Nga thì đây là mất mát lớn.

Phải chuyển sang URL riêng cho từng ngôn ngữ, kèm thẻ `hreflang`.

## Điểm sáng · 3 URL giữ nguyên được

Site cũ đã có sẵn, trùng đúng tên file thiết kế mới đang dùng:

```
/gioi-thieu.html     -> ve-chung-toi
/chi-nhanh.html      -> chi-nhanh
/lien-he.html        -> lien-he
```

Giữ nguyên ba URL này thì không mất gì.

## Việc phải làm trước khi đổi tên miền

1. Lấy dữ liệu **Google Search Console** 12 tháng: trang nào có traffic thật, truy vấn nào. Không có dữ liệu này thì mọi quyết định giữ hay bỏ trang đều là đoán.
2. Chốt bản đồ redirect 301 cho đủ 42 URL.
3. Quyết định giữ bao nhiêu trang dịch vụ riêng lẻ.
4. Chuyển đa ngữ sang URL riêng + `hreflang`.
5. Viết lại sitemap.xml cho đúng tên miền, khai báo trong robots.txt.
6. Chỉ đổi DNS sau khi staging đã chạy đúng.
