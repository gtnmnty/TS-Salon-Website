export class ProductOverlay {
  constructor(items) {
    this.items        = items;
    this.currentItem  = null;
    this.imgIdx       = 0;
    this.autoTimer    = null;
    this.selectedStars = 5;

    this.detailOverlay    = document.getElementById('detailOverlay');
    this.itemBrand        = document.getElementById('itemBrand');
    this.itemName         = document.getElementById('itemName');
    this.itemDesc         = document.getElementById('itemDesc');
    this.itemPrice        = document.getElementById('itemPrice');
    this.ratingInfo       = document.getElementById('ratingInfo');
    this.infoTags         = document.getElementById('infoTags');
    this.qtyInput         = document.getElementById('qtyInput');
    this.mainDetailImg    = document.getElementById('mainDetailImg');
    this.imgCountBadge    = document.getElementById('imgCountBadge');
    this.thumbBar         = document.getElementById('thumbBar');
    this.reviewCountBadge = document.getElementById('reviewCountBadge');
    this.reviewsList      = document.getElementById('reviewsList');
    this.reviewerName     = document.getElementById('reviewerName');
    this.reviewerDate     = document.getElementById('reviewerDate');
    this.reviewText       = document.getElementById('reviewText');
    this.starPicker       = document.getElementById('starPicker');

    this.setStars(5);
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  _resolveImgs(item) {
    if (Array.isArray(item.imgs)   && item.imgs.length)   return item.imgs;
    if (Array.isArray(item.images) && item.images.length) return item.images;
    const single = item.img || item.image;
    return single ? [single] : [];
  }

  _resolveDesc(item) {
    return item.desc || item.description || '';
  }

  _resolvePrice(item) {
    return item.price ?? (item.priceNum != null ? `₱${Number(item.priceNum).toLocaleString()}` : '₱0');
  }

  _resolveName(item) {
    const n = item.name;
    return (n && n !== 'undefined') ? n : (item.title || '');
  }

  _resolveBrand(item) {
    const b = item.brand;
    return (b && b !== 'undefined') ? b : '';
  }

  // ── Open / Close ─────────────────────────────────────────────────────────

  open(id) {
    this.currentItem = this.items.find(p => p.id === id);
    if (!this.currentItem) return;

    this.imgIdx = 0;

    if (this.itemBrand)  this.itemBrand.textContent  = this._resolveBrand(this.currentItem);
    if (this.itemName)   this.itemName.textContent   = this._resolveName(this.currentItem);
    if (this.itemDesc)   this.itemDesc.textContent   = this._resolveDesc(this.currentItem);
    if (this.itemPrice)  this.itemPrice.textContent  = this._resolvePrice(this.currentItem);

    const reviewLen = Array.isArray(this.currentItem.reviews) ? this.currentItem.reviews.length : 0;
    if (this.ratingInfo) this.ratingInfo.textContent = `5.0 (${reviewLen * 310 + 88} Reviews)`;

    if (this.infoTags) {
      const info = this.currentItem.info || [];
      this.infoTags.innerHTML = info.map(i => `<span class="info-tag">${i}</span>`).join('');
    }

    if (this.qtyInput) this.qtyInput.value = 1;

    this.renderReviews();
    this.updateImg();
    this.startAutoSlide();

    if (this.detailOverlay) this.detailOverlay.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  close() {
    clearInterval(this.autoTimer);
    if (this.detailOverlay) this.detailOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  // ── Image carousel ────────────────────────────────────────────────────────

  updateImg() {
    if (!this.currentItem) return;
    const imgs = this._resolveImgs(this.currentItem);
    if (!imgs.length) return;

    if (this.mainDetailImg) {
      this.mainDetailImg.style.backgroundImage = `url('${imgs[this.imgIdx]}')`;
    }
    if (this.imgCountBadge) {
      this.imgCountBadge.textContent = `${this.imgIdx + 1} / ${imgs.length}`;
    }
    if (this.thumbBar) {
      this.thumbBar.innerHTML = imgs.map((img, i) =>
        `<div class="thumb ${i === this.imgIdx ? 'active' : ''}"
              style="background-image:url('${img}')"
              data-index="${i}"></div>`
      ).join('');
    }
  }

  setImg(i) {
    this.imgIdx = i;
    this.updateImg();
    this.startAutoSlide();
  }

  hoverImg(i) {
    if (!this.currentItem) return;
    const imgs = this._resolveImgs(this.currentItem);
    if (!imgs[i] || !this.mainDetailImg) return;
    this.mainDetailImg.style.backgroundImage = `url('${imgs[i]}')`;
    this.thumbBar?.querySelectorAll('.thumb').forEach((t, idx) =>
      t.classList.toggle('active', idx === i)
    );
  }

  unhoverImg() {
    if (!this.currentItem) return;
    const imgs = this._resolveImgs(this.currentItem);
    if (!imgs[this.imgIdx] || !this.mainDetailImg) return;
    this.mainDetailImg.style.backgroundImage = `url('${imgs[this.imgIdx]}')`;
    this.thumbBar?.querySelectorAll('.thumb').forEach((t, i) =>
      t.classList.toggle('active', i === this.imgIdx)
    );
  }

  startAutoSlide() {
    clearInterval(this.autoTimer);
    if (!this.currentItem) return;
    const imgs = this._resolveImgs(this.currentItem);
    if (imgs.length < 2) return;
    this.autoTimer = setInterval(() => {
      this.imgIdx = (this.imgIdx + 1) % imgs.length;
      this.updateImg();
    }, 2500);
  }

  // ── Reviews ───────────────────────────────────────────────────────────────

  renderReviews() {
    const list  = this.currentItem.reviews || [];
    const count = list.length;

    if (this.reviewCountBadge) {
      this.reviewCountBadge.textContent = `${count} review${count !== 1 ? 's' : ''}`;
    }
    if (this.ratingInfo) {
      this.ratingInfo.textContent = `5.0 (${count * 310 + 88} Reviews)`;
    }
    if (this.reviewsList) {
      this.reviewsList.innerHTML = list.map(r => `
        <div class="review-card">
          <div class="review-top">
            <div>
              <div class="reviewer-name">${r.name}</div>
              <div class="review-date">${r.date}</div>
            </div>
            <span class="review-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5 - r.stars)}</span>
          </div>
          <p class="review-text">"${r.text}"</p>
        </div>
      `).join('');
    }
  }

  // ── Star picker ───────────────────────────────────────────────────────────

  setStars(n) {
    this.selectedStars = n;
    this.starPicker?.querySelectorAll('span').forEach((s, i) =>
      s.classList.toggle('lit', i < n)
    );
  }

  // ── Submit review ─────────────────────────────────────────────────────────

  submitReview(onMessage) {
    if (!this.currentItem) return;
    const name = this.reviewerName?.value.trim();
    const text = this.reviewText?.value.trim();
    const date = this.reviewerDate?.value.trim() || 'Just now';

    if (!name || !text) {
      onMessage?.('Please fill in your name and review.');
      return;
    }

    if (!Array.isArray(this.currentItem.reviews)) this.currentItem.reviews = [];
    this.currentItem.reviews.unshift({ name, stars: this.selectedStars, date, text });

    this.renderReviews();

    if (this.reviewerName) this.reviewerName.value = '';
    if (this.reviewerDate) this.reviewerDate.value = '';
    if (this.reviewText)   this.reviewText.value   = '';
    this.setStars(5);

    onMessage?.('Thank you for your review! ✨');
  }
}

// ─── Event wiring (called once after DOM + overlay are ready) ────────────────
export function initEvents(overlayInstance) {
  document.getElementById('backBtn')?.addEventListener('click', () =>
    overlayInstance.close()
  );

  document.getElementById('thumbBar')?.addEventListener('mouseover', e => {
    const thumb = e.target.closest('.thumb');
    if (thumb) overlayInstance.hoverImg(parseInt(thumb.dataset.index));
  });

  document.getElementById('thumbBar')?.addEventListener('mouseout', () =>
    overlayInstance.unhoverImg()
  );

  document.getElementById('thumbBar')?.addEventListener('click', e => {
    const thumb = e.target.closest('.thumb');
    if (thumb) overlayInstance.setImg(parseInt(thumb.dataset.index));
  });

  document.getElementById('starPicker')?.addEventListener('click', e => {
    const star = e.target.closest('span');
    if (star) overlayInstance.setStars(parseInt(star.dataset.stars));
  });

  document.getElementById('submitReviewBtn').addEventListener('click', () => {
    overlayInstance.submitReview(msg => {
      // Use toast if available, else fall back to alert
      const t = document.getElementById('toast');
      if (t) {
        t.textContent = msg;
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 3000);
      } else {
        alert(msg);
      }
    });
  });

  // Close overlay when clicking the dark backdrop
  document.getElementById('detailOverlay').addEventListener('click', e => {
    if (e.target === document.getElementById('detailOverlay')) {
      overlayInstance.close();
    }
  });
}
