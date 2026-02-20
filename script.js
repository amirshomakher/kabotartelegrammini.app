const tg = window.Telegram.WebApp;
tg.expand();

const user = tg.initDataUnsafe.user;

if(user){
    document.getElementById('user').innerText = 'سلام' + user.first_name;
}else{
  document.getElementById("user").innerText =
    "کاربر شناسایی نشد";
}

document.getElementById("send").onclick = () => {
  tg.sendData("کاربر دکمه رو زد");
};