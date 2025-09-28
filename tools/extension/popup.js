const select = document.getElementById('theme');
const btnApply = document.getElementById('apply');
const btnRandom = document.getElementById('random');
const btnExport = document.getElementById('export');
const inputImport = document.getElementById('import');

const THEME_KEYS = ['dark','goonee','amoled','sepia','midnight','dracula','nord','solarized_dark','solarized_light','high_contrast','grayscale','cyberpunk','sharktheme','pastel','vibrant_red','vibrant_orange','vibrant_blue','vibrant_purple'];

function optionsHtml(list){
  return list.map(k=>`<option value="${k}">${k.replace(/_/g,' ')}</option>`).join('');
}

async function init() {
  select.innerHTML = optionsHtml(THEME_KEYS);
  const { theme } = await chrome.storage.sync.get({ theme: 'dark' });
  select.value = THEME_KEYS.includes(theme) ? theme : 'dark';
}
init();

btnApply.addEventListener('click', async () => {
  const theme = select.value;
  await chrome.storage.sync.set({ theme });
  window.close();
});

btnRandom.addEventListener('click', async () => {
  const idx = Math.floor(Math.random() * THEME_KEYS.length);
  const theme = THEME_KEYS[idx];
  select.value = theme;
  // preview without saving
  chrome.runtime.sendMessage({ type: 'previewTheme', theme });
});

btnExport.addEventListener('click', async () => {
  const data = await chrome.storage.sync.get(null);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'x-theme-settings.json'; a.click();
  URL.revokeObjectURL(url);
});

inputImport.addEventListener('change', async (e) => {
  const file = e.target.files?.[0];
  if(!file) return;
  try{
    const text = await file.text();
    const data = JSON.parse(text);
    await chrome.storage.sync.set(data);
    await init();
  }catch(err){
    alert('Invalid JSON');
  }
});
