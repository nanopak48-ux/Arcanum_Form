const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxgUESprcw9yLtFET2vT1Lsyl8X_ARTDGqfFV6bA8bwpypGf36m5mbVrE9693bczGC3xQ/exec";

// จัดโครงสร้างเป็นหมวดหมู่ (Sections)
const formSections = [
  {
    sectionTitle: "PLAYER DATA",
    sectionDesc: "ข้อมูลพื้นฐานของผู้เล่นทดสอบ",
    questions: [
      { id: "PLAYER NAME", type: "text", label: "ชื่อ-นามสกุล / ชื่อเล่น", placeholder: "กรอกชื่อของคุณ", required: true },
      { id: "PLAYTIME", type: "select", label: "ระยะเวลาที่เล่น", options: ["ต่ำกว่า 10 นาที", "10–15 นาที", "มากกว่า 15 นาที"], required: true },
      { id: "AGE", type: "select", label: "อายุ", options: ["ต่ำกว่า 18 ปี", "18–25 ปี", "26–35 ปี", "36–45 ปี", "46 ปีขึ้นไป"], required: true },
      { id: "FAVORITE GENRE", type: "select", label: "แนวเกมที่ชอบ", options: ["แอ็กชัน", "ผจญภัย", "ปริศนา", "จำลองสถานการณ์", "กีฬา", "อื่น ๆ"], required: true },
      // ใช้แยกกลุ่มผู้เล่น: คนที่เล่นแนว Hack & Slash บ่อยกับมือใหม่ จะให้ความเห็นเรื่องความยากต่างกัน
      { id: "action_experience", type: "radio", label: "คุณเล่นเกมแอ็กชันแนว Hack & Slash (เช่น Genshin, ZZZ, Hollow Knight) บ่อยแค่ไหน?", options: ["แทบไม่เคยเล่น", "เล่นบ้างเป็นครั้งคราว", "เล่นเป็นประจำ"], required: true },
      { id: "control_device", type: "radio", label: "คุณเล่นด้วยอะไร?", options: ["คีย์บอร์ด + เมาส์", "Laptop Touchpad", "อื่น ๆ"], required: true },
      // บอกว่าผู้เล่นไปถึงไหน คำตอบส่วนอื่นจะได้ตีความถูก
      { id: "progress_reached", type: "select", label: "คุณเล่นไปถึงจุดไหน?", options: ["ยังไม่ผ่านศัตรูตัวแรก", "ผ่านศัตรูบางตัว", "ไปถึงบอส", "บอสเข้าเฟส 2", "ชนะบอส"], required: true },
      { id: "stars_earned", type: "select", label: "ถ้าชนะบอส ได้กี่ดาว?", options: [ "1 ดาว", "2 ดาว", "3 ดาว"], required: false }
    ]
  },
  {
    sectionTitle: "SECTION GAMEPLAY",
    sectionDesc: "คำถามเกี่ยวกับระบบการเล่น ความสนุก และความยากง่าย",
    questions: [
      { id: "gameplay_rating", type: "star", label: "ความสนุกโดยรวมของ Gameplay", required: true },
      { id: "difficulty_rating", type: "star", label: "ระดับความยาก (1 = ง่ายที่สุด, 5 = ยากเกินไป)", required: true },
      { id: "recommend", type: "radio", label: "คุณจะแนะนำเกมนี้ให้เพื่อนหรือไม่?", options: ["แนะนำ", "อาจจะแนะนำ", "ไม่แนะนำ"], required: true },
      { id: "gameplay_bugs", type: "textarea", label: "เจอบัคหรือปัญหาเกี่ยวกับ Gameplay บ้างไหม?", placeholder: "อธิบายสิ่งที่เกิดขึ้น...", required: false },
      // ชี้ว่าต้องปรับจุดไหนก่อน (บาลานซ์ / บทช่วยสอน)
      { id: "hardest_part", type: "select", label: "ส่วนไหนยากที่สุด?", options: ["ศัตรูทั่วไป", "ศัตรูยิงเวท", "ศัตรูถือโล่", "บอส เฟส 1", "บอส เฟส 2", "บอส เฟส 3", "การกระโดด / แพลตฟอร์ม", "ไม่มีส่วนไหนยากเกินไป"], required: false },
      { id: "pacing", type: "radio", label: "ความยาวของด่านเป็นอย่างไร", options: ["สั้นไป อยากเล่นต่อ", "พอดี", "ยาวไป เริ่มเบื่อ"], required: true },
      { id: "replay_interest", type: "radio", label: "คุณอยากเล่นด่านนี้ซ้ำเพื่อเก็บ 3 ดาวไหม?", options: ["อยาก", "เฉย ๆ", "ไม่อยาก"], required: false }
    ]
  },
  {
    sectionTitle: "SECTION COMBAT & CONTROLS",
    sectionDesc: "ระบบต่อสู้และการควบคุม",
    questions: [
      { id: "controls_rating", type: "star", label: "ระบบการเคลื่อนที่ตอบสนองดีมากเพียงใด", required: true },
      { id: "combat_feel_rating", type: "star", label: "ระบบ FEEDBACK หลังการโจมตีถูกศัตรูตอบสนองดีมากเพียงใด", required: true },
      // ระบบที่ผู้เล่นใช้จริง = ระบบที่ควรพัฒนาต่อ, ระบบที่ไม่มีคนใช้ = ต้องสอนให้ชัดขึ้นหรือตัดออก
      { id: "mechanics_used", type: "select", label: "ระบบการโจมตีไหนที่คุณใช้บ่อยที่สุด", options: ["โจมตีปกติ", "Parry", "Perfect Dodge (Dash ตอนโดนตี)", "Charged Attack (กดค้าง)", "Plunge Attack (S + คลิกซ้ายกลางอากาศ)", "Skill (E)", "Ultimate (Q)"], required: true },
      { id: "mechanics_unused", type: "select", label: "ระบบไหนที่คุณไม่รู้ว่ามี หรือไม่ได้ใช้เลย?", options: ["ใช้ครบทุกระบบ", "Parry", "Perfect Dodge", "Charged Attack / Counter", "Plunge Attack", "Upgrade (กด TAB ค้าง)", "Dash 2 ครั้ง"], required: false },
      // ถ้าคนแยกสีไม่ออก ต้องเปลี่ยนสัญญาณเตือน
      { id: "glint_clarity", type: "radio", label: "คุณแยกออกไหมว่า ประกายสีทอง = Parry ได้ และ ประกายสีแดง = ต้องหลบ?", options: ["แยกออกชัดเจน", "แยกออกบ้าง", "ไม่ทันสังเกต / ไม่เข้าใจ"], required: true },
      { id: "parry_timing", type: "radio", label: "จังหวะ Parry เป็นอย่างไร?", options: ["ง่ายไป", "พอดี", "ยากไป", "ไม่ได้ลอง"], required: false },
      { id: "control_issues", type: "textarea", label: "มีปุ่มหรือการควบคุมไหนที่รู้สึกไม่สะดวก?", placeholder: "เช่น อยากเปลี่ยนปุ่ม Dash, กระโดดแล้วรู้สึกหนืด", required: false }
    ]
  },
  {
    sectionTitle: "SECTION ENEMIES & BOSS",
    sectionDesc: "ศัตรูและบอส (ใช้ปรับความยากและออกแบบศัตรูใหม่)",
    questions: [
      { id: "enemy_variety_rating", type: "star", label: "ความหลากหลายของศัตรู", required: true },
      { id: "boss_rating", type: "star", label: "ความสนุกของการต่อสู้กับบอส", required: false },
      { id: "boss_understood", type: "radio", label: "คุณเข้าใจไหมว่าต้องตีคริสตัลหรือ Parry ลูกบอลคืนเพื่อทำดาเมจบอส?", options: ["เข้าใจตั้งแต่แรก", "เข้าใจหลังจากลองสักพัก", "ไม่เข้าใจ", "ยังไปไม่ถึงบอส"], required: false },
      { id: "unfair_attack", type: "textarea", label: "มีการโจมตีไหนที่รู้สึกว่าไม่แฟร์หรือหลบไม่ทัน?", placeholder: "เช่น อุกกาบาต, ลำแสง, Cataclysm, โล่ของ Brute", required: false }
    ]
  },
  {
    sectionTitle: "SECTION UI & PROGRESSION",
    sectionDesc: "หน้าจอ เมนู และระบบอัปเกรด",
    questions: [
      { id: "ui_clarity_rating", type: "star", label: "อ่านข้อมูลบนหน้าจอได้ง่ายแค่ไหน? (HP, Skill, ภารกิจ, ปุ่มแนะนำ)", required: true },
      // บอกว่าต้องมีบทช่วยสอนจริง ๆ หรือแค่ปุ่มแนะนำก็พอ
      { id: "tutorial_need", type: "radio", label: "คุณอยากให้มีบทสอนเล่น (Tutorial) แบบทีละขั้นไหม?", options: ["อยาก จำเป็นมาก", "มีก็ดี", "ไม่จำเป็น ปุ่มแนะนำก็พอ"], required: true },
      { id: "upgrade_rating", type: "star", label: "ความน่าสนใจของระบบอัปเกรด (HP / ATK / DEF / Skill / Ultimate)", required: false },
      { id: "upgrade_used", type: "radio", label: "คุณได้ใช้เมนูอัปเกรด (กด TAB ค้าง) ไหม?", options: ["ใช้ และรู้สึกว่าแข็งแกร่งขึ้น", "ใช้ แต่ไม่รู้สึกต่าง", "ไม่ได้ใช้ / ไม่รู้ว่ามี"], required: false }
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
      { id: "vfx_rating", type: "star", label: "เอฟเฟกต์ภาพ (การฟัน, ระเบิด, สกิล) ชัดเจนและสวยแค่ไหน?", required: false },
      { id: "liked_most", type: "textarea", label: "ส่วนไหนของเกมที่คุณชอบมากที่สุด?", placeholder: "พิมพ์ความประทับใจของคุณ...", required: false }
    ]
  },
  {
    sectionTitle: "SECTION FUTURE DEVELOPMENT",
    sectionDesc: "ความเห็นของคุณจะใช้กำหนดสิ่งที่พัฒนาต่อในเวอร์ชันถัดไป",
    questions: [
      // ลำดับความสำคัญของงานถัดไป
      { id: "next_priority", type: "select", label: "ถ้าเลือกได้ 1 อย่าง อยากให้พัฒนาอะไรต่อเป็นอย่างแรก?", options: ["ด่านใหม่ (ด่าน II–V)", "ศัตรูและบอสใหม่", "ท่าโจมตี / สกิลใหม่", "เนื้อเรื่องและตัวละคร", "งานภาพและแอนิเมชัน", "เสียงและเพลง", "ปรับบาลานซ์ความยาก", "แก้บัคและความลื่นไหล"], required: true },
      { id: "least_liked", type: "textarea", label: "ส่วนไหนที่คุณชอบน้อยที่สุด หรือคิดว่าควรเปลี่ยน?", placeholder: "บอกตรง ๆ ได้เลย จะได้นำไปปรับปรุง", required: false },
      { id: "feature_request", type: "textarea", label: "มีระบบหรือฟีเจอร์ไหนที่อยากให้เพิ่ม?", placeholder: "เช่น ระบบอาวุธ, Co-op, โหมดฝึกซ้อม, เลือกระดับความยาก", required: false },
      { id: "story_interest", type: "radio", label: "คุณอยากรู้เรื่องราวของแม่มดและโลก Arcanum เพิ่มไหม?", options: ["อยากมาก", "พอสนใจ", "ไม่สนใจ ขอเน้นต่อสู้"], required: false },
      // วัดว่าผู้เล่นสนใจเกมเวอร์ชันเต็มแค่ไหน
      { id: "play_full_version", type: "radio", label: "ถ้ามีเวอร์ชันเต็ม คุณจะเล่นไหม?", options: ["เล่นแน่นอน", "อาจจะ", "ไม่เล่น"], required: true },
      { id: "followup_contact", type: "text", label: "ช่องทางติดต่อ (ถ้ายินดีให้ทดสอบเวอร์ชันถัดไป)", placeholder: "อีเมล / Discord / IG (ไม่บังคับ)", required: false }
    ]
  }
];