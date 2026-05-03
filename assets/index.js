const root = document.getElementById('root');

root.innerHTML = `
  <div class="page">
    <div class="container">
      <header class="header">
        <h1>WhatsApp Link Generator</h1>
      </header>

      <main class="card">
        <div class="form-group">
          <label for="phone">Nomor WhatsApp (format internasional)</label>
          <input id="phone" type="text" placeholder="Contoh: 6281234567890" />
          <p>Gunakan angka saja. Nomor yang diawali 0 otomatis diubah menjadi 62.</p>
        </div>

        <div class="form-group">
          <label for="message">Pesan otomatis (opsional)</label>
          <textarea id="message" rows="3" placeholder="Halo, saya tertarik dengan produk/jasa Anda..."></textarea>
          <p>Jika dikosongkan, link hanya akan membuka chat tanpa pesan awal.</p>
        </div>

        <div class="actions">
          <button id="generateBtn" class="btn btn-primary" type="button" disabled>Generate Link</button>
          <span id="statusText" class="status status-info"></span>
        </div>

        <section id="resultSection" class="result">
          <h2>Hasil Link:</h2>
          <div class="result-row">
            <input id="resultLink" type="text" readonly />
            <button id="copyBtn" class="btn btn-secondary" type="button" disabled>Copy Link</button>
          </div>
          <button id="openBtn" class="btn btn-dark" type="button" disabled>Open WhatsApp</button>
        </section>
      </main>

      <footer class="footer">Built with love by Hay Digital</footer>
    </div>
  </div>
`;

const phoneInput = document.getElementById('phone');
const messageInput = document.getElementById('message');
const generateBtn = document.getElementById('generateBtn');
const statusText = document.getElementById('statusText');
const resultSection = document.getElementById('resultSection');
const resultLink = document.getElementById('resultLink');
const copyBtn = document.getElementById('copyBtn');
const openBtn = document.getElementById('openBtn');

function sanitizePhone(value) {
  return value.replace(/[^0-9]/g, '').replace(/^0+/, '62');
}

function getGeneratedLink() {
  const phone = sanitizePhone(phoneInput.value);
  const message = messageInput.value.trim();

  if (!phone) {
    return '';
  }

  return `https://wa.me/${phone}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}

function showStatus(message, type = 'info') {
  statusText.textContent = message;
  statusText.className = `status status-${type}`;
}

function updatePreview() {
  const phone = sanitizePhone(phoneInput.value);
  const link = getGeneratedLink();
  const isValid = phone.length >= 8;
  const canUseLink = Boolean(link && isValid);

  generateBtn.disabled = !phone;
  copyBtn.disabled = !canUseLink;
  openBtn.disabled = !canUseLink;

  if (link) {
    resultLink.value = link;
    resultSection.classList.add('is-visible');
  } else {
    resultLink.value = '';
    resultSection.classList.remove('is-visible');
  }
}

function generateLink() {
  const phone = sanitizePhone(phoneInput.value);

  if (!phone) {
    showStatus('Nomor WhatsApp tidak boleh kosong.', 'error');
    return;
  }

  if (phone.length < 8) {
    showStatus('Nomor terlalu pendek. Pastikan format internasional (contoh: 62812...).', 'error');
    return;
  }

  updatePreview();
  showStatus('Link berhasil dibuat.', 'success');
}

async function copyLink() {
  const link = getGeneratedLink();

  if (!link || sanitizePhone(phoneInput.value).length < 8) {
    showStatus('Isi nomor WhatsApp yang valid sebelum copy.', 'error');
    return;
  }

  try {
    await navigator.clipboard.writeText(link);
    showStatus('Berhasil di-copy.', 'success');
  } catch {
    showStatus('Gagal menyalin. Copy manual.', 'error');
  }
}

function openWhatsApp() {
  const link = getGeneratedLink();

  if (!link || sanitizePhone(phoneInput.value).length < 8) {
    showStatus('Isi nomor WhatsApp yang valid sebelum membuka link.', 'error');
    return;
  }

  window.open(link, '_blank', 'noopener,noreferrer');
}

phoneInput.addEventListener('input', updatePreview);
messageInput.addEventListener('input', updatePreview);
generateBtn.addEventListener('click', generateLink);
copyBtn.addEventListener('click', copyLink);
openBtn.addEventListener('click', openWhatsApp);

phoneInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    generateLink();
  }
});

messageInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    generateLink();
  }
});
