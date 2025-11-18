// scripts/quotes.js
const quotes = {
  async loadQuotes() {
    const list = document.getElementById('quotesList');
    list.textContent = 'Loading…';
    try {
      const data = await api.quotes.get();
      if (!data.length) {
        list.textContent = 'No quotes available.';
        return;
      }

      list.innerHTML = data.map(q => `
        <div class="quote-card">
          <strong>${q.customerName || 'Unknown'}</strong><br>
          Total: ₱${q.totalAmount || 0}<br>
          Status: <em>${q.status}</em><br>
          <button onclick="quotes.updateStatus('${q._id}', 'approved')">Approve</button>
          <button onclick="quotes.updateStatus('${q._id}', 'rejected')">Reject</button>
        </div>
      `).join('');
    } catch (err) {
      list.textContent = 'Error loading quotes.';
      console.error(err);
    }
  },

  async updateStatus(id, status) {
    try {
      await api.quotes.update(id, { status });
      alert(`Quote ${status}.`);
      this.loadQuotes();
    } catch (err) {
      alert('Failed to update quote.');
    }
  }
};
