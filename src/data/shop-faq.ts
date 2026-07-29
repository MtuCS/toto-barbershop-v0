export type ShopFaq = {
  question: string
  answer: string
  linkLabel?: string
  linkHref?: string
}

export const shopFaqs: ShopFaq[] = [
  { question: "Pomade gốc nước khác gì pomade gốc dầu?", answer: "Pomade gốc nước dễ gội sạch, hợp nhịp dùng hằng ngày và có nhiều mức giữ nếp. Gốc dầu bám nếp lâu, bóng rõ hơn nhưng cần gội kỹ để làm sạch hoàn toàn." },
  { question: "Clay và Fiber khác pomade như thế nào?", answer: "Clay và Fiber thường cho bề mặt lì, texture và volume tự nhiên. Pomade thiên về độ bóng, khả năng chải lại và các kiểu tóc gọn như slick back hoặc side part.", linkLabel: "Xem Clay & Fiber", linkHref: "/shop/grooming?collection=clay" },
  { question: "Chọn sản phẩm cho tóc mỏng hoặc tóc dày?", answer: "Tóc mỏng nên ưu tiên clay hoặc fiber nhẹ để tạo độ phồng. Tóc dày cần wax hoặc pomade có hold cao hơn và dùng từng lớp mỏng để tránh bết." },
  { question: "Pomade giữ nếp được bao lâu?", answer: "Thời gian giữ nếp phụ thuộc chất tóc, lượng dùng, độ ẩm và mức hold. Medium hold hợp một ngày thường, strong hold phù hợp kiểu tóc cần cố định lâu." },
  { question: "Dùng bao nhiêu sáp là đủ?", answer: "Bắt đầu với lượng bằng hạt đậu cho tóc ngắn, hoặc hai hạt đậu cho tóc trung bình. Xoa ấm thật đều trên tay rồi tăng dần nếu cần." },
  { question: "Cách gội sạch sáp hoặc pomade gốc dầu?", answer: "Làm ướt tóc kỹ, gội hai lần với shampoo làm sạch và xả lại bằng nước ấm. Với pomade gốc dầu, có thể dùng dầu xả trước lần gội đầu tiên để làm mềm lớp sản phẩm." },
  { question: "Hold nhẹ, medium và strong khác nhau ra sao?", answer: "Light hold cho tóc rủ tự nhiên, medium hold cân bằng độ linh hoạt và kiểm soát, còn strong hold phù hợp quiff, side part hoặc tóc dày khó vào nếp." },
  { question: "Mua grooming chính hãng ở đâu?", answer: "Bạn có thể chọn trực tiếp tại TOTO Shop. Mỗi sản phẩm có mô tả hold, shine và loại tóc để chọn nhanh đúng nhu cầu.", linkLabel: "Xem Grooming", linkHref: "/shop/grooming" },
]