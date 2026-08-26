# Hướng Dẫn Tích Hợp Zalo Official Account (OA) & Webhook AI Assistant

Tài liệu này cung cấp hướng dẫn toàn diện từng bước để kết nối hệ thống tuyển dụng **FastHunt** với **Zalo Official Account (OA) API chính thức** (Zalo for Business), thiết lập Webhook tiếp nhận tin nhắn/CV tự động và triển khai quy trình đẩy tin tuyển dụng cho CTV kèm phê duyệt thủ công.

---

## 📌 1. Nguyên Tắc & Chính Sách Zalo (Bắt Buộc)

> [!IMPORTANT]
> **Chính sách kết nối Zalo for Business:**
> - **Sử dụng API chính thức:** Chỉ sử dụng **Zalo OA OpenAPI v3.0 / v2.0** do VNG phát hành qua cổng [developers.zalo.me](https://developers.zalo.me).
> - **Tuyệt đối không dùng automation tài khoản cá nhân:** Các thư viện giả lập tài khoản Zalo cá nhân (personal automation) vi phạm Điều khoản dịch vụ của Zalo và sẽ bị khóa tài khoản vĩnh viễn.
> - **Kênh giao tiếp đề xuất:**
>   1. **Zalo OA:** Làm kênh giao tiếp 1-1 giữa ứng viên/CTV với Trợ lý AI FastHunt.
>   2. **Nhóm Zalo Doanh Nghiệp:** Quản lý nhóm CTV/Khách hàng có tài khoản OA tham gia (áp dụng cho các gói Zalo Doanh Nghiệp).
>   3. **Zalo Notification Service (ZNS) / CS Message:** Dùng để gửi tin nhắn thông báo tiến độ, kết quả phỏng vấn và phát sóng job mới.

---

## 🚀 2. Hướng Dẫn Đăng Ký & Thiết Lập Từng Bước

### Bước 1: Đăng Ký Zalo Official Account (OA) Doanh Nghiệp
1. Truy cập [https://oa.zalo.me/manage/oa](https://oa.zalo.me/manage/oa) và đăng nhập bằng tài khoản Zalo quản trị viên.
2. Chọn **"Tạo Official Account mới"** -> Chọn loại tài khoản **"Doanh nghiệp"** (hoặc Dịch vụ tiện ích).
3. Điền thông tin:
   - **Tên OA:** *FASTHUNT Tuyển Dụng & Nhân Tài Doanh Nghiệp*
   - **Danh mục:** Dịch vụ tuyển dụng & Việc làm
   - **Ảnh đại diện & Ảnh bìa:** Logo FastHunt
4. Xác thực tài khoản OA (Giấy phép ĐKKD hoặc Giấy tờ định danh) để mở khóa toàn bộ tính năng API gửi tin nhắn chủ động.

---

### Bước 2: Tạo Ứng Dụng Trên Zalo for Developers
1. Truy cập cổng phát triển [https://developers.zalo.me](https://developers.zalo.me) -> Chọn **"Thêm ứng dụng mới"**.
2. Đặt tên ứng dụng (ví dụ: `FastHunt-Recruitment-Assistant`).
3. Ghi lại các thông số bảo mật quan trọng:
   - **App ID (Application ID):** e.g. `384917482910482`
   - **Secret Key:** e.g. `zk_sec_9948a7b1c3e4d5f6`

---

### Bước 3: Liên Kết Zalo OA Vào Ứng Dụng & Cấp Quyền (Permissions)
1. Trong trang quản lý App trên Zalo Developers, vào mục **"Official Account"** -> Chọn **"Liên kết Official Account"**.
2. Chọn OA vừa tạo ở Bước 1 và cấp các quyền sau:
   - `oa.message.cs`: Gửi tin nhắn chăm sóc khách hàng / phản hồi ứng viên
   - `oa.message.transaction`: Gửi tin nhắn giao dịch / thông báo tiến độ
   - `oa.message.broadcast`: Gửi tin nhắn phát sóng tới danh sách CTV
   - `oa.webhook`: Đăng ký nhận sự kiện tin nhắn qua Webhook

---

### Bước 4: Thiết Lập Webhook Tiếp Nhận Tin Nhắn & CV
1. Vào mục **"Webhook"** trong App Zalo Developers.
2. Điền **Webhook URL** của hệ thống bạn:
   - **Production:** `https://your-domain.com/webhook/zalo`
   - **Thử nghiệm Local (qua ngrok):** `https://xxxx.ngrok-free.app/webhook/zalo`
3. Điền **Webhook Secret Key** (mã bí mật dùng để xác thực chữ ký SHA-256).
4. Bật đăng ký các sự kiện (Events):
   - `user_send_text`: Người dùng/CTV gửi tin nhắn văn bản
   - `user_send_image`: Người dùng gửi hình ảnh
   - `user_send_file`: Người dùng gửi tệp đính kèm (CV .PDF, .DOCX)
   - `oa_send_text`: Tin nhắn từ phía OA gửi đi

---

### Bước 5: Cấu Hình OAuth 2.0 & Lấy Access Token
Zalo OA sử dụng chuẩn **OAuth 2.0 PKCE**.
1. **Lấy Authorization Code:**
   Truy cập URL trên trình duyệt:
   ```
   https://oauth.zaloapp.com/v4/oa/permission?app_id={APP_ID}&redirect_uri={REDIRECT_URI}&code_challenge={CODE_CHALLENGE}&state={STATE}
   ```
2. **Đổi Code lấy Access Token & Refresh Token:**
   Gửi request `POST`:
   ```bash
   curl -X POST https://oauth.zaloapp.com/v4/oa/access_token \
     -H "secret_key: {SECRET_KEY}" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "code={AUTHORIZATION_CODE}&app_id={APP_ID}&grant_type=authorization_code&code_verifier={CODE_VERIFIER}"
   ```
3. **Làm Mới Token Khi Hết Hạn (Refresh Token Flow):**
   Access Token có hạn 25 giờ. Dùng Refresh Token để lấy token mới:
   ```bash
   curl -X POST https://oauth.zaloapp.com/v4/oa/access_token \
     -H "secret_key: {SECRET_KEY}" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "refresh_token={REFRESH_TOKEN}&app_id={APP_ID}&grant_type=refresh_token"
   ```

---

## 💻 3. Chạy Thử Nghiệm Webhook Tại Máy Local (ngrok)

1. Khởi động Webhook Backend Server:
   ```bash
   node server/zaloServer.js
   ```
2. Mở cổng tunnel ra internet bằng ngrok:
   ```bash
   ngrok http 3001
   ```
3. Copy URL forwarding của ngrok (ví dụ: `https://abcd-1234.ngrok-free.app/webhook/zalo`) dán vào trang cấu hình Webhook trên Zalo for Developers.
4. Bấm **"Test Webhook"** trên Zalo Developer console để xác nhận mã HTTP 200.

---

## 🤖 4. Luồng Hoạt Động Của Trợ Lý Zalo AI

```
[CTV / Ứng Viên] -> Gửi CV qua Zalo OA
       ↓
[Zalo Webhook] -> Bắn Event tới server /webhook/zalo
       ↓
[AI Classifier] -> Phân loại nhãn [CV MỚI] / [CÂU HỎI] / [CẬP NHẬT]
       ↓
[Claude AI Engine] -> Trích xuất kỹ năng, kinh nghiệm -> Tính điểm Match % với 37+ Jobs
       ↓
[Web Dashboard] -> Hiển thị kết quả tại Tab "Zalo Assistant" & Tự động lưu Candidate
```

---

## 🛡️ 5. Quy Trình Duyệt Đẩy Job Cho CTV (Human-in-the-Loop)

1. Recruiter chọn vị trí cần đẩy (Job đang tuyển gấp hoặc có hoa hồng hấp dẫn).
2. AI tự động biên soạn nội dung tin nhắn Zalo tối ưu (tóm tắt JD, mức lương, hoa hồng CTV, deadline).
3. Tin nhắn được đưa vào hàng đợi **"Chờ Phê Duyệt" (Pending Approval)**.
4. Recruiter kiểm tra, chỉnh sửa câu chữ nếu cần và bấm **"Duyệt & Phát Sóng"**.
5. Hệ thống gọi Zalo OA API để gửi tin nhắn tới mạng lưới CTV.
