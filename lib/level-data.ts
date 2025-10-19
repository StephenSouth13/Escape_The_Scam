export interface Question {
  title: string
  scenario: string
  answers: string[]
  correctAnswer: number
  explanation: string
  villainIcon: string
}

export interface Decoration {
  x: number
  y: number
  width: number
  height: number
  type: string
  emoji: string
  color: string
  glow?: boolean
}

export interface Chest {
  x: number
  y: number
  width: number
  height: number
  type: "life" | "data" | "power" | "virus"
  collected: boolean
}

export interface LevelData {
  name: string
  theme: string
  backgroundImage: string
  platforms: { x: number; y: number; width: number; height: number }[]
  enemies: {
    x: number
    y: number
    type: "laptop" | "camera" | "robot"
    questionId: number
  }[]
  patrolEnemies?: {
    x: number
    y: number
    type: "drone" | "virus" | "firewall"
    patrolStart: number
    patrolEnd: number
    patrolSpeed: number
  }[]
  portal: { x: number; y: number; width: number; height: number }
  questions: Question[]
  decorations: Decoration[]
  chests: Chest[]
}

export const levelData: LevelData[] = [
  // Level 1: Phishing Lobby
  {
    name: "Tầng 1: Nhận diện tin nhắn & đường link lừa đảo",
    theme: "dark cyber hotel lobby with neon lights",
    backgroundImage: "/dark-cyberpunk-hotel-lobby-with-neon-lights-and-glo.jpg",
    platforms: [
      { x: 0, y: 550, width: 1200, height: 50 },
      { x: 300, y: 450, width: 200, height: 20 },
      { x: 600, y: 350, width: 200, height: 20 },
      { x: 900, y: 450, width: 200, height: 20 },
    ],
    enemies: [
      { x: 400, y: 410, type: "laptop", questionId: 0 },
      { x: 700, y: 310, type: "laptop", questionId: 1 },
      { x: 1000, y: 410, type: "laptop", questionId: 2 },
    ],
    patrolEnemies: [
      { x: 200, y: 510, type: "drone", patrolStart: 100, patrolEnd: 280, patrolSpeed: 1.2 },
      { x: 500, y: 410, type: "virus", patrolStart: 300, patrolEnd: 500, patrolSpeed: 1.0 },
    ],
    portal: { x: 1050, y: 470, width: 80, height: 80 },
    decorations: [
      { x: 50, y: 480, width: 60, height: 60, type: "error-screen", emoji: "⚠️", color: "#ff3333", glow: true },
      { x: 150, y: 500, width: 40, height: 40, type: "reception", emoji: "🏨", color: "#00ffff", glow: true },
      { x: 550, y: 300, width: 50, height: 50, type: "glitch-sign", emoji: "🏢", color: "#ff00ff", glow: true },
    ],
    chests: [
      { x: 350, y: 420, width: 30, height: 30, type: "life", collected: false },
      { x: 650, y: 320, width: 30, height: 30, type: "data", collected: false },
    ],
    questions: [
      {
        title: "Câu 1: Tin nhắn trúng thưởng",
        scenario:
          'Bạn nhận được tin nhắn với đường link "http://gift-bank.vip" thông báo trúng thưởng 5 triệu đồng. Hành động nào là an toàn nhất?',
        answers: [
          "A. Bấm vào link để nhận quà",
          "B. Gửi link cho bạn bè để hỏi thử",
          "C. Bỏ qua, không nhấp vào và báo cáo tin nhắn lừa đảo",
          "D. Lưu lại để hôm sau kiểm tra",
        ],
        correctAnswer: 2,
        explanation:
          "Các đường link trúng thưởng là chiêu dụ đánh cắp thông tin cá nhân hoặc cài mã độc. Không nhấp vào, hãy báo cáo nhà mạng hoặc cơ quan chức năng.",
        villainIcon: "💻",
      },
      {
        title: "Câu 2: Website giả mạo",
        scenario: "Dấu hiệu nào cho thấy một website có khả năng giả mạo?",
        answers: [
          "A. Có biểu tượng ổ khóa trên thanh địa chỉ",
          "B. Tên miền lạ, lỗi chính tả, không có chứng chỉ bảo mật",
          "C. Giao diện hiện đại và nhiều quảng cáo",
          "D. Có liên kết tới trang báo uy tín",
        ],
        correctAnswer: 1,
        explanation:
          "Trang lừa đảo thường 'nhái' tên miền thật, thêm ký tự lạ hoặc không có 'https://' – chứng chỉ bảo mật SSL.",
        villainIcon: "💻",
      },
      {
        title: "Câu 3: Email yêu cầu OTP",
        scenario:
          'Bạn nhận được email nói rằng "Tài khoản của bạn có giao dịch bất thường, hãy nhập OTP để xác nhận". Bạn nên làm gì?',
        answers: [
          "A. Nhập ngay OTP để tránh bị khóa tài khoản",
          "B. Gọi tổng đài ngân hàng hoặc mở ứng dụng chính thức để kiểm tra",
          "C. Chụp màn hình gửi bạn bè xem giúp",
          "D. Trả lời lại email để hỏi thêm thông tin",
        ],
        correctAnswer: 1,
        explanation:
          "Ngân hàng thật không bao giờ yêu cầu cung cấp OTP qua email hoặc đường link. Hãy xác minh qua kênh chính thức.",
        villainIcon: "💻",
      },
    ],
  },
  // Level 2: Investment Trap
  {
    name: "Tầng 2: Lừa đảo tài chính & đầu tư",
    theme: "dark corridor with alarm lights and warning signs",
    backgroundImage: "/dark-corridor-with-red-alarm-lights-and-warning-si.jpg",
    platforms: [
      { x: 0, y: 550, width: 1200, height: 50 },
      { x: 200, y: 450, width: 150, height: 20 },
      { x: 450, y: 350, width: 150, height: 20 },
      { x: 700, y: 250, width: 150, height: 20 },
      { x: 950, y: 350, width: 150, height: 20 },
    ],
    enemies: [
      { x: 250, y: 410, type: "camera", questionId: 0 },
      { x: 500, y: 310, type: "camera", questionId: 1 },
      { x: 750, y: 210, type: "camera", questionId: 2 },
    ],
    patrolEnemies: [
      { x: 100, y: 510, type: "drone", patrolStart: 50, patrolEnd: 180, patrolSpeed: 1.3 },
      { x: 350, y: 410, type: "virus", patrolStart: 200, patrolEnd: 350, patrolSpeed: 1.1 },
      { x: 600, y: 310, type: "firewall", patrolStart: 450, patrolEnd: 600, patrolSpeed: 0.9 },
    ],
    portal: { x: 1050, y: 270, width: 60, height: 80 },
    decorations: [
      { x: 100, y: 500, width: 50, height: 50, type: "security-door", emoji: "🚪", color: "#ff0000", glow: true },
      { x: 400, y: 300, width: 40, height: 40, type: "lock", emoji: "🔒", color: "#ffff00", glow: true },
      { x: 650, y: 200, width: 45, height: 45, type: "alarm", emoji: "🚨", color: "#ff3333", glow: true },
    ],
    chests: [
      { x: 225, y: 420, width: 30, height: 30, type: "power", collected: false },
      { x: 725, y: 220, width: 30, height: 30, type: "data", collected: false },
    ],
    questions: [
      {
        title: "Câu 4: Dự án đầu tư ảo",
        scenario:
          'Một dự án gửi bạn "Hợp đồng đầu tư online" hứa lợi nhuận 60%/tháng, yêu cầu chuyển tiền trong 1 giờ. Dấu hiệu nào cho thấy đây là lừa đảo?',
        answers: [
          "A. Có giấy mời đầu tư và chữ ký điện tử",
          "B. Cam kết lãi suất quá cao, yêu cầu nộp tiền gấp",
          "C. Dự án có logo công ty rõ ràng",
          "D. Có người nổi tiếng quảng bá",
        ],
        correctAnswer: 1,
        explanation: "Các dự án đầu tư ảo thường hứa lãi cao phi lý và ép chuyển tiền nhanh để chiếm đoạt.",
        villainIcon: "📷",
      },
      {
        title: "Câu 5: Cuộc gọi giả danh công an",
        scenario:
          'Khi nhận cuộc gọi tự xưng "Công an điều tra rửa tiền" và yêu cầu chuyển tiền để chứng minh vô tội, bạn nên:',
        answers: [
          "A. Làm theo vì sợ liên lụy pháp lý",
          "B. Giữ bình tĩnh, kiểm tra lại thông tin qua cơ quan công an thật",
          "C. Hỏi họ số tài khoản để tra cứu",
          "D. Tắt máy ngay và bỏ qua",
        ],
        correctAnswer: 1,
        explanation:
          "Cơ quan công an không bao giờ yêu cầu chuyển tiền qua điện thoại. Cần xác minh thông tin chính thức.",
        villainIcon: "📷",
      },
      {
        title: "Câu 6: Báo cáo lừa đảo",
        scenario: "Khi cần trình báo vụ việc lừa đảo trực tuyến, bạn có thể liên hệ:",
        answers: [
          "A. Bộ Giáo dục và Đào tạo",
          "B. Cục An ninh mạng và phòng, chống tội phạm công nghệ cao (A05) – Bộ Công an",
          "C. Cục Thuế Việt Nam",
          "D. Sở Văn hóa – Thể thao – Du lịch",
        ],
        correctAnswer: 1,
        explanation:
          "A05 – Bộ Công an và Cục An toàn thông tin là hai đơn vị tiếp nhận, xử lý các vụ việc lừa đảo online.",
        villainIcon: "📷",
      },
    ],
  },
  // Level 3: Personal Security
  {
    name: "Tầng 3: Bảo mật cá nhân & ứng phó tống tiền",
    theme: "luxurious room with gold and money symbols",
    backgroundImage: "/luxurious-cyberpunk-room-with-holographic-gold-coi.jpg",
    platforms: [
      { x: 0, y: 550, width: 1200, height: 50 },
      { x: 150, y: 450, width: 180, height: 20 },
      { x: 400, y: 380, width: 180, height: 20 },
      { x: 650, y: 300, width: 180, height: 20 },
      { x: 900, y: 400, width: 180, height: 20 },
    ],
    enemies: [
      { x: 200, y: 410, type: "robot", questionId: 0 },
      { x: 450, y: 340, type: "robot", questionId: 1 },
      { x: 700, y: 260, type: "robot", questionId: 2 },
    ],
    patrolEnemies: [
      { x: 50, y: 510, type: "drone", patrolStart: 50, patrolEnd: 180, patrolSpeed: 1.2 },
      { x: 250, y: 410, type: "virus", patrolStart: 200, patrolEnd: 350, patrolSpeed: 1.0 },
      { x: 400, y: 310, type: "firewall", patrolStart: 450, patrolEnd: 600, patrolSpeed: 0.8 },
    ],
    portal: { x: 1000, y: 320, width: 60, height: 80 },
    decorations: [
      { x: 80, y: 490, width: 50, height: 50, type: "gold", emoji: "💰", color: "#ffd700", glow: true },
      { x: 350, y: 330, width: 55, height: 55, type: "ad-glitch", emoji: "📊", color: "#00ff00", glow: true },
      { x: 600, y: 250, width: 45, height: 45, type: "money", emoji: "💵", color: "#00ff00", glow: true },
    ],
    chests: [
      { x: 175, y: 420, width: 30, height: 30, type: "life", collected: false },
      { x: 675, y: 270, width: 30, height: 30, type: "power", collected: false },
    ],
    questions: [
      {
        title: "Câu 7: Tống tiền online",
        scenario:
          'Kẻ xấu gửi tin nhắn: "Chuyển 100 triệu nếu không sẽ phát tán ảnh riêng tư của bạn". Cách xử lý đúng là:',
        answers: [
          "A. Chuyển tiền ngay để bảo vệ hình ảnh",
          "B. Báo công an và giữ lại toàn bộ tin nhắn làm bằng chứng",
          "C. Chặn tin nhắn và im lặng",
          "D. Đăng tin lên mạng để nhờ người giúp",
        ],
        correctAnswer: 1,
        explanation: "Đây là hành vi tống tiền. Cần giữ bằng chứng (tin nhắn, tài khoản, thời gian) và trình báo ngay.",
        villainIcon: "🤖",
      },
      {
        title: "Câu 8: Phát hiện bị lừa",
        scenario: "Khi phát hiện bị lừa đảo chuyển tiền, bước đầu tiên cần làm là:",
        answers: [
          "A. Xóa lịch sử giao dịch để tránh bị phát hiện",
          "B. Báo ngay cho ngân hàng để khóa tài khoản và liên hệ công an",
          "C. Đợi vài giờ xem tiền có được hoàn lại không",
          "D. Đăng bài lên mạng xã hội nhờ hỗ trợ",
        ],
        correctAnswer: 1,
        explanation: "Báo ngân hàng sớm giúp phong tỏa giao dịch, tăng khả năng thu hồi tiền.",
        villainIcon: "🤖",
      },
      {
        title: "Câu 9: Thiết bị bị nhiễm mã độc",
        scenario: "Sau khi nghi ngờ thiết bị bị nhiễm mã độc, bạn nên:",
        answers: [
          "A. Quét virus, đổi mật khẩu và bật xác thực hai lớp",
          "B. Đăng nhập lại tài khoản cũ để kiểm tra dữ liệu",
          "C. Mở USB khả nghi để xem nội dung",
          "D. Chia sẻ thiết bị cho người khác kiểm tra giúp",
        ],
        correctAnswer: 0,
        explanation: "Quét virus và kích hoạt bảo mật 2FA là bước khôi phục thiết bị an toàn nhất.",
        villainIcon: "🤖",
      },
    ],
  },
  // Level 4: Deepfake & AI Boss
  {
    name: "Tầng 4: Deepfake & Bắt cóc ảo",
    theme: "glitchy digital space with distorted faces",
    backgroundImage: "/glitchy-digital-space-with-distorted-holographic-f.jpg",
    platforms: [
      { x: 0, y: 550, width: 1200, height: 50 },
      { x: 100, y: 450, width: 200, height: 20 },
      { x: 400, y: 350, width: 200, height: 20 },
      { x: 700, y: 450, width: 200, height: 20 },
      { x: 1000, y: 350, width: 150, height: 20 },
    ],
    enemies: [
      { x: 150, y: 410, type: "camera", questionId: 0 },
      { x: 450, y: 310, type: "camera", questionId: 1 },
      { x: 750, y: 410, type: "camera", questionId: 2 },
    ],
    patrolEnemies: [
      { x: 50, y: 510, type: "drone", patrolStart: 50, patrolEnd: 180, patrolSpeed: 1.4 },
      { x: 250, y: 410, type: "virus", patrolStart: 200, patrolEnd: 350, patrolSpeed: 1.2 },
      { x: 400, y: 310, type: "firewall", patrolStart: 450, patrolEnd: 600, patrolSpeed: 1.0 },
      { x: 550, y: 210, type: "drone", patrolStart: 700, patrolEnd: 850, patrolSpeed: 1.3 },
    ],
    portal: { x: 1050, y: 270, width: 60, height: 80 },
    decorations: [
      { x: 50, y: 490, width: 60, height: 60, type: "green-screen", emoji: "🎬", color: "#00ff00", glow: true },
      { x: 350, y: 300, width: 45, height: 45, type: "camera", emoji: "📹", color: "#ff00ff", glow: true },
      { x: 650, y: 400, width: 55, height: 55, type: "distorted-face", emoji: "👤", color: "#ff3333", glow: true },
      { x: 950, y: 300, width: 40, height: 40, type: "ai-core", emoji: "🧠", color: "#00ffff", glow: true },
    ],
    chests: [
      { x: 125, y: 420, width: 30, height: 30, type: "life", collected: false },
      { x: 725, y: 420, width: 30, height: 30, type: "data", collected: false },
      { x: 1025, y: 320, width: 30, height: 30, type: "power", collected: false },
    ],
    questions: [
      {
        title: "Câu 10: Video deepfake",
        scenario:
          "Bạn thấy video người thân cầu cứu, nhưng mắt không khớp khẩu hình, giọng nói méo. Đây là dấu hiệu của:",
        answers: [
          "A. Kết nối mạng yếu",
          "B. Video deepfake giả mạo",
          "C. Camera quay ngược sáng",
          "D. Lỗi phần mềm phát video",
        ],
        correctAnswer: 1,
        explanation: "Deepfake là công nghệ dùng AI để giả giọng nói và khuôn mặt nhằm lừa đảo người xem.",
        villainIcon: "📷",
      },
      {
        title: "Câu 11: Cuộc gọi video bắt cóc",
        scenario: "Bạn nhận cuộc gọi video, thấy hình ảnh người thân bị trói và kêu cứu. Bạn nên làm gì đầu tiên?",
        answers: [
          "A. Chuyển tiền ngay để đảm bảo an toàn",
          "B. Giữ bình tĩnh, gọi ngay cho người thân bằng số khác để kiểm tra",
          "C. Gọi lại cho số đó để hỏi rõ địa điểm",
          "D. Chia sẻ đoạn video lên mạng",
        ],
        correctAnswer: 1,
        explanation: "Đây có thể là chiêu deepfake giả bắt cóc. Luôn xác minh bằng kênh khác trước khi tin.",
        villainIcon: "📷",
      },
      {
        title: "Câu 12: Báo cáo bắt cóc online",
        scenario: "Nếu nghi ngờ gặp trường hợp bắt cóc online, bạn nên làm gì?",
        answers: [
          "A. Chuyển tiền trước rồi báo sau",
          "B. Giữ bằng chứng, gọi ngay 113 hoặc Cục A05 – Bộ Công an",
          "C. Xóa tin nhắn để không bị phát hiện",
          "D. Gửi video cho người khác để bình luận",
        ],
        correctAnswer: 1,
        explanation:
          "Cần lưu giữ bằng chứng (số điện thoại, tài khoản, video) và trình báo ngay cho công an để kịp thời xử lý.",
        villainIcon: "📷",
      },
    ],
  },
]
