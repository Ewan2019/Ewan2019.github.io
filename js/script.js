let balance = localStorage.getItem('balance') ? parseFloat(localStorage.getItem('balance')) : 0;
let transactions = [];

// Cek apakah ada data transaksi yang tersimpan di localStorage
if (localStorage.getItem('transactions')) {
    transactions = JSON.parse(localStorage.getItem('transactions'));
    updateTransactionHistory();
    updateBalance();
}

document.getElementById('addTransaction').addEventListener('click', function() {
    let transactionAmount = parseFloat(document.getElementById('transactionAmount').value);
    let transactionType = document.getElementById('transactionType').value;
    let transactionPurpose = document.getElementById('transactionPurpose').value;

    if (transactionAmount && transactionType && transactionPurpose) {
        balance += transactionAmount;
        document.getElementById('balance').innerText = balance;
        transactions.push({ 
            amount: transactionAmount, 
            type: transactionType, 
            purpose: transactionPurpose, 
            timestamp: new Date().toISOString() 
        });
        updateTransactionHistory();
        updateBalance();
        saveTransactionsToLocalStorage();
        document.getElementById('transactionAmount').value = '';
        document.getElementById('transactionType').value = '';
        document.getElementById('transactionPurpose').value = '';
    } else {
        alert('Mohon lengkapi semua field!');
    }
});

document.getElementById('exportToExcel').addEventListener('click', function() {
    const worksheet = XLSX.utils.json_to_sheet(transactions);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Transaksi');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAsExcel(excelBuffer, 'rekap_transaksi.xlsx');
});

document.getElementById('resetData').addEventListener('click', function() {
    balance = 0;
    transactions = [];
    updateTransactionHistory();
    updateBalance();
    saveTransactionsToLocalStorage();
});

function updateTransactionHistory() {
    const transactionHistory = document.getElementById('transactionHistory');
    transactionHistory.innerHTML = '';
    transactions.forEach(function(transaction) {
        const listItem = document.createElement('li');
        listItem.innerText = `Jumlah: ${transaction.amount} | Jenis: ${transaction.type} | Tujuan: ${transaction.purpose} | Waktu: ${new Date(transaction.timestamp).toLocaleString()}`;
        if (transaction.type === 'Pendapatan') {
            listItem.classList.add('income');
        } else if (transaction.type === 'Pengeluaran') {
            listItem.classList.add('expense');
        }
        transactionHistory.appendChild(listItem);
    });
}

function updateBalance() {
    document.getElementById('balance').innerText = balance;
}

function saveTransactionsToLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('balance', balance);
}

function saveAsExcel(buffer, filename) {
    const data = new Blob([buffer], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(data);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}