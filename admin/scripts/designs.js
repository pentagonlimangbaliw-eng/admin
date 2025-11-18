// scripts/designs.js
const designs = {
  async loadDesigns() {
    const list = document.getElementById('designsList');
    list.textContent = 'Loading…';
    try {
      const data = await api.designs.getRecent();
      if (!data.length) {
        list.innerHTML = '<div class="empty">No designs found.</div>';
        return;
      }

      list.innerHTML = data.map(d => `
        <div class="design-card">
          <div class="design-preview">
            ${d.screenshotUrl 
              ? `<img src="https://dreamspace-backend.onrender.com${d.screenshotUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">`
              : d.roomType || 'Preview'}
          </div>
          <div class="design-details">
            <h4>${d.name || 'Untitled Design'}</h4>
            <p><strong>User:</strong> ${d.userId?.name || 'N/A'}</p>
            <p><strong>Created:</strong> ${new Date(d.createdAt).toLocaleString()}</p>
          </div>
          <div class="design-actions">
            <button class="btn" onclick="designs.viewDesign('${d._id}')">View</button>
            <button class="btn btn-del" onclick="designs.deleteDesign('${d._id}')">Delete</button>
          </div>
        </div>
      `).join('');
    } catch (err) {
      console.error(err);
      list.innerHTML = '<div class="empty" style="color:red;">Failed to load designs.</div>';
    }
  },

  viewDesign(id) {
    window.open(`/design-view.html?id=${id}`, '_blank');
  },

  async deleteDesign(id) {
    if (!confirm('Delete this design?')) return;
    try {
      await api.designs.delete(id);
      this.loadDesigns(); // refresh
    } catch (err) {
      alert('Failed to delete design.');
      console.error(err);
    }
  }
};
/*const designs = {
  async loadDesigns() {
    const list = document.getElementById('designsList');
    list.textContent = 'Loading…';
    try {
      const data = await api.designs.getRecent();
      if (!data.length) {
        list.textContent = 'No designs found.';
        return;
      }

      list.innerHTML = data.map(d => `
        <div class="design-card">
          <strong>${d.user?.name || 'Unknown User'}</strong><br>
          Room: ${d.roomName || 'N/A'}<br>
          <button onclick="designs.viewDesign('${d._id}')">Preview</button>
          <button onclick="designs.deleteDesign('${d._id}')">Delete</button>
        </div>
      `).join('');
    } catch (err) {
      console.error(err);
      list.textContent = 'Error loading designs.';
    }
  },

  viewDesign(id) {
    window.open(`/viewer.html?design=${id}`, '_blank');
  },

  async deleteDesign(id) {
    if (!confirm('Delete this design?')) return;
    try {
      await api.designs.delete(id);
      alert('Design deleted.');
      this.loadDesigns();
    } catch (err) {
      alert('Failed to delete design.');
    }
  }
};
*/
