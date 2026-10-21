const yearNodes = document.querySelectorAll("[data-year]");
yearNodes.forEach((node) => {
  node.textContent = String(new Date().getFullYear());
});

const heroVideo = document.querySelector(".hero-video");
if (heroVideo instanceof HTMLVideoElement) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const syncHeroPlayback = () => {
    if (prefersReducedMotion.matches) {
      heroVideo.pause();
      return;
    }
    heroVideo.play().catch(() => {});
  };
  syncHeroPlayback();
  prefersReducedMotion.addEventListener("change", syncHeroPlayback);
}

const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");

const onScroll = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 8);
};

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

if (menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const open = primaryNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    menuToggle.setAttribute("aria-label", open ? "メニューを閉じる" : "メニューを開く");
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      primaryNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "メニューを開く");
    });
  });
}

const revealNodes = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
  );
  revealNodes.forEach((node) => observer.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}

const track = document.querySelector("[data-hero-track]");
const slides = track ? Array.from(track.querySelectorAll(".hero-slide")) : [];
const prevBtn = document.querySelector("[data-hero-prev]");
const nextBtn = document.querySelector("[data-hero-next]");
const dotsWrap = document.querySelector("[data-hero-dots]");

if (slides.length > 0) {
  let index = slides.findIndex((slide) => slide.classList.contains("is-active"));
  if (index < 0) index = 0;
  let timerId = null;

  const dots = slides.map((_, i) => {
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-label", `スライド ${i + 1}`);
    button.addEventListener("click", () => goTo(i));
    dotsWrap?.appendChild(button);
    return button;
  });

  const render = () => {
    slides.forEach((slide, i) => {
      slide.classList.toggle("is-active", i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle("is-active", i === index);
    });
  };

  const goTo = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    render();
    restart();
  };

  const restart = () => {
    if (timerId) window.clearInterval(timerId);
    timerId = window.setInterval(() => goTo(index + 1), 6500);
  };

  prevBtn?.addEventListener("click", () => goTo(index - 1));
  nextBtn?.addEventListener("click", () => goTo(index + 1));

  track?.addEventListener("mouseenter", () => {
    if (timerId) window.clearInterval(timerId);
  });
  track?.addEventListener("mouseleave", restart);

  render();
  restart();
}

// Shopify Buy Button: "カートに入れる" on each size card and the header cart.
// Settings live in shopify-config.js; nothing changes on the page until they are filled in.
(() => {
  const config = window.NEKOMANEKI_SHOPIFY || {};

  if (config.accountUrl) {
    document.querySelectorAll("[data-account-link]").forEach((link) => {
      link.setAttribute("href", config.accountUrl);
    });
  }

  // The cart lives on pages that show the size cards; other pages keep linking to them.
  if (!config.domain || !config.storefrontAccessToken) return;
  if (!document.querySelector("[data-shopify-product]")) return;

  const slots = Array.from(document.querySelectorAll("[data-shopify-product]")).filter(
    (slot) => config.products && config.products[slot.dataset.shopifyProduct]
  );
  const cartToggles = document.querySelectorAll("[data-cart-toggle]");
  const cartCounts = document.querySelectorAll("[data-cart-count]");
  const SDK_URL = "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";

  const loadSdk = () =>
    new Promise((resolve, reject) => {
      if (window.ShopifyBuy && window.ShopifyBuy.UI) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.async = true;
      script.src = SDK_URL;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });

  const cartText = {
    title: "カート",
    total: "小計",
    empty: "カートは空です",
    notice: "送料無料。税込価格です。",
    button: "ご購入手続きへ",
  };

  loadSdk()
    .then(() => {
      const client = window.ShopifyBuy.buildClient({
        domain: config.domain,
        storefrontAccessToken: config.storefrontAccessToken,
      });
      return window.ShopifyBuy.UI.onReady(client);
    })
    .then((ui) => {
      const updateCount = () => {
        const cart = ui.components.cart[0];
        const items = (cart && cart.model && cart.model.lineItems) || [];
        const count = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
        cartCounts.forEach((node) => {
          node.textContent = String(count);
          node.hidden = count === 0;
        });
      };

      const options = {
        product: {
          iframe: false,
          contents: { img: false, title: false, price: false, options: false },
          text: { button: "カートに入れる", outOfStock: "売り切れ", unavailable: "販売準備中" },
          styles: {
            button: {
              "font-family": "Shippori Mincho, serif",
              "font-size": "14px",
              "letter-spacing": "0.12em",
              "background-color": "#a86f6f",
              ":hover": { "background-color": "#8f5c5c" },
              ":focus": { "background-color": "#8f5c5c" },
              "border-radius": "999px",
              "padding-left": "28px",
              "padding-right": "28px",
            },
          },
          events: { afterAddVariantToCart: () => setTimeout(updateCount, 300) },
        },
        cart: {
          text: cartText,
          contents: { note: false },
          popup: false,
          events: { afterInit: updateCount, updateItemQuantity: () => setTimeout(updateCount, 300) },
          styles: {
            button: {
              "background-color": "#a86f6f",
              ":hover": { "background-color": "#8f5c5c" },
              ":focus": { "background-color": "#8f5c5c" },
            },
          },
        },
        toggle: { styles: { toggle: { display: "none" } } },
      };

      slots.forEach((slot) => {
        slot.innerHTML = "";
        ui.createComponent("product", {
          id: config.products[slot.dataset.shopifyProduct],
          node: slot,
          moneyFormat: "%C2%A5%7B%7Bamount_no_decimals%7D%7D",
          options,
        });
      });

      cartToggles.forEach((toggle) => {
        toggle.setAttribute("href", "#");
        toggle.addEventListener("click", (event) => {
          event.preventDefault();
          ui.openCart();
        });
      });

      setTimeout(updateCount, 1500);
    })
    .catch(() => {
      // Keep the "Coming soon" fallback if Shopify cannot be reached.
    });
})();
