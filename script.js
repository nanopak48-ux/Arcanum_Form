const dynamicContainer = document.getElementById("dynamic-questions");
const form = document.getElementById("feedback-form");
const statusEl = document.getElementById("status");
const submitBtn = document.getElementById("submit-btn");

const ratings = {};

// ฟังก์ชันวาดหมวดหมู่และคำถามลงหน้าเว็บ
function renderForm() {
  dynamicContainer.innerHTML = "";

  formSections.forEach(section => {
    // สร้างคอนเทนเนอร์สำหรับแต่ละหมวดหมู่
    const sectionCard = document.createElement("div");
    sectionCard.className = "question-section";

    // สร้างหัวข้อหมวดหมู่
    if (section.sectionTitle) {
      const h2 = document.createElement("h2");
      h2.className = "section-title";
      h2.textContent = section.sectionTitle;
      sectionCard.appendChild(h2);
    }

    // สร้างคำอธิบายหมวดหมู่ (ถ้ามี)
    if (section.sectionDesc) {
      const p = document.createElement("p");
      p.className = "section-desc";
      p.textContent = section.sectionDesc;
      sectionCard.appendChild(p);
    }

    // วาดคำถามย่อยในหมวดนี้
    section.questions.forEach(q => {
      const fieldset = document.createElement("fieldset");
      const legend = document.createElement("legend");
      legend.innerHTML = `${q.label} ${q.required ? '<span class="req">*</span>' : '<span class="opt">(ไม่บังคับ)</span>'}`;
      
      if (q.type !== "star") fieldset.appendChild(legend);

      if (q.type === "text" || q.type === "email") {
        const input = document.createElement("input");
        input.type = q.type;
        input.name = q.id;
        if (q.placeholder) input.placeholder = q.placeholder;
        fieldset.appendChild(input);
      } 
      else if (q.type === "textarea") {
        const textarea = document.createElement("textarea");
        textarea.name = q.id;
        textarea.rows = 3;
        if (q.placeholder) textarea.placeholder = q.placeholder;
        fieldset.appendChild(textarea);
      } 
      else if (q.type === "select") {
        const select = document.createElement("select");
        select.name = q.id;
        select.innerHTML = `<option value="">เลือก…</option>` + 
          q.options.map(opt => `<option value="${opt}">${opt}</option>`).join("");
        fieldset.appendChild(select);
      } 
      else if (q.type === "radio") {
        const choices = document.createElement("div");
        choices.className = "choices";
        q.options.forEach(opt => {
          const label = document.createElement("label");
          label.innerHTML = `<input type="radio" name="${q.id}" value="${opt}"> ${opt}`;
          choices.appendChild(label);
        });
        fieldset.appendChild(choices);
      } 
      else if (q.type === "star") {
        const row = document.createElement("div");
        row.className = "rating-row";
        row.dataset.name = q.id;
        row.innerHTML = `<span>${q.label} ${q.required ? '<span class="req">*</span>' : ''}</span><div class="stars"></div>`;
        const box = row.querySelector(".stars");
        for (let i = 1; i <= 5; i++) {
          const star = document.createElement("button");
          star.type = "button";
          star.className = "star";
          star.textContent = "★";
          star.addEventListener("click", () => setRating(q.id, i));
          box.appendChild(star);
        }
        fieldset.appendChild(row);
      }

      sectionCard.appendChild(fieldset);
    });

    dynamicContainer.appendChild(sectionCard);
  });
}

function setRating(name, value) {
  ratings[name] = value;
  const row = document.querySelector(`.rating-row[data-name="${name}"]`);
  if (row) {
    row.classList.remove("invalid");
    row.querySelectorAll(".star").forEach((s, idx) => {
      s.classList.toggle("on", idx < value);
    });
  }
}

function showStatus(message, type) {
  statusEl.textContent = message;
  statusEl.className = type || "";
}

// ตรวจสอบความถูกต้องของไฟล์ตั้งค่าก่อนวาดฟอร์ม
if (typeof formSections === "undefined" || !Array.isArray(formSections)) {
  showStatus("เกิดข้อผิดพลาด: อ่านไฟล์ questions.js ไม่สำเร็จ กรุณาเช็กชื่อไฟล์และการเชื่อมต่อ", "error");
} else {
  renderForm();
}

// จัดการการส่งข้อมูล
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (typeof SCRIPT_URL === 'undefined' || SCRIPT_URL.startsWith("PASTE_")) {
    showStatus("Setup needed: กรุณาใส่ Apps Script URL ในไฟล์ questions.js", "error");
    return;
  }

  let valid = true;
  const payload = { website: form.website.value };

  // วนลูปตรวจสอบคำตอบทุกหมวดและทุกคำถาม
  formSections.forEach(section => {
    section.questions.forEach(q => {
      if (q.type === "star") {
        if (q.required && !ratings[q.id]) {
          const row = document.querySelector(`.rating-row[data-name="${q.id}"]`);
          if (row) row.classList.add("invalid");
          valid = false;
        }
        payload[q.id] = ratings[q.id] || "";
      } else if (q.type === "radio") {
        const selected = form.querySelector(`input[name="${q.id}"]:checked`);
        if (q.required && !selected) valid = false;
        payload[q.id] = selected ? selected.value : "";
      } else {
        const el = form.elements[q.id];
        if (q.required && (!el || !el.value.trim())) valid = false;
        payload[q.id] = el ? el.value.trim() : "";
      }
    });
  });

  if (!valid) {
    showStatus("กรุณากรอกข้อมูลในช่องที่จำเป็น (*) ให้ครบถ้วน", "error");
    return;
  }

  const last = Number(localStorage.getItem("lastSubmit") || 0);
  if (Date.now() - last < 30000) {
    showStatus("คุณเพิ่งส่งข้อมูลไป กรุณารอสักครู่", "error");
    return;
  }

  submitBtn.disabled = true;
  showStatus("กำลังส่งข้อมูล…");

  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });

    localStorage.setItem("lastSubmit", String(Date.now()));
    form.reset();
    Object.keys(ratings).forEach((k) => delete ratings[k]);
    document.querySelectorAll(".star.on").forEach((s) => s.classList.remove("on"));
    showStatus("ส่งข้อเสนอแนะสำเร็จ ขอบคุณมากครับ! ✨", "ok");
  } catch (err) {
    console.error(err);
    showStatus("ไม่สามารถส่งได้ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่", "error");
  } finally {
    submitBtn.disabled = false;
  }
});

// 1. ฟังก์ชันคำนวณและอัปเดตความคืบหน้าคำถามบังคับ
function updateProgress() {
  if (typeof formSections === "undefined") return;

  // รวบรวมคำถามที่ตั้งค่า required: true ทั้งหมด
  const requiredQuestions = [];
  formSections.forEach(section => {
    section.questions.forEach(q => {
      if (q.required) requiredQuestions.push(q);
    });
  });

  const total = requiredQuestions.length;
  if (total === 0) return;

  let answered = 0;

  // ตรวจสอบแต่ละคำถามว่ามีการตอบแล้วหรือยัง
  requiredQuestions.forEach(q => {
    if (q.type === "star") {
      if (ratings[q.id] && ratings[q.id] >= 1) {
        answered++;
      }
    } else if (q.type === "radio") {
      const checked = form.querySelector(`input[name="${q.id}"]:checked`);
      if (checked && checked.value) {
        answered++;
      }
    } else {
      const field = form.elements[q.id];
      if (field && field.value.trim() !== "") {
        answered++;
      }
    }
  });

  // คำนวณเปอร์เซ็นต์และอัปเดต UI
  const percent = Math.round((answered / total) * 100);
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");

  if (progressBar) progressBar.style.width = percent + "%";
  if (progressText) progressText.textContent = `${answered} / ${total} (${percent}%)`;
}

// 2. ปรับฟังก์ชัน setRating ให้สั่งอัปเดต Progress ด้วยเมื่อกดเลือกดาว
function setRating(name, value) {
  ratings[name] = value;
  const row = document.querySelector(`.rating-row[data-name="${name}"]`);
  if (row) {
    row.classList.remove("invalid");
    row.querySelectorAll(".star").forEach((s, idx) => {
      s.classList.toggle("on", idx < value);
    });
  }
  updateProgress(); // <--- คำนวณความคืบหน้าใหม่
}

// 3. ปรับการสั่งซื้อเรนเดอร์ฟอร์มและผูก Event ให้ตรวจจับการพิมพ์/เลือกตัวเลือก
if (typeof formSections === "undefined" || !Array.isArray(formSections)) {
  showStatus("เกิดข้อผิดพลาด: อ่านไฟล์ questions.js ไม่สำเร็จ กรุณาเช็กชื่อไฟล์และการเชื่อมต่อ", "error");
} else {
  renderForm();
  updateProgress(); // คำนวณค่าตั้งต้น (0%)
}

// ดักจับการพิมพ์ (input) และการเลือก (change) ภายในฟอร์มเพื่ออัปเดตความคืบหน้าแบบเรียลไทม์
form.addEventListener("input", updateProgress);
form.addEventListener("change", updateProgress);