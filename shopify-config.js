// Shopify connection settings for the cart and "カートに入れる" buttons.
// Leave a value empty ("") until it is known. While domain or token is empty,
// the size cards keep showing "Coming soon" and the cart icon links to #size.
// The Storefront access token is a public, read-only token meant for websites (safe to commit).
window.NEKOMANEKI_SHOPIFY = {
  // e.g. "nekomaneki.myshopify.com"
  domain: "",
  // Shopify admin → Buy Button channel / Headless → Storefront API access token
  storefrontAccessToken: "",
  // Product IDs (numbers) for each size, from the Shopify admin URL of each product
  products: {
    s: "",
    m: "",
    l: "",
  },
  // Customer login page URL from Shopify (Settings → Customer accounts)
  accountUrl: "",
};
