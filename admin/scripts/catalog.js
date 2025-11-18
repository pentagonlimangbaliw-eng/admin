const catalog = {
  async loadItems() {
    const list = document.getElementById('itemsList');
    try {
      list.textContent = 'Loading items…';

      // ✅ Fetch items from backend
      const data = await api.catalog.getItems();

      if (!data || !data.length) {
        list.textContent = 'No items found.';
        return;
      }

      // ✅ Render each item card
      list.innerHTML = data.map(item => `
        <div class="item-card">
          <strong>${item.name}</strong><br>
          <em>${item.category}</em><br>
          ₱${item.price || 0}<br>
          <button onclick="catalog.editItem('${item._id}')">Edit</button>
          <button onclick="catalog.deleteItem('${item._id}')">Delete</button>
        </div>
      `).join('');
    } catch (err) {
      console.error('❌ Error loading items:', err);
      list.textContent = 'Error loading items.';
    }
  },

  async filterItems(category) {
    const list = document.getElementById('itemsList');
    list.textContent = 'Filtering…';
    try {
      const data = await api.catalog.getItems({ category });
      if (!data.length) {
        list.textContent = 'No items for this category.';
        return;
      }
      list.innerHTML = data.map(item => `
        <div class="item-card">
          <strong>${item.name}</strong><br>
          <em>${item.category}</em><br>
          ₱${item.price || 0}<br>
          <button onclick="catalog.editItem('${item._id}')">Edit</button>
          <button onclick="catalog.deleteItem('${item._id}')">Delete</button>
        </div>
      `).join('');
    } catch (e) {
      console.error('❌ Error filtering items:', e);
      list.textContent = 'Error filtering items.';
    }
  },

  async deleteItem(id) {
    if (!confirm('Delete this item?')) return;
    try {
      await api.catalog.deleteItem(id);
      alert('Item deleted.');
      this.loadItems(); // ✅ refresh list after delete
    } catch (err) {
      console.error('❌ Failed to delete item:', err);
      alert('Failed to delete.');
    }
  },

  editItem(id) {
    alert('🧱 Edit form coming soon for item ID: ' + id);
  }
};

// ✅ FIX: Automatically load items when the page loads
window.addEventListener('DOMContentLoaded', () => {
  catalog.loadItems();
});
