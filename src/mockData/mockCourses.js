const mockCourses = [
  {
    id: 1,
    name: "Khóa học React cơ bản đến nâng cao",
    price: 520000,
    image: "/assets/react.png",
    description: "Xây dựng ứng dụng thực tế với React.",
    categoryId: 1,
    subcategoryId: 1,
    likes: 128
  },
  {
    id: 2,
    name: "Java căn bản qua dự án",
    price: 670000,
    image: "/assets/java.png",
    description: "Học Java thông qua thực hành ứng dụng.",
    categoryId: 1,
    subcategoryId: 1,
    likes: 110
  },
  {
    id: 3,
    name: "React Native cho ứng dụng di động",
    price: 720000,
    image: "/assets/react-native.png",
    description: "Tạo ứng dụng mobile với React Native.",
    categoryId: 1,
    subcategoryId: 1,
    likes: 90
  },
  {
    id: 4,
    name: "Thiết kế UI/UX chuyên sâu",
    price: 560000,
    image: "/assets/uiux.png",
    description: "Tư duy và công cụ thiết kế giao diện người dùng.",
    categoryId: 1,
    subcategoryId: 2,
    likes: 96
  },
  {
    id: 5,
    name: "Thiết kế Web với Figma",
    price: 450000,
    image: "/assets/figma.png",
    description: "Thực hành thiết kế website bằng Figma.",
    categoryId: 1,
    subcategoryId: 2,
    likes: 78
  },
  {
    id: 6,
    name: "UI/UX nâng cao: Animation và Micro Interaction",
    price: 630000,
    image: "/assets/uiux-advanced.png",
    description: "Cải thiện trải nghiệm người dùng với animation.",
    categoryId: 1,
    subcategoryId: 2,
    likes: 84
  },
  {
    id: 7,
    name: "Tiếng Anh giao tiếp cơ bản",
    price: 490000,
    image: "/assets/english.png",
    description: "Tự tin giao tiếp tiếng Anh chỉ sau 4 tuần.",
    categoryId: 1,
    subcategoryId: 3,
    likes: 142
  },
  {
    id: 8,
    name: "Tiếng Anh giao tiếp nâng cao",
    price: 750000,
    image: "/assets/english-advanced.png",
    description: "Luyện phản xạ và hội thoại nâng cao.",
    categoryId: 1,
    subcategoryId: 3,
    likes: 95
  },
  {
    id: 9,
    name: "Phát âm tiếng Anh chuẩn giọng Mỹ",
    price: 610000,
    image: "/assets/pronunciation.png",
    description: "Luyện phát âm từ cơ bản đến nâng cao.",
    categoryId: 1,
    subcategoryId: 3,
    likes: 87
  },
  {
    id: 10,
    name: "Học máy toàn diện",
    price: 110000,
    image: "/assets/ml.png",
    description: "Lý thuyết và bài tập về Machine Learning.",
    categoryId: 2,
    subcategoryId: 4,
    likes: 89
  },
  {
    id: 11,
    name: "Thuật toán căn bản",
    price: 120000,
    image: "/assets/algorithm.png",
    description: "Tư duy giải thuật, đệ quy, sắp xếp,...",
    categoryId: 2,
    subcategoryId: 4,
    likes: 132
  },
  {
    id: 12,
    name: "Tài liệu học React miễn phí",
    price: 890000,
    image: "/assets/doc-react.png",
    description: "PDF + link demo thực hành React.",
    categoryId: 2,
    subcategoryId: 4,
    likes: 155
  },
  {
    id: 13,
    name: "Bài tập C++ có lời giải",
    price: 100000,
    image: "/assets/cpp.png",
    description: "Tài liệu ôn luyện giải thuật C++ nâng cao.",
    categoryId: 2,
    subcategoryId: 4,
    likes: 117
  },
  {
    id: 14,
    name: "Thiết kế Poster chuyên nghiệp",
    price: 580000,
    image: "/assets/poster.png",
    description: "Học bố cục, màu sắc, font chữ qua bài mẫu.",
    categoryId: 2,
    subcategoryId: 5,
    likes: 74
  },
  {
    id: 15,
    name: "Adobe Illustrator nâng cao",
    price: 340000,
    image: "/assets/illustrator.png",
    description: "Cách vẽ logo, icon, poster sáng tạo.",
    categoryId: 2,
    subcategoryId: 5,
    likes: 70
  },
  {
    id: 16,
    name: "Canva cho nhà thiết kế không chuyên",
    price: 390000,
    image: "/assets/canva.png",
    description: "Thiết kế nhanh chóng với Canva.",
    categoryId: 2,
    subcategoryId: 5,
    likes: 81
  },
  {
    id: 17,
    name: "Luyện thi TOEIC 2025",
    price: 460000,
    image: "/assets/toeic.png",
    description: "Ngữ pháp, từ vựng, đề luyện tập thực tế.",
    categoryId: 2,
    subcategoryId: 6,
    likes: 120
  },
  {
    id: 18,
    name: "Bộ đề ôn luyện IELTS Listening",
    price: 650000,
    image: "/assets/ielts.png",
    description: "Thực hành nghe theo chuẩn đề thi thật.",
    categoryId: 2,
    subcategoryId: 6,
    likes: 103
  },
  {
    id: 19,
    name: "Chiến lược làm bài thi TOEFL",
    price: 730000,
    image: "/assets/toefl.png",
    description: "Tips và bài mẫu cho phần đọc, nghe, viết.",
    categoryId: 2,
    subcategoryId: 6,
    likes: 76
  }
];

export default mockCourses;
