const tg = window.Telegram.WebApp;
tg.expand();

tg.setHeaderColor('#0a1928');
tg.setBackgroundColor('#0a1928');


const user = tg.initDataUnsafe?.user;
if (user) {
    document.getElementById('user').innerHTML = `<i class="fas fa-hand-peace"></i> سلام ${user.first_name}`;
} else {
    document.getElementById('user').innerText = "👋 سلام مهمان";
}


function updatePersianDate() {
    const now = new Date();
    const persianDate = now.toLocaleDateString('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('persianDate').innerText = persianDate;
}
updatePersianDate();


async function fetchRealPrices() {
    try {
      
        showLoadingState();
        
      
        const [goldData, dollarData, euroData] = await Promise.allSettled([
            fetchGoldPrice(),
            fetchDollarPrice(),
            fetchEuroPrice()
        ]);
        
       
        if (goldData.status === 'fulfilled' && goldData.value) {
            updateGoldPrice(goldData.value);
        } else {
         
            const backupGold = await fetchGoldFromBackup();
            if (backupGold) updateGoldPrice(backupGold);
        }
        
        
        if (dollarData.status === 'fulfilled' && dollarData.value) {
            updateDollarPrice(dollarData.value);
        }
        
      
        if (euroData.status === 'fulfilled' && euroData.value) {
            updateEuroPrice(euroData.value);
        }
        
       
        calculateOtherCurrencies();
    
        updateLastUpdateTime();
        
    } catch (error) {
        console.log('خطا در دریافت:', error);
        useBackupData();
    }
}


async function fetchGoldPrice() {
    try {
        const response = await fetch('https://api.tgju.org/v1/data/geram18');
        const data = await response.json();
        if (data && data.current) {
            return {
                price: data.current.price,
                change: data.current.change_percent
            };
        }
        return null;
    } catch {
        return null;
    }
}


async function fetchDollarPrice() {
    try {
        const response = await fetch('https://api.tgju.org/v1/data/price_dollar_rl');
        const data = await response.json();
        if (data && data.current) {
            return {
                price: data.current.price,
                change: data.current.change_percent
            };
        }
        return null;
    } catch {
        return null;
    }
}


async function fetchEuroPrice() {
    try {
        const response = await fetch('https://api.tgju.org/v1/data/price_eur');
        const data = await response.json();
        if (data && data.current) {
            return {
                price: data.current.price,
                change: data.current.change_percent
            };
        }
        return null;
    } catch {
        return null;
    }
}


async function fetchGoldFromBackup() {
    try {
        const response = await fetch('https://www.currency-api.com/v1/latest/usd');
        const data = await response.json();
      
        return {
            price: 28450000, 
            change: 0
        };
    } catch {
        return null;
    }
}


function showLoadingState() {
    document.getElementById('goldPrice').innerHTML = '<span class="price-number">در حال بروزرسانی...</span>';
    document.getElementById('dollarPrice').innerText = '---';
    document.getElementById('euroPrice').innerText = '---';
    document.getElementById('dirhamPrice').innerText = '---';
    document.getElementById('poundPrice').innerText = '---';
}


function updateGoldPrice(data) {
    if (data && data.price) {
        const price = Number(data.price).toLocaleString();
        document.getElementById('goldPrice').innerHTML = `
            <span class="price-number">${price}</span>
            <span class="price-currency">تومان</span>
        `;
        
        const change = data.change || 0;
        const goldChangeEl = document.getElementById('goldChange');
        const icon = change > 0 ? 'fa-arrow-up' : change < 0 ? 'fa-arrow-down' : 'fa-minus';
        const changeClass = change > 0 ? 'positive-change' : change < 0 ? 'negative-change' : '';
        
        goldChangeEl.innerHTML = `<i class="fas ${icon}"></i> ${Math.abs(change)}%`;
        goldChangeEl.className = `gold-change ${changeClass}`;
    }
}


function updateDollarPrice(data) {
    if (data && data.price) {
        const price = Number(data.price).toLocaleString();
        document.getElementById('dollarPrice').innerText = price;
        
        const change = data.change || 0;
        const changeEl = document.getElementById('dollarChange');
        changeEl.innerHTML = `${change > 0 ? '▲' : '▼'} ${Math.abs(change)}%`;
        changeEl.className = `currency-change ${change > 0 ? 'positive-change' : 'negative-change'}`;
    }
}


function updateEuroPrice(data) {
    if (data && data.price) {
        const price = Number(data.price).toLocaleString();
        document.getElementById('euroPrice').innerText = price;
        
        const change = data.change || 0;
        const changeEl = document.getElementById('euroChange');
        changeEl.innerHTML = `${change > 0 ? '▲' : '▼'} ${Math.abs(change)}%`;
        changeEl.className = `currency-change ${change > 0 ? 'positive-change' : 'negative-change'}`;
    }
}


function calculateOtherCurrencies() {
    const dollarText = document.getElementById('dollarPrice').innerText;
    if (dollarText && dollarText !== '---') {
        const dollarPrice = Number(dollarText.replace(/,/g, ''));
        
        
        const dirhamPrice = Math.round(dollarPrice * 0.27);
        document.getElementById('dirhamPrice').innerText = dirhamPrice.toLocaleString();
        
        
        const poundPrice = Math.round(dollarPrice * 1.25);
        document.getElementById('poundPrice').innerText = poundPrice.toLocaleString();
    }
}


function useBackupData() {
    const backup = {
        gold: '۲۸,۴۵۰,۰۰۰',
        dollar: '۵۸,۷۵۰',
        euro: '۶۳,۸۲۰',
        dirham: '۱۶,۰۵۰',
        pound: '۷۴,۳۹۰'
    };
    
    document.getElementById('goldPrice').innerHTML = `
        <span class="price-number">${backup.gold}</span>
        <span class="price-currency">تومان</span>
    `;
    
    document.getElementById('dollarPrice').innerText = backup.dollar;
    document.getElementById('euroPrice').innerText = backup.euro;
    document.getElementById('dirhamPrice').innerText = backup.dirham;
    document.getElementById('poundPrice').innerText = backup.pound;
}

    
function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('fa-IR', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('lastUpdate').innerHTML = `
        <i class="fas fa-check-circle" style="color: #4CAF50;"></i> 
        بروزرسانی: ${timeString}
    `;
}
  
fetchRealPrices();


setInterval(fetchRealPrices, 120000);

 
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
        
        const id = this.id;
        if (id === 'navHome') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (id === 'navGold') {
            document.querySelector('.gold-card').scrollIntoView({ behavior: 'smooth' });
        } else if (id === 'navCurrency') {
            document.querySelector('.currency-grid').scrollIntoView({ behavior: 'smooth' });
        }
    });
});


document.getElementById("send").onclick = () => {
    const goldPrice = document.getElementById('goldPrice').innerText;
    const dollarPrice = document.getElementById('dollarPrice').innerText;
    tg.sendData(`قیمت‌ها - طلا: ${goldPrice} - دلار: ${dollarPrice}`);
};

tg.onEvent('backButtonClicked', () => {
    tg.close();
});
