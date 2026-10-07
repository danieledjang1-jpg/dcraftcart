import { useMemo, useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { defaults, findOption, label } from "./data/productData";
import { priceFor, money } from "./utils/pricing";
import { validateShipping } from "./utils/validation";
import ProductPreview from "./components/ProductPreview";
import Customizer from "./components/Customizer";
import CartDrawer from "./components/CartDrawer";
const blank = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postal: "",
  country: "",
  instructions: "",
};
function Header({ count, onCart }) {
  const [menu, setMenu] = useState(false);
  return (
    <header className="site-header">
      <a className="logo" href="#top">
        D<span>CRAFT</span>CART
      </a>
      <nav className={menu ? "visible" : ""}>
        <a onClick={() => setMenu(false)} href="#customize">
          Customize
        </a>
        <a onClick={() => setMenu(false)} href="#how">
          How it works
        </a>
        <a onClick={() => setMenu(false)} href="#reviews">
          Reviews
        </a>
      </nav>
      <button className="cart-button" onClick={onCart} aria-label="Open cart">
        Bag <em>{count}</em>
      </button>
      <button
        className={"hamburger " + (menu ? "active" : "")}
        aria-label="Toggle menu"
        aria-expanded={menu}
        onClick={() => setMenu(!menu)}
      >
        <i />
        <i />
        <i />
      </button>
    </header>
  );
}
function Assistant({ total }) {
  const [open, setOpen] = useState(false),
    [messages, setMessages] = useState([
      {
        bot: true,
        text: "Hi! I'm D-CraftBot 👟 I can help you choose the perfect sneaker configuration.",
      },
    ]),
    [input, setInput] = useState("");
  const ask = (q) => {
    if (!q.trim()) return;
    const t = q.toLowerCase();
    let answer = t.includes("price")
      ? `Your current configuration is ${money(total)}.`
      : t.includes("material")
        ? "Premium Leather is durable and elevated; Suede is softer with a more textured finish. For daily wear, choose leather."
        : t.includes("everyday") || t.includes("recommend")
          ? "For everyday versatility: Premium Leather, Performance Sole, and Reflective Laces is a balanced favorite."
          : t.includes("cheap")
            ? "The entry configuration starts at $120 with Standard Mesh, Classic Sole, Classic Laces, and Standard hardware."
            : "I can help compare materials, recommend an everyday setup, or explain your current price.";
    setMessages((m) => [...m, { text: q }, { bot: true, text: answer }]);
    setInput("");
  };
  return (
    <>
      <button
        className="bot-fab"
        onClick={() => setOpen(true)}
        aria-label="Open D-CraftBot"
      >
        ✦
      </button>
      {open && (
        <section className="chat" aria-label="D-CraftBot assistant">
          <header>
            <div>
              <b>D-CraftBot</b>
              <small>Product concierge</small>
            </div>
            <button onClick={() => setOpen(false)}>×</button>
          </header>
          <div className="messages">
            {messages.map((m, i) => (
              <p className={m.bot ? "bot" : "user"} key={i}>
                {m.text}
              </p>
            ))}
          </div>
          <div className="suggestions">
            {[
              "Help me choose a material",
              "What is my current price?",
              "Recommend a setup",
            ].map((q) => (
              <button key={q} onClick={() => ask(q)}>
                {q}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
          >
            <input
              aria-label="Ask D-CraftBot"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your pair..."
            />
            <button>↑</button>
          </form>
        </section>
      )}
    </>
  );
}
function Checkout({ cart, shipping, setShipping, onBack, onSuccess }) {
  const [errors, setErrors] = useState({}),
    [loading, setLoading] = useState(false);
  const total = cart.reduce((s, x) => s + x.price * x.qty, 0);
  const change = (e) =>
    setShipping((s) => ({ ...s, [e.target.name]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    const bad = validateShipping(shipping);
    setErrors(bad);
    if (Object.keys(bad).length) return;
    setLoading(true);
    setTimeout(() => onSuccess(), 2000);
  };
  if (!cart.length)
    return (
      <section className="checkout">
        <h1>Your bag is empty.</h1>
        <button className="button" onClick={onBack}>
          Return to customizer
        </button>
      </section>
    );
  return (
    <main className="checkout">
      <div className="steps">
        <span>01 Customize</span>
        <span className="on">02 Shipping</span>
        <span>03 Review</span>
      </div>
      <div className="checkout-grid">
        <form onSubmit={submit}>
          <div className="eyebrow">Secure delivery</div>
          <h1>Where should we send it?</h1>
          <div className="form-grid">
            {[
              ["firstName", "First name"],
              ["lastName", "Last name"],
              ["email", "Email"],
              ["phone", "Phone number"],
              ["address", "Address"],
              ["city", "City"],
              ["state", "State / Province"],
              ["postal", "Postal code"],
              ["country", "Country"],
            ].map(([name, text]) => (
              <label className={name === "address" ? "wide" : ""} key={name}>
                {text}
                <input
                  name={name}
                  value={shipping[name]}
                  onBlur={() => setErrors(validateShipping(shipping))}
                  onChange={change}
                />
                {errors[name] && (
                  <small className="error">{errors[name]}</small>
                )}
              </label>
            ))}
            <label className="wide">
              Delivery instructions{" "}
              <textarea
                name="instructions"
                value={shipping.instructions}
                onChange={change}
              />
            </label>
          </div>
          <div className="checkout-actions">
            <button type="button" className="text-button" onClick={onBack}>
              ← Back to customizing
            </button>
            <button className="button" disabled={loading}>
              {loading ? "Crafting your order…" : "Review & place order →"}
            </button>
          </div>
        </form>
        <aside className="order-card">
          <h3>Your order</h3>
          {cart.map((x) => (
            <div key={x.id}>
              <b>DCRAFT / One × {x.qty}</b>
              <span>
                {label("material", x.config.material)} ·{" "}
                {label("sole", x.config.sole)}
              </span>
              <strong>{money(x.price * x.qty)}</strong>
            </div>
          ))}
          <footer>
            Total <b>{money(total)}</b>
          </footer>
        </aside>
      </div>
    </main>
  );
}
function Success({ order, onShop }) {
  return (
    <main className="success">
      <div className="check">✓</div>
      <div className="eyebrow">Order confirmed / demo</div>
      <h1>Your creation is confirmed.</h1>
      <p>
        Order <b>{order.number}</b> is being prepared for {order.name}.
        Estimated delivery: 7–10 business days.
      </p>
      <div className="success-card">
        <span>DCRAFT / One</span>
        <b>{order.total}</b>
        <small>{order.destination}</small>
      </div>
      <button className="button" onClick={onShop}>
        Continue shopping →
      </button>
    </main>
  );
}
export default function App() {
  const [config, setConfig] = useLocalStorage("dcraft-config", defaults),
    [cart, setCart] = useLocalStorage("dcraft-cart", []),
    [shipping, setShipping] = useLocalStorage("dcraft-shipping", blank),
    [view, setView] = useLocalStorage("dcraft-view", "home"),
    [drawer, setDrawer] = useState(false),
    [toast, setToast] = useState(""),
    [order, setOrder] = useState(null);
  const total = useMemo(() => priceFor(config), [config]);
  const notify = (t) => {
    setToast(t);
    setTimeout(() => setToast(""), 2800);
  };
  const add = () => {
    setCart((c) => [
      ...c,
      {
        id: crypto.randomUUID(),
        config: { ...config, addons: [...config.addons] },
        price: total,
        qty: 1,
        color: findOption("color", config.color)?.[3],
      },
    ]);
    notify("Your custom pair was added to the cart.");
    setDrawer(true);
  };
  const checkout = () => {
    setDrawer(false);
    setView("checkout");
  };
  const success = () => {
    const grand = cart.reduce((s, x) => s + x.price * x.qty, 0);
    setOrder({
      number: `DC-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      name: shipping.firstName,
      total: money(grand),
      destination: `${shipping.city}, ${shipping.country}`,
    });
    setCart([]);
    setView("success");
  };
  if (view === "checkout")
    return (
      <Checkout
        cart={cart}
        shipping={shipping}
        setShipping={setShipping}
        onBack={() => setView("home")}
        onSuccess={success}
      />
    );
  if (view === "success" && order)
    return <Success order={order} onShop={() => setView("home")} />;
  return (
    <>
      <div id="top" />
      <Header
        count={cart.reduce((s, x) => s + x.qty, 0)}
        onCart={() => setDrawer(true)}
      />
      <main>
        <section className="hero">
          <div>
            <div className="eyebrow">DCRAFT / 2026 COLLECTION</div>
            <h1>
              Build Your Pair.
              <br />
              <i>Make It Yours.</i>
            </h1>
            <p>
              Design premium sneakers around your life, down to every material,
              sole, and finishing touch.
            </p>
            <div className="hero-actions">
              <a className="button" href="#customize">
                Start customizing →
              </a>
              <a className="outline" href="#how">
                Explore options
              </a>
            </div>
          </div>
          <ProductPreview config={config} />
        </section>
        <section className="studio">
          <Customizer
            config={config}
            setConfig={setConfig}
            total={total}
            onAdd={add}
            onReset={() => {
              setConfig(defaults);
              notify("Configuration reset to the original design.");
            }}
          />
          <div className="sticky-preview">
            <ProductPreview config={config} />
            <p>Made in small batches. Built around you.</p>
          </div>
        </section>
        <section id="how" className="how">
          <div className="eyebrow">Made personal, simply</div>
          <h2>From blank canvas to your doorstep.</h2>
          <div>
            {[
              [
                "01",
                "Choose your base",
                "Begin with a color and silhouette that feels like you.",
              ],
              [
                "02",
                "Customize every detail",
                "Tune material, laces, hardware and performance.",
              ],
              [
                "03",
                "Review your creation",
                "See your specification and live price in one place.",
              ],
              [
                "04",
                "Place your order",
                "We craft your pair in our specialist studio.",
              ],
            ].map((x) => (
              <article key={x[0]}>
                <b>{x[0]}</b>
                <h3>{x[1]}</h3>
                <p>{x[2]}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="reviews" className="reviews">
          <div>
            <div className="eyebrow">Demo customer feedback</div>
            <h2>Designed to be remembered.</h2>
          </div>
          <blockquote>
            “The configurator made every decision feel intentional. The pair I
            imagined is exactly the pair I made.”
            <footer>— Jordan T., fictional demo customer</footer>
          </blockquote>
        </section>
      </main>
      <footer className="site-footer">
        <b>
          D<span>CRAFT</span>CART
        </b>
        <p>Build Your Pair. Make It Yours.</p>
        <small>
          Client-side product demonstration. No real fulfillment is processed.
        </small>
      </footer>
      <CartDrawer
        open={drawer}
        onClose={() => setDrawer(false)}
        cart={cart}
        setCart={setCart}
        onCheckout={checkout}
      />
      <Assistant total={total} />
      {toast && (
        <div className="toast" role="status">
          ✓ {toast}
          <button onClick={() => setToast("")}>×</button>
        </div>
      )}
    </>
  );
}
