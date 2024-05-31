document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");
  const options = {
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible");
      }
    });
  }, options);

  sections.forEach((section) => {
    observer.observe(section);
  });
});
