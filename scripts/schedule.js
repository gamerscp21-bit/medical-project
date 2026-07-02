/* ============================================
   HealthSync — Schedule Page Scripts
   ============================================ */

// Medication checkbox toggle — fade completed items
document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    const parent = this.closest(".group");
    if (this.checked) {
      parent.classList.add("opacity-50");
      parent.style.transition = "opacity 0.3s ease";
    } else {
      parent.classList.remove("opacity-50");
    }
  });
});

// Horizontal scroll for date picker via mouse wheel
const scrollContainer = document.querySelector(".custom-scrollbar");
if (scrollContainer) {
  scrollContainer.addEventListener("wheel", (evt) => {
    evt.preventDefault();
    scrollContainer.scrollLeft += evt.deltaY;
  });
}
