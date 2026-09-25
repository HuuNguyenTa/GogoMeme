// mockData.js - Dữ liệu chuẩn cho Trạm Yêu Thương (Dự án SSG105)

export const ANIMALS = [
  {
    id: 'dog-bo',
    name: 'Bé Bơ',
    type: 'dog',
    breed: 'Shiba Inu lai',
    age: 'Khoảng 7 tháng tuổi',
    personality: 'Hiền lành, quấn người, thích được xoa đầu',
    story: 'Được tìm thấy dưới gầm ghế đá công viên trong một đêm mưa lớn. Bé rất thích ăn chuối và luôn vẫy đuôi mừng mỗi khi có người đến gần.',
    avatar: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=600&auto=format&fit=crop&q=80',
    tags: ['Ngoan ngoãn', 'Thích ôm', 'Đã tiêm phòng'],
    status: 'Đang chờ mái ấm',
    has3DModel: true,
    modelType: 'dog'
  },
  {
    id: 'cat-may',
    name: 'Bé Mây',
    type: 'cat',
    breed: 'Mèo mướp Tabby',
    age: 'Khoảng 1 tuổi',
    personality: 'Rụt rè lúc đầu, thích sưởi nắng và nghe tiếng thì thầm',
    story: 'Bị bỏ lại trong một chiếc thùng xốp bên vệ đường. Ban đầu bé rất sợ người, nhưng nay đã biết cọ má nũng nịu đòi vuốt ve.',
    avatar: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
    tags: ['Trầm tính', 'Thích ngủ nướng', 'Đã triệt sản'],
    status: 'Đang ở trạm tạm thời',
    has3DModel: true,
    modelType: 'cat'
  },
  {
    id: 'dog-hatde',
    name: 'Bé Hạt Dẻ',
    type: 'dog',
    breed: 'Corgi lai cỏ',
    age: 'Khoảng 5 tháng tuổi',
    personality: 'Năng động, tò mò, thích chạy vòng quanh nhặt lá',
    story: 'Lạc mẹ khi chỉ mới 2 tháng tuổi ở một khu chợ cũ. Đôi chân ngắn cũn và đôi tai to vểnh luôn khiến mọi người bật cười vì sự đáng yêu.',
    avatar: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&auto=format&fit=crop&q=80',
    tags: ['Vui vẻ', 'Chân ngắn đáng yêu', 'Đã tẩy giun'],
    status: 'Đang chờ nhận nuôi',
    has3DModel: false,
    modelType: 'dog'
  },
  {
    id: 'cat-miumiu',
    name: 'Bé Miu Miu',
    type: 'cat',
    breed: 'Mèo tam thể',
    age: 'Khoảng 8 tháng tuổi',
    personality: 'Tinh nghịch, mắt to tròn, rất thích bắt bóng len',
    story: 'Được các bạn sinh viên cứu khi mắc kẹt trên mái tôn cũ. Miu Miu có bộ lông ba màu may mắn và tiếng kêu "meo" nhỏ xíu rất ngọt ngào.',
    avatar: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&auto=format&fit=crop&q=80',
    tags: ['May mắn', 'Thích chơi đùa', 'Ăn ngoan'],
    status: 'Đang chờ nhận nuôi',
    has3DModel: false,
    modelType: 'cat'
  },
  {
    id: 'dog-dom',
    name: 'Bé Đốm',
    type: 'dog',
    breed: 'Chó ta chân trắng',
    age: 'Khoảng 1.5 tuổi',
    personality: 'Trung thành, thông minh, luôn cảnh giác bảo vệ bạn bè',
    story: 'Bé từng bị bỏ đói và lang thang qua nhiều khu phố trước khi được tình nguyện viên đón về. Đốm rất hiểu chuyện và biết lắng nghe.',
    avatar: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
    tags: ['Thông minh', 'Biết trông nhà', 'Kiên nhẫn'],
    status: 'Cần một người bạn kiên nhẫn',
    has3DModel: false,
    modelType: 'dog'
  },
  {
    id: 'cat-bong',
    name: 'Bé Bông',
    type: 'cat',
    breed: 'Mèo trắng mắt hai màu',
    age: 'Khoảng 6 tháng tuổi',
    personality: 'Nhẹ nhàng như mây, thích cuộn tròn trên chăn ấm',
    story: 'Bé có một bên mắt xanh ngọc bích và một bên mắt vàng hổ phách. Bông là "thiên thần nhỏ" sưởi ấm lòng mọi tình nguyện viên tại trạm.',
    avatar: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=600&auto=format&fit=crop&q=80',
    tags: ['Mắt hai màu', 'Thích sưởi ấm', 'Hiền từ'],
    status: 'Đang chờ mái ấm',
    has3DModel: false,
    modelType: 'cat'
  }
];

/**
 * Helper to resolve the public sender display name with fallback
 * If null, undefined, empty, or whitespace-only -> "Một người bạn ẩn danh"
 */
export function getPublicSenderName(wish) {
  if (!wish) return 'Một người bạn ẩn danh';
  const raw = wish.senderDisplayName ?? wish.sender_display_name ?? wish.sender;
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (trimmed.length > 0) return trimmed;
  }
  return 'Một người bạn ẩn danh';
}

export const SAMPLE_WISHES = [
  {
    id: 'w-1',
    animalId: 'dog-bo',
    animalName: 'Bé Bơ',
    animalType: 'dog',
    variant: 'golden',
    message: 'Mong em sớm tìm được một người ba người mẹ thực sự yêu thương em suốt đời!',
    senderDisplayName: 'Thanh Thảo',
    sender_display_name: 'Thanh Thảo',
    date: 'Hôm nay',
    x: 16,
    y: 34,
    status: 'approved'
  },
  {
    id: 'w-2',
    animalId: 'cat-may',
    animalName: 'Bé Mây',
    animalType: 'cat',
    variant: 'tabby',
    message: 'Em đừng sợ sấm sét nữa nhé, trạm luôn có vòng tay ấm chờ che chở cho em.',
    senderDisplayName: 'Minh Khang',
    sender_display_name: 'Minh Khang',
    date: 'Hôm qua',
    x: 34,
    y: 24,
    status: 'approved'
  },
  {
    id: 'w-3',
    animalId: 'dog-hatde',
    animalName: 'Bé Hạt Dẻ',
    animalType: 'dog',
    variant: 'corgi',
    message: 'Cặp chân ngắn lon ton chúc em luôn vui tươi và mau có sân cỏ rộng để chạy nhảy!',
    senderDisplayName: 'Hương Giang',
    sender_display_name: 'Hương Giang',
    date: '2 ngày trước',
    x: 52,
    y: 40,
    status: 'approved'
  },
  {
    id: 'w-4',
    animalId: 'cat-miumiu',
    animalName: 'Bé Miu Miu',
    animalType: 'cat',
    variant: 'calico',
    message: 'Tam thể mang lại bình an, mong một gia đình tử tế sẽ nhìn thấy đôi mắt sáng của em.',
    senderDisplayName: 'An Nhiên',
    sender_display_name: 'An Nhiên',
    date: '3 ngày trước',
    x: 70,
    y: 28,
    status: 'approved'
  },
  {
    id: 'w-5',
    animalId: 'dog-dom',
    animalName: 'Bé Đốm',
    animalType: 'dog',
    variant: 'spotted',
    message: 'Cảm ơn em vì đã kiên cường vượt qua những ngày khó khăn. Em xứng đáng có một mái nhà ấm êm!',
    senderDisplayName: 'Bảo Trâm',
    sender_display_name: 'Bảo Trâm',
    date: '4 ngày trước',
    x: 84,
    y: 48,
    status: 'approved'
  },
  {
    id: 'w-6',
    animalId: 'cat-bong',
    animalName: 'Bé Bông',
    animalType: 'cat',
    variant: 'white',
    message: 'Gửi ngàn cái ôm ấm áp đến bé Bông mắt ngọc, mùa đông này em không còn lạnh nữa đâu.',
    senderDisplayName: null, // Test public fallback "Một người bạn ẩn danh"
    sender_display_name: null,
    date: '5 ngày trước',
    x: 26,
    y: 60,
    status: 'approved'
  },
  {
    id: 'w-7',
    animalId: 'cat-mochi',
    animalName: 'Bé Mochi',
    animalType: 'cat',
    variant: 'cream',
    message: 'Mochi bé bỏng mau ăn chóng lớn nhé, chiếc bụng tròn xoe đáng yêu lắm!',
    senderDisplayName: 'Thu Hà',
    sender_display_name: 'Thu Hà',
    date: 'Hôm nay',
    x: 64,
    y: 65,
    status: 'approved'
  },
  {
    id: 'w-8',
    animalId: 'cat-mun',
    animalName: 'Bé Mun',
    animalType: 'cat',
    variant: 'black',
    message: 'Chú mèo đen may mắn của trạm, mong em tìm được một người bạn tâm giao trọn đời.',
    senderDisplayName: null, // Test public fallback "Một người bạn ẩn danh"
    sender_display_name: null,
    date: 'Hôm qua',
    x: 12,
    y: 70,
    status: 'approved'
  },
  {
    id: 'w-9',
    animalId: 'cat-khoi',
    animalName: 'Bé Khói',
    animalType: 'cat',
    variant: 'gray',
    message: 'Đôi mắt Khói từng buồn nhưng nay đã có nụ cười rồi. Yêu em thật nhiều thiên thần nhỏ!',
    senderDisplayName: 'Kim Ngân',
    sender_display_name: 'Kim Ngân',
    date: '3 ngày trước',
    x: 44,
    y: 72,
    status: 'approved'
  },
  {
    id: 'w-10',
    animalId: 'dog-banhbao',
    animalName: 'Bé Bánh Bao',
    animalType: 'dog',
    variant: 'white-dog',
    message: 'Cục bông trắng tròn trĩnh chúc em luôn được cưng chiều và quấn quýt bên mái ấm mới.',
    senderDisplayName: null, // Test public fallback "Một người bạn ẩn danh"
    sender_display_name: null,
    date: '2 ngày trước',
    x: 82,
    y: 74,
    status: 'approved'
  }
];

export const RESCUE_SCENARIOS = [
  {
    id: 'sc-1',
    displayOrder: 1,
    principle: 'DỪNG',
    principleTitle: 'DỪNG: An toàn giao thông & Bình tĩnh tiếp cận',
    title: 'Tình huống 1: Gặp chó mèo bị thương sát làn xe chạy',
    situationBadge: 'An toàn hiện trường',
    sceneType: 'roadside',
    animalType: 'dog',
    animalName: 'Bé cún nhỏ',
    options: [
      {
        id: 'opt-a',
        actionLabel: 'Lao ra bế ngay',
        text: 'Lao ngay ra giữa dải phân cách bế thốc chú cún lên xe máy để phóng đi cấp cứu.'
      },
      {
        id: 'opt-b',
        actionLabel: 'Dừng an toàn & Giữ cự ly',
        text: 'Dừng xe sát lề, bật đèn cảnh báo và giữ cự ly 3-5m giúp bảo vệ bạn và ngăn cún hoảng loạn lao ra đường.'
      },
      {
        id: 'opt-c',
        actionLabel: 'Bấm còi dồn bé chạy',
        text: 'Bấm còi xe liên tục để các xe khác né ra, đồng thời vẫy tay quát to dồn bé chạy vào lề.'
      }
    ],
    recommendedAnswer: 'opt-b',
    supportiveNote: 'Lòng trắc ẩn muốn cứu bé ngay là rất đáng quý, nhưng sự vội vã có thể đẩy cả bạn và bé vào làn xe nguy hiểm.',
    explanation: 'Thú nhỏ khi bị thương hoặc hoảng loạn rất dễ cắn phòng vệ hoặc lao ra giữa dòng xe.',
    sceneReactions: {
      safeZone: true,
      calmAnimal: true,
      contactSignal: false
    }
  },
  {
    id: 'sc-2',
    displayOrder: 2,
    principle: 'NHÌN',
    principleTitle: 'NHÌN: Nhận biết thân nhiệt & Nhu cầu sinh tồn',
    title: 'Tình huống 2: Mèo con sơ sinh bị bỏ rơi trong thùng giấy',
    situationBadge: 'Sơ cứu mèo sơ sinh',
    sceneType: 'box',
    animalType: 'cat',
    animalName: 'Ba bé mèo con',
    options: [
      {
        id: 'opt-a',
        actionLabel: 'Ủ ấm & Tìm sữa chuyên dụng',
        text: 'Ủ ấm khẩn cấp bằng khăn mềm bọc chai nước ấm là điều sống còn đầu tiên đối với mèo con chưa mở mắt.'
      },
      {
        id: 'opt-b',
        actionLabel: 'Cho uống sữa đặc có đường',
        text: 'Mua ngay một hộp sữa đặc có đường hoặc sữa bò tiệt trùng pha thật ngọt cho các bé bú no bụng.'
      },
      {
        id: 'opt-c',
        actionLabel: 'Tắm xà phòng sấy nóng',
        text: 'Đem các bé đi tắm xà phòng diệt khuẩn ngay cho sạch sẽ rồi dùng máy sấy tóc công suất lớn sấy khô.'
      }
    ],
    recommendedAnswer: 'opt-a',
    supportiveNote: 'Nhiều người thường nghĩ sữa bò là nguồn dinh dưỡng tốt, nhưng đối với mèo sơ sinh thì lại là mối nguy hại lớn.',
    explanation: 'Mèo con chưa mở mắt không tiêu hóa được sữa bò, uống vào sẽ bị tiêu chảy cấp dẫn đến tử vong. Chúng cũng chưa thể tự điều hòa thân nhiệt.',
    sceneReactions: {
      safeZone: true,
      calmAnimal: true,
      warmthAura: true,
      contactSignal: false
    }
  },
  {
    id: 'sc-3',
    displayOrder: 3,
    principle: 'GIÚP',
    principleTitle: 'GIÚP: Cấp nước từ xa & Xoa dịu nỗi sợ',
    title: 'Tình huống 3: Bé cún bị bỏ quên đói khát và sủa dữ dội',
    situationBadge: 'Xử lý tâm lý hoảng loạn',
    sceneType: 'empty-lot',
    animalType: 'dog',
    animalName: 'Bé cún hoảng sợ',
    options: [
      {
        id: 'opt-a',
        actionLabel: 'Quát nạt đe dọa tháo xích',
        text: 'Cầm gậy dài quát nạt lớn tiếng để bé sợ hãi im lặng rồi vội vàng lao vào tháo xích.'
      },
      {
        id: 'opt-b',
        actionLabel: 'Cấp nước sạch từ xa & Gọi hỗ trợ',
        text: 'Đặt tô nước sạch và một ít thức ăn nhẹ ở cự ly an toàn, lùi lại để bé tự do uống giải nhiệt, đồng thời liên hệ đội cứu trợ có kìm cắt xích và lồng bảo hộ.'
      },
      {
        id: 'opt-c',
        actionLabel: 'Cho ăn nhiều dầu mỡ tại chỗ',
        text: 'Ném ngay cho bé một bọc xương ống lớn và thức ăn thừa nhiều dầu mỡ xào cay.'
      }
    ],
    recommendedAnswer: 'opt-b',
    supportiveNote: 'Cảm giác muốn tháo xích ngay cho bé là rất dễ hiểu, nhưng thú nhỏ khi kiệt sức và căng thẳng tột độ sẽ cắn vào tay bạn theo phản xạ tự vệ.',
    explanation: 'Hành vi sủa gắt gỏng khi bị xích kẹt là phản xạ tự vệ do say nắng và bị dồn vào đường cùng, không phải do hung dữ.',
    sceneReactions: {
      safeZone: true,
      calmAnimal: true,
      waterBowl: true,
      contactSignal: true
    }
  },
  {
    id: 'sc-4',
    displayOrder: 4,
    principle: 'GỌI',
    principleTitle: 'GỌI: Biết giới hạn & Kết nối người có chuyên môn',
    title: 'Tình huống 4: Bé mèo mắc kẹt trên mái tôn cao nguy hiểm',
    situationBadge: 'Cứu nạn độ cao',
    sceneType: 'rooftop',
    animalType: 'cat',
    animalName: 'Bé mèo kẹt mái',
    options: [
      {
        id: 'opt-a',
        actionLabel: 'Tự trèo lên mái bắt',
        text: 'Tự mình trèo bám vào đường ống nước lên mép tôn bắt bé dù không có thang hay dây bảo hộ.'
      },
      {
        id: 'opt-b',
        actionLabel: 'Căng đệm hứng & Gọi cứu trợ',
        text: 'Đặt đệm xốp hoặc căng bạt hứng bên dưới đề phòng bé trượt ngã, giữ yên tĩnh và GỌI ngay đội cứu trợ/cứu nạn có thang chuyên dụng.'
      },
      {
        id: 'opt-c',
        actionLabel: 'Ném đá dồn bé nhảy',
        text: 'Đứng dưới đất lấy đá nhỏ hoặc cành cây ném lên mái để dồn bé hoảng sợ tự nhảy xuống đất.'
      }
    ],
    recommendedAnswer: 'opt-b',
    supportiveNote: 'Sự sốt sắng trèo lên cứu là bản năng tốt, nhưng tai nạn độ cao có thể gây chấn thương nghiêm trọng cho cả bạn và thú nhỏ.',
    explanation: 'Mái tôn trơn nóng khiến mèo dễ hoảng loạn. Tự trèo lên cứu sẽ làm mèo sợ hãi, nhảy xuống gây gãy xương hoặc dập nội tạng.',
    sceneReactions: {
      safeZone: true,
      calmAnimal: true,
      contactSignal: true
    }
  }
];

export const RESCUE_CENTERS = [
  {
    id: 'rc-1',
    name: 'Trạm Cứu Hộ Động Vật Sài Gòn Time (SGT)',
    city: 'TP. Hồ Chí Minh',
    district: 'Huyện Bình Chánh / TP. Thủ Đức',
    phone: '090 123 4567',
    facebookUrl: 'https://facebook.com',
    description: 'Một trong những mái ấm lâu năm cưu mang hàng trăm bé chó mèo già yếu, khuyết tật và bị bạo hành.',
    verifiedDate: 'Tháng 09/2026'
  },
  {
    id: 'rc-2',
    name: 'SAR - Saigon Animal Rescue',
    city: 'TP. Hồ Chí Minh',
    district: 'Quận 7 / Nhà Bè',
    phone: '093 888 9911',
    facebookUrl: 'https://facebook.com',
    description: 'Đội ngũ tình nguyện viên phản ứng nhanh hỗ trợ các ca tai nạn giao thông và tìm nhà mới cho chó mèo.',
    verifiedDate: 'Tháng 09/2026'
  },
  {
    id: 'rc-3',
    name: 'Hà Nội Pet Adoption',
    city: 'Hà Nội',
    district: 'Quận Đống Đa / Cầu Giấy',
    phone: '096 777 8822',
    facebookUrl: 'https://facebook.com',
    description: 'Tổ chức tình nguyện hoạt động từ năm 2015, thúc đẩy nhận thức triệt sản, tiêm phòng và cứu trợ thú cưng.',
    verifiedDate: 'Tháng 09/2026'
  },
  {
    id: 'rc-4',
    name: 'Sân Nhà Nhiều Chó (Hà Nội)',
    city: 'Hà Nội',
    district: 'Huyện Gia Lâm / Long Biên',
    phone: '091 445 6677',
    facebookUrl: 'https://facebook.com',
    description: 'Mái nhà ấm áp dành cho các bé chó mèo bị bỏ rơi, tổ chức các buổi gặp gỡ nhận nuôi hàng tháng.',
    verifiedDate: 'Tháng 08/2026'
  },
  {
    id: 'rc-5',
    name: 'Đà Nẵng Animal Rescue (DAR)',
    city: 'Đà Nẵng',
    district: 'Quận Sơn Trà / Hải Châu',
    phone: '098 333 4455',
    facebookUrl: 'https://facebook.com',
    description: 'Mạng lưới kết nối các phòng khám thú y và tình nguyện viên cứu nạn động vật tại miền Trung.',
    verifiedDate: 'Tháng 09/2026'
  },
  {
    id: 'rc-6',
    name: 'Nhóm Cứu Trợ Động Vật Cần Thơ',
    city: 'Cần Thơ',
    district: 'Quận Ninh Kiều',
    phone: '094 555 6688',
    facebookUrl: 'https://facebook.com',
    description: 'Cộng đồng sinh viên và người yêu động vật đồng bằng sông Cửu Long chăm sóc các bé cơ nhỡ.',
    verifiedDate: 'Tháng 08/2026'
  }
];

export const PROJECT_STATS = {
  productsSold: 'Đang cập nhật',
  fundRaised: 'Đang cập nhật',
  totalWishes: '2.400+',
  participants: '1.250+',
  sheltersConnected: '6+'
};

// Dữ liệu so sánh trực quan lấy cảm hứng từ phương pháp SavePet
// Nhấn mạnh: "Đúng lúc & đúng cách quan trọng hơn chỉ thương xót thụ động"
export const COMPARISON_DATA = {
  headline: 'Đừng chỉ xót xa, hãy cứu giúp đúng cách.',
  subheadline: 'Can thiệp bằng kiến thức khoa học và sự bình tĩnh chính là chìa khóa mở ra cơ hội sống sót cao nhất cho một sinh mệnh gặp nạn.',
  rows: [
    {
      category: 'Tiếp cận ban đầu',
      traditional: 'Chỉ dừng lại chụp ảnh/quay clip đăng mạng xã hội cầu cứu vu vơ; tiến lại quá nhanh khiến con vật sợ hãi lao ra làn xe nguy hiểm.',
      tramYeuThuong: 'Áp dụng quy tắc DỪNG - NHÌN an toàn: Đứng ở cự ly an toàn, hạ thấp người, nói giọng trầm ấm, kiểm tra giao thông trước khi bước tới.'
    },
    {
      category: 'Sơ cứu & Ăn uống',
      traditional: 'Cho uống sữa đặc có đường, sữa bò tươi hoặc cho ăn vụn xương gà, thức ăn nhiều muối ớt... gây tiêu chảy cấp và tắc ruột tử vong.',
      tramYeuThuong: 'Ưu tiên cấp NƯỚC SẠCH trước tiên; giữ ấm bằng khăn khô/áo cũ; chỉ dùng pate loãng, cháo thịt nạc hoặc sữa Bio-Milk chuyên dụng thú cưng.'
    },
    {
      category: 'Kết nối cứu trợ',
      traditional: 'Spam hàng chục bài viết không ghi rõ địa chỉ cụ thể, không để lại số liên lạc hiện trường, khiến đội cứu hộ không thể xác định vị trí.',
      tramYeuThuong: 'Tra cứu danh bạ trạm cứu trợ theo khu vực; cung cấp mốc địa chỉ rõ ràng, hình ảnh chấn thương thực tế và số điện thoại người phát hiện.'
    },
    {
      category: 'Cam kết lâu dài',
      traditional: 'Nhận nuôi theo cảm tính bốc đồng khi còn nhỏ, sau đó bỏ rơi khi bé bị bệnh, đến mùa thay lông hoặc khi gia đình chuyển chỗ ở.',
      tramYeuThuong: 'Thúc đẩy phong trào "Nhận nuôi có trách nhiệm": Cam kết tiêm phòng định kỳ, triệt sản nhân đạo và xem thú cưng là thành viên trọn đời.'
    }
  ],
  insightCards: [
    {
      id: 'insight-1',
      badge: 'Tâm lý học loài vật',
      title: 'Hiểu nỗi sợ của thú nhỏ hoảng loạn',
      desc: 'Khi hoảng sợ hoặc đau đớn, ánh mắt lờ đờ, đồng tử giãn to, tai cụp sát đầu và tiếng gầm gừ nhỏ không phải là "hung dữ", mà là cơ chế tự vệ cuối cùng. Hãy kiên nhẫn cho bé thời gian bình tâm.',
      tag: 'Lời khuyên chuyên gia'
    },
    {
      id: 'insight-2',
      badge: 'Quy tắc giờ vàng',
      title: '3 điều tuyệt đối KHÔNG làm khi cứu hộ',
      desc: '1. Không nắm giật đuôi hay xốc nách khi nghi ngờ gãy xương. 2. Không tự ý cho uống thuốc giảm đau của người (Paracetamol cực độc cho mèo). 3. Không ép ăn khi bé đang hạ thân nhiệt run rẩy.',
      tag: 'An toàn thú y'
    }
  ]
};

// 4 Lớp bảo vệ phát triển cho sinh mạng thú nhỏ
export const PROTECTION_LAYERS = [
  {
    step: '01',
    label: 'Vòng tiếp cận',
    title: 'Tiếp cận An Toàn & Trấn An',
    desc: 'Quan sát giao thông xung quanh, giữ cự ly an toàn, tạo sự tin cậy bằng giọng nói dịu dàng và không dồn ép con vật vào góc kẹt nguy hiểm.',
    accent: '#ff7e54',
    bg: '#fff5ef'
  },
  {
    step: '02',
    label: 'Vòng sinh tồn',
    title: 'Sơ Cứu & Dinh Dưỡng Cơ Bản',
    desc: 'Che chắn gió mưa, ủ ấm thân nhiệt bằng khăn/thùng carton đục lỗ thông khí, cấp nước sạch và tuyệt đối không cho ăn thức ăn lạ có hại.',
    accent: '#52a37b',
    bg: '#f0f9f4'
  },
  {
    step: '03',
    label: 'Vòng kết nối',
    title: 'Kết Nối Trạm Cứu Hộ Xác Thực',
    desc: 'Liên hệ các cơ sở bảo trợ động vật uy tín gần nhất trong danh bạ khu vực, gửi ảnh tình trạng và tọa độ chính xác để được điều phối bác sĩ thú y.',
    accent: '#8a63d2',
    bg: '#f6f2fd'
  },
  {
    step: '04',
    label: 'Vòng bền vững',
    title: 'Mái Ấm Vĩnh Viễn & Triệt Sản',
    desc: 'Phục hồi tâm lý, hoàn thành phác đồ vaccine - triệt sản và tìm kiếm người nhận nuôi có phỏng vấn cam kết trách nhiệm suốt vòng đời.',
    accent: '#fbb040',
    bg: '#fff9ed'
  }
];

// Giải đáp trước khi bạn đồng hành (FAQ tương tác)
export const FAQ_ITEMS = [
  {
    id: 'faq-1',
    question: 'Làm sao để biết một bé chó mèo đang thực sự bị bỏ rơi hay chỉ đi dạo gần nhà?',
    category: 'Nhận biết',
    answer: 'Hãy quan sát vòng cổ, độ sạch của lông và hành vi của bé trong 15-30 phút. Nếu bé có vòng cổ gắn thẻ tên, lông chải chuốt sạch sẽ và bình tĩnh đi lại, nhiều khả năng bé sống gần đó. Nếu bé gầy trơ xương, lông bết bẩn, co ro run rẩy hoặc tìm bới rác trong trạng thái hoảng sợ, bé đang rất cần sự hỗ trợ của bạn.'
  },
  {
    id: 'faq-2',
    question: 'Có nên bắt ngay một chú mèo con sơ sinh khi thấy bé nằm một mình?',
    category: 'Cứu hộ mèo con',
    answer: 'KHOAN VỘI! Mèo mẹ thường để con ở nơi kín đáo và đi kiếm thức ăn trong vòng 2-4 tiếng. Hãy quan sát từ xa (khoảng 5-10 mét) trong vài giờ. Nếu sau hơn 4 tiếng mèo mẹ không quay lại, hoặc các bé kêu khóc dữ dội vì lạnh/kiến bu, hãy can thiệp: ủ ấm bằng khăn mềm ngay lập tức và liên hệ bác sĩ thú y để xin sữa chuyên dụng cho mèo con sơ sinh.'
  },
  {
    id: 'faq-3',
    question: 'Có nên cho chó mèo con uống sữa bò tươi (Vinamilk, sữa đặc Ông Thọ)?',
    category: 'Dinh dưỡng khẩn cấp',
    answer: 'TUYỆT ĐỐI KHÔNG. Đa phần chó mèo con thiếu enzyme Lactase nên không thể tiêu hóa đường lactose trong sữa bò. Cho uống sữa bò thông thường sẽ gây chướng hơi, tiêu chảy cấp và mất nước dẫn đến tử vong rất nhanh.'
  },
  {
    id: 'faq-4',
    question: 'GoGo & MeMe có phải là đội cứu hộ hiện trường trực tiếp 24/7 không?',
    category: 'Về dự án SSG105',
    answer: 'Không. "GoGo & MeMe" là dự án cộng đồng sinh viên phi lợi nhuận thuộc môn học SSG105. Dự án mang sứ mệnh nâng cao nhận thức, trang bị cẩm nang kỹ năng xử lý đúng đắn và kết nối danh bạ trạm cứu hộ đã xác minh.'
  },
  {
    id: 'faq-5',
    question: 'Tôi muốn nhận nuôi một bé trong Trạm thì quy trình như thế nào?',
    category: 'Nhận nuôi',
    answer: 'Rất tuyệt vời! Quy trình nhận nuôi nhân đạo bao gồm: 1. Đăng ký thông tin và nguyện vọng; 2. Phỏng vấn ngắn về điều kiện nơi ở và sự đồng thuận của gia đình; 3. Đến thăm và làm quen với bé; 4. Ký cam kết triệt sản và cập nhật tình hình sau nhận nuôi định kỳ. Mọi thủ tục đều hoàn toàn miễn phí, vì mục tiêu duy nhất là mang lại mái ấm trọn đời an toàn cho các bé.'
  },
  {
    id: 'faq-6',
    question: 'Nếu tôi không có điều kiện tài chính hoặc chỗ ở, tôi có thể đóng góp gì?',
    category: 'Đồng hành',
    answer: 'Lòng tốt không đo bằng tiền bạc! Bạn có thể: Gửi những lời chúc yêu thương vào Trạm Ảo; chia sẻ các bài viết giúp tuyền truyền nâng cao ý thức; ủng hộ các vật phẩm cũ (khăn bông, thau chậu, báo cũ, đệm cũ) cho các trạm cứu hộ địa phương; dọn chuồng tình nguyện vào dịp cuối tuần.'
  }
];


