(() => {
  function load(src){
    return new Promise((resolve,reject)=>{
      const script=document.createElement('script');
      script.src=src;
      script.async=false;
      script.onload=resolve;
      script.onerror=reject;
      document.body.appendChild(script);
    });
  }
  load('./script-v3.js?v=5')
    .then(()=>load('./v5.js?v=5'))
    .catch(error=>console.error('[M4I] frontend loader failed',error));
})();
