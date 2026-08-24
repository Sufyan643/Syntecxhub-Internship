// ============ Modal / Popup Window logic ============

document.addEventListener('DOMContentLoaded', function () {

  const openBtn      = document.getElementById('openModalBtn');
  const overlay       = document.getElementById('modalOverlay');
  const closeBtn      = document.getElementById('modalCloseBtn');
  const cancelBtn     = document.getElementById('modalCancelBtn');
  const form           = document.getElementById('waitlistForm');
  const formView       = document.getElementById('modalFormView');
  const successView    = document.getElementById('modalSuccessView');

  function openModal() {
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden'; // lock background scroll
    // move focus into the modal for accessibility
    closeBtn.focus();
  }

  function closeModal() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    // reset back to the form view after the close animation finishes
    setTimeout(function () {
      formView.classList.remove('is-hidden');
      successView.classList.remove('is-visible');
      form.reset();
    }, 300);
  }

  // Open modal
  openBtn.addEventListener('click', openModal);

  // Close modal — X button
  closeBtn.addEventListener('click', closeModal);

  // Close modal — Cancel button inside the form
  cancelBtn.addEventListener('click', closeModal);

  // Close modal — clicking the dark overlay (but not the card itself)
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) {
      closeModal();
    }
  });

  // Close modal — Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Handle form submit — show a success state instead of actually sending data
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    formView.classList.add('is-hidden');
    successView.classList.add('is-visible');

    // auto-close a couple seconds after success, purely for demo polish
    setTimeout(closeModal, 2200);
  });

});