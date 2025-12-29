import { useEffect } from "react";

type AnimationType = "fade-up" | "fade-left" | "fade-right" | "scale-up";

const applyVariantClass = (element: HTMLElement, animation: AnimationType) => {
  switch (animation) {
    case "fade-left":
      element.classList.add("scroll-reveal-left");
      break;
    case "fade-right":
      element.classList.add("scroll-reveal-right");
      break;
    case "scale-up":
      element.classList.add("scroll-reveal-scale");
      break;
    default:
      element.classList.add("scroll-reveal-up");
      break;
  }
};

const isElementInView = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  const verticallyVisible = rect.top <= windowHeight * 0.9 && rect.bottom >= 0;
  const horizontallyVisible = rect.left <= windowWidth && rect.right >= 0;

  return verticallyVisible && horizontallyVisible;
};

export const useScrollReveal = (dependencies: unknown[] = []) => {
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-animate]")
    );

    if (elements.length === 0) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const unsupportedObserver =
      typeof window.IntersectionObserver === "undefined";

    const revealNow =
      prefersReducedMotion || unsupportedObserver;

    const observer = !revealNow
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("scroll-reveal-visible");
                observer.unobserve(entry.target);
              }
            });
          },
          {
            threshold: 0.2,
            rootMargin: "0px 0px -10% 0px",
          }
        )
      : null;

    const fallbackTimer = window.setTimeout(() => {
      elements.forEach((element) => {
        if (!element.classList.contains("scroll-reveal-visible")) {
          element.classList.add("scroll-reveal-visible");
        }
      });
    }, 800);

    elements.forEach((element, index) => {
      if (element.dataset.revealInit === "true") return;
      element.dataset.revealInit = "true";

      const animation = (element.dataset.animate as AnimationType) || "fade-up";
      const delay = Number(element.dataset.delay || index * 40);

      element.classList.add("scroll-reveal");
      applyVariantClass(element, animation);

      if (delay) {
        element.style.transitionDelay = `${delay}ms`;
      }

      if (revealNow) {
        element.classList.add("scroll-reveal-visible");
      } else {
        if (isElementInView(element)) {
          element.classList.add("scroll-reveal-visible");
        } else {
          observer?.observe(element);
        }
      }
    });

    return () => {
      observer?.disconnect();
      window.clearTimeout(fallbackTimer);
    };
  }, dependencies);
};

export default useScrollReveal;
