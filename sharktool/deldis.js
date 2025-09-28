javascript:(function(){
  const all = document.querySelectorAll('*');
  all.forEach(el => {
    if (el.disabled !== undefined) {
      el.disabled = false;
    }
    el.style.pointerEvents = 'auto';
    el.style.opacity = '1';
    el.style.filter = 'none';
    el.style.cursor = 'pointer';

    if (['INPUT','TEXTAREA','SELECT'].includes(el.tagName)) {
      el.style.backgroundColor = '#fffbe6';
      el.style.border = '2px solid #fbc02d';
      el.style.boxShadow = '0 0 5px #fdd835';
    }

    if (el.tagName === 'BUTTON') {
      el.style.backgroundColor = '#4CAF50';
      el.style.color = '#fff';
      el.style.border = '2px solid #2e7d32';
      el.style.boxShadow = '0 0 5px #2e7d32';
    }
  });
  alert('คำสาป  ถูกล้างแล้ว! 🦈');
})();
