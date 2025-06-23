function menuShow(){
  let menuMobile = document.querySelector('.mobile-menu');
  if(menuMobile.classList.contains('open')){
    menuMobile.classList.remove('open');
    document.querySelector('.icon').src = "https://upload.wikimedia.org/wikipedia/commons/b/b2/Hamburger_icon.svg";
  } else {
    menuMobile.classList.add('open');
    document.querySelector('.icon').src = "https://img.icons8.com/?size=100&id=83149&format=png&color=000000";
    const icon = document.querySelector('.icon');
icon.src = 'https://img.icons8.com/?size=100&id=83149&format=png&color=000000';
icon.style.width = '24px';
icon.style.height = '24px';
  }
}
