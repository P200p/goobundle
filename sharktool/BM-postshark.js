// Bookmarklet IIFE (โหลด PostShark โดยตรงจาก Netlify)
javascript:(function(){
  try {
    var s = document.createElement('script');
    s.src = 'https://sharkkadaw.netlify.app/sharktool/postshark.js';
    document.body.appendChild(s);
  } catch(e) {
    console.error('Error loading postshark.js', e);
  }
})();
