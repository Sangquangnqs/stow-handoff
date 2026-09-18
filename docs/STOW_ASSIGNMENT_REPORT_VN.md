# BÁO CÁO ĐÁNH GIÁ STOW VÀ PROTOTYPE CẢI TIẾN

**Ứng viên:** Nguyễn Quang Sáng  
**Vị trí:** Product Engineering Intern (AI-Native)  
**Thời gian đánh giá:** 15-16/09/2026  
**Sản phẩm:** STOW by MyStorage

---

## Đánh Giá Hệ Thống STOW: Phạm Vi, Phương Pháp Và Các Phát Hiện

### Mục tiêu

STOW là trợ lý AI của MyStorage, hỗ trợ khách hàng tìm hiểu loại kho, kích thước, giá thuê và các bước tiếp theo. Tôi đánh giá hệ thống trên môi trường thực tế dưới góc nhìn của một khách hàng, sau đó đối chiếu câu trả lời với website MyStorage và nguồn dữ liệu chuẩn [`llms.txt`](https://mystorage.vn/llms.txt). Quá trình đánh giá ưu tiên những vấn đề có thể ảnh hưởng đến quyết định thuê kho, niềm tin của khách hàng và tỷ lệ chuyển đổi.

Phạm vi đánh giá bao gồm:

- Giá thuê và luồng đặt chỗ.
- Giọng điệu và khả năng xử lý ngôn ngữ.
- Khả năng nhận biết chương trình khuyến mãi đang áp dụng.
- Độ chính xác khi đối chiếu với `llms.txt`.
- Cách xử lý yêu cầu dữ liệu có cấu trúc và cơ chế bảo vệ của bot.
- Các trạng thái lỗi, trạng thái trống, giao diện di động và khả năng tiếp cận cơ bản.
- Quy tắc an toàn và các trường hợp biên liên quan đến kích thước vật lý.

### Phương pháp thực hiện

1. Sử dụng STOW như một khách hàng có nhu cầu thuê kho thực tế trong ba tháng.
2. Giữ một mạch hội thoại xuyên suốt từ tìm hiểu sản phẩm đến ý định đặt chỗ.
3. Đối chiếu thông tin bot cung cấp với trang Booking đang hoạt động và `llms.txt`.
4. Lưu lại nội dung hội thoại và ảnh chụp cho từng vấn đề có thể tái hiện.
5. Xếp hạng các phát hiện theo tác động đến khách hàng, doanh thu và niềm tin.
6. Xây dựng prototype hoạt động được để tái hiện hành vi cũ và minh họa hướng cải tiến.

### Tóm tắt các phát hiện

| ID | Phát hiện | Mức độ | Tác động chính |
| --- | --- | --- | --- |
| F1 | Đứt gãy luồng đặt chỗ và cô lập dữ liệu phiên | Nghiêm trọng | Chuyển đổi và doanh thu |
| F2 | Phủ nhận chương trình khuyến mãi đang áp dụng | Cao | Niềm tin khách hàng và hiệu quả khuyến mãi |
| F3 | Sai thông số kỹ thuật hầm rượu | Trung bình | Độ chính xác với khách hàng cao cấp |
| F4 | Từ chối quá mức yêu cầu xuất dữ liệu có cấu trúc | Trung bình | Tính hữu dụng và trải nghiệm khách hàng doanh nghiệp |

---

### F1 - Đứt Gãy Luồng Đặt Chỗ Và Cô Lập Dữ Liệu Phiên

**Mức độ:** Nghiêm trọng

**Điều gì đã xảy ra**

Sau khi khách hàng hoàn thành tư vấn, cung cấp thông tin liên hệ, chọn kho tự quản 5m³ tại An Phú và yêu cầu đường dẫn thanh toán cọc, STOW chỉ phản hồi bằng văn bản. Bot thông báo rằng chuyên viên sẽ gọi lại nhưng không cung cấp hành động tiếp theo để khách hàng tự hoàn tất đặt chỗ. Khi truy cập trang Booking, khách hàng vẫn phải chọn lại dịch vụ và nhập lại thông tin từ đầu.

**Cách tái hiện**

1. Hỏi STOW về kho phù hợp để lưu đồ chuyển nhà trong khoảng ba tháng.
2. Tiếp tục đến khi bot đề xuất kho tự quản 5m³ tại An Phú.
3. Cung cấp thông tin liên hệ và yêu cầu link thanh toán cọc giữ chỗ.
4. Quan sát STOW chỉ hứa chuyên viên sẽ gọi lại.
5. Mở trang Booking và xác nhận quy trình bắt đầu lại từ bước chọn dịch vụ.

**Tại sao vấn đề này quan trọng**

- Nhập liệu lặp lại làm tăng nguy cơ khách hàng bỏ ngang tại thời điểm có ý định mua cao nhất.
- Phụ thuộc vào gọi lại thủ công làm tăng chi phí vận hành và kéo dài thời gian chuyển đổi.
- Khách hàng không thể xác nhận gói kho, mức giá hoặc yêu cầu bảo vệ tài sản đã được chuyển sang Booking.

**Giải pháp đề xuất**

Xây dựng một giao thức chuyển giao dữ liệu có cấu trúc giữa STOW và Booking/CRM. Khi khách hàng xác nhận ý định đặt chỗ, STOW sẽ tổng hợp dịch vụ, địa điểm, kích thước kho, thông tin liên hệ, mức giá tại thời điểm tư vấn và yêu cầu bảo vệ tài sản vào một token phía máy chủ có thời hạn ngắn. Trang Booking dùng token này để mở bước xác nhận với dữ liệu đã điền sẵn. Prototype hiện tại minh họa cơ chế trên bằng tham số URL nhưng không tạo đặt chỗ thật.

**Bằng chứng**

**Trước cải tiến - STOW trên hệ thống thực tế**

![F1 - STOW ghi nhận thông tin khách hàng](screenshots/f1.png)

![F1 - Khách hàng hỏi cách giữ chỗ](screenshots/f1_2.png)

![F1 - STOW chuyển sang phương án gọi lại thủ công](screenshots/f1_3.png)

**Sau cải tiến - Prototype**

![F1 - Phản hồi cải tiến giữ được ngữ cảnh hội thoại](screenshots/f1_after.png)

![F1 - Thẻ chuyển tiếp đặt chỗ có cấu trúc](screenshots/f1_2_after.png)

![F1 - Trang Booking mô phỏng nhận dữ liệu đã điền sẵn](screenshots/f1_3_after.png)

---

### F2 - Phủ Nhận Chương Trình Khuyến Mãi Đang Áp Dụng

**Mức độ:** Cao

**Điều gì đã xảy ra**

Trang Booking hiển thị chương trình Trung Thu giảm 16% cho AutoLocker từ ngày 07/09 đến 27/09. Khi khách hàng hỏi ưu đãi này áp dụng cho kho tự quản 5m³ tại An Phú hay chỉ dành cho tủ khóa thông minh, STOW phủ nhận hoàn toàn sự tồn tại của chương trình và chuyển sang giới thiệu chính sách chiết khấu thông thường theo thời hạn thuê kho tự quản.

**Cách tái hiện**

1. Mở banner khuyến mãi AutoLocker đang hiển thị trên trang Booking.
2. Hỏi STOW liệu ưu đãi 16% áp dụng cho kho tự quản An Phú hay chỉ AutoLocker.
3. Quan sát bot phủ nhận chương trình đối với cả hai sản phẩm.

**Tại sao vấn đề này quan trọng**

- Mâu thuẫn với banner trên website làm giảm niềm tin vào cả chatbot lẫn chương trình khuyến mãi.
- Bot bỏ lỡ cơ hội upsell AutoLocker rõ ràng.
- Khách hàng có thể cho rằng chương trình quảng cáo không hợp lệ hoặc không thể sử dụng.

**Giải pháp đề xuất**

Đồng bộ các chương trình đang áp dụng từ một nguồn dữ liệu được phê duyệt, trong đó có phạm vi sản phẩm, địa điểm, thời hạn hiệu lực và quy tắc cộng dồn ưu đãi. Bot cần truy xuất dữ liệu này trước khi trả lời, đồng thời phân biệt rõ ưu đãi AutoLocker với chiết khấu theo thời hạn của kho tự quản.

**Bằng chứng**

**Trước cải tiến - STOW trên hệ thống thực tế**

![F2 - Ngữ cảnh chương trình đang hoạt động](screenshots/f2.png)

![F2 - STOW phủ nhận chương trình](screenshots/f2_2.png)

**Sau cải tiến - Prototype**

![F2 - Phản hồi cải tiến phân biệt ưu đãi AutoLocker và kho tự quản](screenshots/f2_after.png)

---

### F3 - Sai Lệch Thông Số Kỹ Thuật Hầm Rượu

**Mức độ:** Trung bình

**Điều gì đã xảy ra**

Khi được hỏi bằng tiếng Anh về điều kiện bảo quản rượu, STOW trả lời nhiệt độ khoảng 15°C và độ ẩm 55%-65%. Trong khi đó, `llms.txt` của MyStorage quy định hầm rượu chuyên dụng duy trì nhiệt độ 12°C-15°C và độ ẩm 60%-70%. Câu trả lời cho thấy hệ thống có thể đã nhầm dữ liệu của kho máy lạnh thông thường với dữ liệu dành riêng cho hầm rượu.

**Cách tái hiện**

1. Hỏi facility, nhiệt độ và độ ẩm phù hợp cho khoảng 20 thùng rượu.
2. Ghi nhận các giá trị nhiệt độ và độ ẩm STOW trả lời.
3. Đối chiếu với mục wine storage trong `llms.txt`.

**Tại sao vấn đề này quan trọng**

- Người sưu tầm rượu đưa ra quyết định dựa trên thông số môi trường chính xác.
- Hướng dẫn độ ẩm sai làm giảm niềm tin vào dịch vụ premium.
- Một câu trả lời nghe hợp lý nhưng sai khó được khách hàng phát hiện hơn một lời từ chối.

**Giải pháp đề xuất**

Phân tách dữ liệu truy xuất bằng metadata như `service_type=wine_storage`, ưu tiên nguồn chuẩn theo từng dịch vụ và bổ sung bộ kiểm thử cố định cho cả nhiệt độ lẫn độ ẩm. Nếu chưa có nguồn đáng tin cậy về tình trạng chỗ trống hoặc sức chứa theo thời gian thực, bot cần nói rõ rằng các thông tin đó phải được xác nhận thêm.

**Bằng chứng**

**Trước cải tiến - STOW trên hệ thống thực tế**

![F3 - Câu hỏi hầm rượu và phản hồi ban đầu](screenshots/f3.png)

![F3 - Thông số môi trường không chính xác](screenshots/f3_2.png)

**Sau cải tiến - Prototype**

![F3 - Phản hồi cải tiến sử dụng đúng thông số hầm rượu](screenshots/f3_after.png)

---

### F4 - Từ Chối Quá Mức Yêu Cầu Dữ Liệu Có Cấu Trúc

**Mức độ:** Trung bình

**Điều gì đã xảy ra**

Khách hàng yêu cầu xuất thông tin so sánh giữa hai lựa chọn kho dưới dạng JSON hợp lệ để đưa vào bảng tính chi phí cá nhân. STOW kích hoạt một câu từ chối soạn sẵn, nói rằng bot không phải máy trích xuất JSON, dù người dùng không yêu cầu dữ liệu riêng tư, dữ liệu nội bộ hay chỉ dẫn hệ thống.

**Cách tái hiện**

1. Yêu cầu STOW so sánh kho tự quản An Phú và kho dịch vụ Đồng Nai.
2. Yêu cầu các trường công khai dưới dạng JSON: `service_type`, `pricing_3_months`, `access_hours` và `insurance_tiers`.
3. Yêu cầu chỉ trả JSON, không thêm lời dẫn.
4. Quan sát câu từ chối soạn sẵn của bot.

**Tại sao vấn đề này quan trọng**

- Từ chối chỉ dựa trên từ khóa làm giảm tính hữu dụng đối với khách hàng kỹ thuật và doanh nghiệp.
- Hành vi này ngăn người dùng chuyển đổi an toàn những thông tin công khai mà bot đã cung cấp trong hội thoại.
- Câu đùa soạn sẵn không giải thích được ranh giới an toàn thực sự của hệ thống.

**Giải pháp đề xuất**

Phân loại yêu cầu theo mục đích và độ nhạy của dữ liệu thay vì chặn các từ như `JSON` hoặc `schema`. Hệ thống có thể xuất dữ liệu so sánh công khai theo một schema cho phép sẵn. Các mã định danh nội bộ, thông tin xác thực, chỉ dẫn ẩn và trường dữ liệu không được hỗ trợ vẫn phải bị từ chối hoặc loại bỏ.

**Bằng chứng**

**Trước cải tiến - STOW trên hệ thống thực tế**

![F4 - Yêu cầu JSON an toàn nhận câu từ chối soạn sẵn](screenshots/f4.png)

**Sau cải tiến - Prototype**

![F4 - Phản hồi cải tiến hiển thị JSON so sánh hợp lệ và có thể sao chép](screenshots/f4_after.png)

---

## Prototype Cải Tiến

### Đường dẫn

- **Live demo:** [https://mystorage-stow-nine.vercel.app/](https://mystorage-stow-nine.vercel.app/)
- **Repository:** [https://github.com/Sangquangnqs/stow-handoff](https://github.com/Sangquangnqs/stow-handoff)
- **Báo cáo kỹ thuật tiếng Việt:** [BAO_CAO_AUDIT_STOW_VN.md](BAO_CAO_AUDIT_STOW_VN.md)
- **Báo cáo kỹ thuật tiếng Anh:** [AUDIT_STOW_REPORT_EN.md](AUDIT_STOW_REPORT_EN.md)

### Những cải tiến được minh họa

Prototype mở trực tiếp vào giao diện chat mô phỏng STOW. Tính năng Audit Replay tái hiện từng kịch bản đã kiểm thử theo thứ tự tin nhắn, cho phép người đánh giá xem phản hồi cũ, phản hồi cải tiến hoặc mở chế độ so sánh song song trong một cửa sổ lớn.

| Phát hiện | Cách prototype minh họa giải pháp |
| --- | --- |
| F1 | Tạo thẻ giữ chỗ có cấu trúc và mở trang Booking mô phỏng với dữ liệu đã điền sẵn |
| F2 | Tách chương trình AutoLocker 16% khỏi chiết khấu kho tự quản 5%-15% |
| F3 | Trả đúng nhiệt độ `12°C-15°C` và độ ẩm `60%-70%` |
| F4 | Hiển thị JSON hợp lệ, có thể sao chép và chứa đúng các trường so sánh được yêu cầu |

Các hành vi bổ sung đã hiện thực:

- Lịch sử hội thoại được lưu trong trình duyệt.
- Giao diện hỗ trợ tiếng Việt và tiếng Anh.
- Nhận diện ngôn ngữ của câu hỏi độc lập với ngôn ngữ đang chọn trên giao diện.
- Phát lại hội thoại có hiệu ứng chuyển động và nút quay về Audit Replay.
- Hỗ trợ cơ bản cho tệp đính kèm, chuyển giọng nói thành văn bản và gửi tin bằng giọng nói.
- Trang Booking được ghi rõ là bản mô phỏng.

### Cách chạy trên máy cá nhân

Yêu cầu: Node.js 20 trở lên và npm.

```bash
npm install
npm run dev
```

Mở `http://localhost:3000` và chọn một kịch bản trong Audit Replay. Dùng các lệnh sau để kiểm tra bản dựng dùng cho triển khai:

```bash
npm run lint
npm run build
npm start
```

### Cấu trúc kỹ thuật

- Next.js 16, React 19, TypeScript và Tailwind CSS 4.
- `StowHandoffPrototype`: quản lý tương tác và trạng thái hội thoại.
- `StowChatParts`: giao diện phát lại, lịch sử, tin nhắn và so sánh.
- `stow-handoff-data`: kiểu dữ liệu, kịch bản, nội dung đa ngôn ngữ và dữ liệu có cấu trúc.
- `SmartBookingHandoffCard`: thẻ hành động chuyển tiếp sang bước đặt chỗ.
- `/vi/book`: trang Booking mô phỏng có khả năng đọc dữ liệu từ STOW.

### Phạm vi và giới hạn

- Đây là prototype dùng các kịch bản phản hồi xác định trước, không phải mô hình STOW đang vận hành thực tế.
- Trang Booking mô phỏng không tạo yêu cầu đặt chỗ và không thay đổi hệ thống MyStorage.
- Giá, tình trạng chỗ trống và chương trình khuyến mãi là dữ liệu ghi nhận tại thời điểm đánh giá, không phải dữ liệu theo thời gian thực.
- Khi triển khai thực tế, dữ liệu nên được chuyển qua giao thức phía máy chủ đã được phê duyệt thay vì đặt thông tin cá nhân trong tham số URL.

---

## Nội Dung Do AI Tạo Ra Đã Bị Loại Bỏ Hoặc Viết Lại

### Chuyển tiếp sang bước đặt chỗ

**Kết quả ban đầu do AI tạo:** Phiên bản đầu tiên dẫn thẳng người dùng sang trang Booking đang hoạt động.

**Vấn đề tôi phát hiện:** Trang Booking không nhận được ngữ cảnh của cuộc hội thoại. Vì vậy, giải pháp này lặp lại chính vấn đề cần khắc phục: khách hàng vẫn phải bắt đầu lại từ đầu.

**Phần tôi thay đổi:** Tôi thay đường dẫn trực tiếp bằng một trang Booking mô phỏng được ghi nhãn rõ ràng. Trang này đọc dữ liệu do STOW chuyển sang và hiển thị bước xác nhận trước khi đặt chỗ. Đường dẫn đến Booking thật vẫn được cung cấp riêng để tránh khiến người xem hiểu nhầm prototype đã được tích hợp vào hệ thống thực tế.

### Xuất dữ liệu JSON

**Kết quả ban đầu do AI tạo:** Một nút Copy JSON chung được gắn vào thẻ giữ chỗ của F1.

**Vấn đề tôi phát hiện:** Trong F4, khách hàng cần dữ liệu so sánh giữa hai lựa chọn kho, không phải dữ liệu đơn hàng của một kho đã chọn. Chức năng ban đầu có thể hoạt động về mặt kỹ thuật nhưng không đáp ứng đúng yêu cầu của người dùng.

**Phần tôi thay đổi:** Tôi chuyển chức năng xuất JSON sang đúng kịch bản F4 và hiển thị một khối mã chứa `service_type`, `pricing_3_months`, `access_hours`, `insurance_tiers`, kèm nút Copy JSON ngay cạnh dữ liệu.

### Giao diện so sánh và cấu trúc mã nguồn

**Kết quả ban đầu do AI tạo:** Hai phiên bản được đặt trong một khung chat hẹp, trong khi phần lớn hành vi của trang nằm trong một component lớn.

**Vấn đề tôi phát hiện:** Các câu trả lời dài khó theo dõi, người xem phải cuộn quá sớm và component chính trở nên khó bảo trì.

**Phần tôi thay đổi:** Tôi bổ sung lựa chọn Bản cũ/Bản cải tiến, chuyển chế độ so sánh song song sang một cửa sổ lớn và tách mã nguồn thành component điều phối, các component giao diện tái sử dụng được và module dữ liệu có kiểu rõ ràng.

---

## Nếu Có Thêm Hai Giờ

Nếu có thêm hai giờ, tôi sẽ ưu tiên bổ sung kiểm thử tự động cho ba luồng quan trọng nhất của prototype. Thứ nhất là chức năng Audit Replay: các tin nhắn phải xuất hiện đúng thứ tự, không bỏ qua bước và có thể quay lại danh sách phát hiện sau khi phát xong. Thứ hai là xử lý ngôn ngữ: câu hỏi tiếng Anh phải nhận câu trả lời tiếng Anh và câu hỏi tiếng Việt phải nhận câu trả lời tiếng Việt, không phụ thuộc vào ngôn ngữ đang chọn trên giao diện. Thứ ba là luồng giữ chỗ: loại kho, dung tích, chi nhánh, thông tin khách hàng và chi phí phải được truyền đầy đủ sang trang Booking mô phỏng.

Sau đó, tôi sẽ kiểm tra lại phiên bản đã triển khai trên một số kích thước màn hình phổ biến, tập trung vào các lỗi có thể ảnh hưởng trực tiếp đến trải nghiệm như nội dung bị tràn, chữ bị cắt, thanh nhập che mất hội thoại hoặc hộp thoại so sánh vượt khỏi vùng hiển thị. Tôi cũng sẽ đối chiếu lại các trạng thái F1-F4 để bảo đảm ảnh minh chứng trong báo cáo khớp với phiên bản đang hoạt động.

Cuối cùng, tôi sẽ chuẩn bị một cấu trúc dữ liệu thống nhất cho giá thuê, chi nhánh và chương trình khuyến mãi, kèm nguồn dữ liệu và thời điểm cập nhật. Việc đồng bộ theo thời gian thực cần API hoặc nguồn dữ liệu chính thức từ MyStorage, vì vậy tôi sẽ chỉ chuẩn bị điểm tích hợp trước thay vì giả định một API chưa tồn tại. Khi có nguồn được phê duyệt, dữ liệu có thể được thay thế mà không cần viết lại giao diện.

---

## Thời Gian Thực Hiện

**Tổng thời gian thực tế:** 12 giờ

| Hạng mục | Số giờ |
| --- | ---: |
| Đánh giá hệ thống thực tế và thu thập bằng chứng | 3 |
| Đối chiếu `llms.txt` và phân tích các phát hiện | 2 |
| Thiết kế và hiện thực prototype | 5 |
| Kiểm thử, refactor và hoàn thiện tài liệu | 2 |
| **Tổng** | **12** |
