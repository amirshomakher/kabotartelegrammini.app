const tg = window.Telegram.WebApp;
tg.expand();

const user = tg.initDataUnsafe.user;

tg.setHeaderColor('#0a1928');
tg.setBackgroundColor('#0a1928');



if (user) {
  document.getElementById('user').innerText = 'سلام' + user.first_name;
} else {
  document.getElementById("user").innerText =
    "کاربر شناسایی نشد";
}



function updatepersanDate() {
  const now = new Date();

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    calendar: 'persian',
    locale: 'fa-IR'
  }

  try {
    const persiandate = now.toLocaleDateString('fa-iR', options);

    document.getElementById('persianDate').innerText = persiandate;
  } catch {

    document.getElementById('persianDate').innerText = '۱۴۰۲/۱۲/۲۵';
  }
};

updatepersanDate();

function fetchPrices() {

  try {
    const fetchData = fetch('https://api.exir.io/v1/market/ticker?symbol=BTCIRT')
      .then(response => response.json())
      .then(data => {
        const price = data.result.last_price;
        document.getElementById('price').innerText = price + ' تومان';
      })
      .catch(error => {
        console.error('Error fetching price:', error);
        document.getElementById('price').innerText = 'خطا در دریافت قیمت';
      });

    const prices = {
      gold: (Math.random() * 3000000 + 2500000).toFixed(0),
      dollar: (Math.random() * 10000 + 58000).toFixed(0),
      euro: (Math.random() * 12000 + 62000).toFixed(0),
      dirham: (Math.random() * 3000 + 16000).toFixed(0),
      pound: (Math.random() * 15000 + 72000).toFixed(0)
    };

    const changes = {
      gold: (Math.random() * 4 - 2).toFixed(1),
      dollar: (Math.random() * 3 - 1.5).toFixed(1),
      euro: (Math.random() * 3 - 1.5).toFixed(1),
      dirham: (Math.random() * 3 - 1.5).toFixed(1),
      pound: (Math.random() * 3 - 1.5).toFixed(1)
    };

    document.getElementById('goldPrice').innerHTML = `
        <span class="price-number">${Number(prices.gold).toLocaleString()}</span>
        <span class="price-currency">تومان</span>
    `;

    const goldChangeEl = document.getElementById('goldChange');
    const goldChangeIcon = changes.gold > 0 ? 'fa-arrow-up' : changes.gold < 0 ? 'fa-arrow-down' : 'fa-minus';
    const goldChangeClass = changes.gold > 0 ? 'positive-change' : changes.gold < 0 ? 'negative-change' : '';

    goldChangeEl.innerHTML = `
        <i class="fas ${goldChangeIcon}"></i> ${Math.abs(changes.gold)}%
    `;
    goldChangeEl.className = `gold-change ${goldChangeClass}`;

    const currencies = ['dollar', 'euro', 'dirham', 'pound'];
    currencies.forEach(currency => {
      const priceEl = document.getElementById(`${currency}Price`);
      const changeEl = document.getElementById(`${currency}Change`);

      if (priceEl) {
        priceEl.innerText = Number(prices[currency]).toLocaleString();
      }

      if (changeEl) {
        const change = changes[currency];
        const icon = change > 0 ? '▲' : change < 0 ? '▼' : '•';
        const changeClass = change > 0 ? 'positive-change' : change < 0 ? 'negative-change' : '';

        changeEl.innerHTML = `${icon} ${Math.abs(change)}%`;
        changeEl.className = `currency-change ${changeClass}`;
      }
    });


    const now = new Date();
    const timeString = now.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('lastUpdate').innerHTML = `<i class="fas fa-clock"></i> آخرین به‌روزرسانی: ${timeString}`;

  } catch (error) {

  }
}


fetchPrices();

setInterval(fetchPrices, 60000);

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
        
   
        const id = this.id;
        if (id === 'navHome') {
        
        } else if (id === 'navGold') {
            
            document.querySelector('.gold-card').scrollIntoView({ behavior: 'smooth' });
        } else if (id === 'navCurrency') {
        
            document.querySelector('.currency-grid').scrollIntoView({ behavior: 'smooth' });
        }
    });
});


document.getElementById("send").onclick = () => {
    const goldPrice = document.getElementById('goldPrice').innerText;
    tg.sendData(`کاربر قیمت طلا رو مشاهده کرد: ${goldPrice}`);
};


tg.onEvent('backButtonClicked', () => {
    tg.close();
});



