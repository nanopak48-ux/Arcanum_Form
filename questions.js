const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxgUESprcw9yLtFET2vT1Lsyl8X_ARTDGqfFV6bA8bwpypGf36m5mbVrE9693bczGC3xQ/exec";

// จัดโครงสร้างเป็นหมวดหมู่ (Sections)
const formSections = [
  {
    sectionTitle: "PLAYER DATA",
    sectionDesc: "ข้อมูลพื้นฐานสำหรับการประมวลผล (เลือกตอบได้ตามสะดวก)",
    questions: [
      { id: "player_name", type: "text", label: "ชื่อ / นามแฝง", placeholder: "กรอกชื่อของคุณ", required: true },
      { id: "playtime", type: "select", label: "ระยะเวลาที่เล่น", options: ["ต่ำกว่า 10 นาที", "10–15 นาที", "มากกว่า 15 นาที"], required: true }
    ]
  },
  {
    sectionTitle: "SECTION GAMEPLAY",
    sectionDesc: "คำถามเกี่ยวกับระบบการเล่น ความสนุก และความยากง่าย",
    questions: [
      { id: "gameplay_rating", type: "star", label: "ความสนุกโดยรวมของ Gameplay", required: true },
      { id: "difficulty_rating", type: "star", label: "ระดับความยาก (1 = ง่ายไป, 5 = ยากไป)", required: true },
      { id: "recommend", type: "radio", label: "คุณจะแนะนำเกมนี้ให้เพื่อนหรือไม่?", options: ["แน่นอน", "อาจจะ", "ไม่ล่ะ"], required: true },
      { id: "gameplay_bugs", type: "textarea", label: "เจอบัคหรือปัญหาเกี่ยวกับ Gameplay บ้างไหม?", placeholder: "อธิบายสิ่งที่เกิดขึ้น...", required: false }
    ]
  },
  {
    sectionTitle: "SECTION AUDIO",
    sectionDesc: "ประเมินงานเสียง เอฟเฟกต์ และเพลงประกอบ",
    questions: [
      { id: "audio_rating", type: "star", label: "คุณภาพของเสียงและเพลงประกอบ", required: true },
      { id: "audio_feedback", type: "textarea", label: "ข้อเสนอแนะเรื่องเสียง", placeholder: "เช่น เพลงดังเกินไป, เอฟเฟกต์บางจุดเบาไป", required: false }
    ]
  },
  {
    sectionTitle: "SECTION ART",
    questions: [
      { id: "visual_rating", type: "star", label: "ความสวยงามของงานภาพและอาร์ตสไตล์", required: true },
      { id: "liked_most", type: "textarea", label: "ส่วนไหนของเกมที่คุณชอบมากที่สุด?", placeholder: "พิมพ์ความประทับใจของคุณ...", required: false }
    ]
  }
];