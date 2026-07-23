import { test, expect } from '@playwright/test';

test.describe('E2E Checkout Flow', () => {
  test('khách hàng có thể mua sản phẩm thành công', async ({ page }) => {
    // 0. Mock API response cho việc tạo đơn hàng để không cần Backend chạy
    await page.route('**/api/orders/checkout', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ id: 'ord-mock-123' })
      });
    });

    // Lắng nghe alert để in ra lỗi (nếu có)
    page.on('dialog', dialog => {
      console.log('DIALOG ALERT:', dialog.message());
      dialog.accept();
    });

    // 1. Vào trang sản phẩm
    await page.goto('/shop');

    // Cấy dữ liệu login giả vào LocalStorage để bỏ qua bước đăng nhập
    await page.evaluate(() => {
      localStorage.setItem('toto-customer-user-auth', JSON.stringify({
        state: { 
          user: { 
            id: 1, 
            name: "Nguyễn Văn Test", 
            email: "test@test.com",
            addresses: [{
              id: 99,
              province: "Hà Nội",
              district: "Quận Hoàn Kiếm",
              ward: "Phường Hàng Trống",
              street: "123 Đường Test",
              isDefault: true
            }]
          }, 
          token: "mock-token" 
        },
        version: 0
      }));
    });
    // Tải lại trang để áp dụng Auth
    await page.reload();
    
    // 2. Vào trang chi tiết sản phẩm
    await page.goto('/shop/toto-strong-hold-pomade');
    
    // 3. Click nút "Thêm vào giỏ"
    await page.click('button:has-text("Thêm vào giỏ")');
    
    // Đợi 1 chút cho Toast hiện lên hoặc state cập nhật
    await page.waitForTimeout(500);

    // 4. Vào trang checkout
    await page.goto('/checkout');
    
    // 5. Điền thông tin
    await page.fill('input[name="name"]', 'Nguyễn Văn Test');
    await page.fill('input[name="phone"]', '0901234567');
    
    // Địa chỉ (chọn địa chỉ mặc định)
    await page.check('input[name="addressId"][value="99"]');
    
    // 6. Click Đặt hàng
    await page.click('button:has-text("Xác nhận đặt hàng")');
    
    // 7. Chờ redirect sang order-success
    await expect(page).toHaveURL(/.*order-success.*/);
    
    // 8. Đảm bảo UI hiển thị Đặt hàng thành công
    await expect(page.getByText(/đặt hàng thành công/i)).toBeVisible();
  });
});
