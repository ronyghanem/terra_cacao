import MobileNav from "@/components/MobileNav";
import Stats from "@/components/Stats";
import ReducedMotionVideo from "@/components/ReducedMotionVideo";
import ContactForm from "@/components/ContactForm";
import ContentBars from "@/components/ContentBars";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header" id="top">
        <div className="wrap header-row">
          <a className="wordmark" href="#top">
            Terra <span>Cacao</span>
          </a>

          {/* React mobile navigation */}
          <MobileNav />

          <a className="btn btn-line nav-cta" href="#bars">
            Shop bars
          </a>
        </div>
      </header>

      <main id="main">
        {/* HERO */}
        <section className="hero">
          <ReducedMotionVideo
            src="/video/chocolate-fountain.mp4"
            poster="/video/hero-poster.jpg"
          />

          <div className="hero-overlay" aria-hidden="true"></div>

          <div className="wrap hero-grid">
            <div className="hero-copy">
              <p className="hero-kicker">
                Made from cacao, not from powder
              </p>

              <h1>
                We turn whole
                <br />
                cacao beans into
                <br />
                bars, start
                <br />
                to finish.
              </h1>

              <p className="hero-lede">
                Terra Cacao ferments, roasts, conches and tempers every bar
                in one small workshop. No cocoa powder, no shortcuts — just
                beans we bought ourselves from the farms that grew them.
              </p>

              <div className="hero-actions">
                <a className="btn btn-solid" href="#bars">
                  Explore our bars
                </a>

                <a className="btn btn-ghost" href="#visit">
                  Visit the workshop
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* STORY */}
        <section className="story" id="story">
          <div className="wrap story-grid">
            <div className="story-text">
              <h2>
                Started because good cacao kept leaving as a raw material.
              </h2>

              <p>
                Terra Cacao began in 2015, after our founder spent a season
                buying cacao for a large manufacturer and watched exceptional
                lots get blended away into something anonymous. The idea was
                to buy small, name the farm on the wrapper, and do every step
                — fermenting, roasting, grinding, conching, tempering — under
                one roof.
              </p>

              <p>
                A decade later, that's still the whole process. Nothing is
                outsourced, and nothing is added beyond cacao, sugar and, in a
                few bars, milk from a dairy two valleys over.
              </p>
            </div>

            {/* React count-up stats */}
            <Stats />
          </div>
        </section>

        {/* PROCESS */}
        <section className="process" id="process">
          <div className="wrap">
            <div className="section-head">
              <h2>Bean to bar, in four stages</h2>

              <p>
                The order never changes — what we adjust each batch is timing
                and temperature, tuned to that lot of beans.
              </p>
            </div>

            <ol className="process-list">
              <li className="process-step">
                <span className="step-index">1</span>
                <h3>Ferment</h3>

                <p>
                  Fresh beans ferment in wooden boxes for five to seven days,
                  developing the fruit and cocoa notes that roasting can't
                  create on its own.
                </p>
              </li>

              <li className="process-step">
                <span className="step-index">2</span>
                <h3>Roast</h3>

                <p>
                  Dried beans are roasted in small drums, timed by origin — a
                  fruit-forward lot needs a shorter, cooler roast than a
                  nuttier one.
                </p>
              </li>

              <li className="process-step">
                <span className="step-index">3</span>
                <h3>Conch</h3>

                <p>
                  Ground cacao is conched for up to 72 hours, smoothing
                  texture and rounding off any sharp, acidic edges left from
                  fermentation.
                </p>
              </li>

              <li className="process-step">
                <span className="step-index">4</span>
                <h3>Temper</h3>

                <p>
                  The finished chocolate is tempered and molded by hand,
                  giving every bar its snap and a shine that won't bloom on
                  the shelf.
                </p>
              </li>
            </ol>
          </div>
        </section>

        {/* BARS */}
        <section className="bars" id="bars">
          <div className="wrap">
            <div className="section-head section-head-light">
              <h2>Bars on the shelf this season</h2>

              <p>
                Each origin is limited to what that harvest produced — once a
                bar sells out, it waits for next year's crop.
              </p>
            </div>

           
    <ContentBars />
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="testimonials">
          <div className="wrap testimonial-grid">
            <blockquote className="testimonial">
              <p>
                “The wrapper names the farm and the harvest month. I looked it
                up once, out of curiosity, and it checked out. That's rare in
                chocolate.”
              </p>

              <cite>Sami R., subscriber since 2020</cite>
            </blockquote>

            <blockquote className="testimonial">
              <p>
                “The Chuao bar tastes nothing like the last harvest's, and the
                shop is upfront about that instead of smoothing it into
                sameness.”
              </p>

              <cite>Farah D., wholesale buyer</cite>
            </blockquote>

            <blockquote className="testimonial">
              <p>
                “I don't like most dark chocolate. This is the first 75% bar
                that didn't taste bitter to me.”
              </p>

              <cite>Omar K., first-time customer</cite>
            </blockquote>
          </div>
        </section>

        {/* VISIT */}
        <section className="visit" id="visit">
          <div className="wrap visit-grid">
            <div className="visit-text">
              <h2>Come taste the batch in progress</h2>

              <p>
                The workshop floor is open for walk-in tastings most afternoons
                — see the conches running and try whatever's mid-batch that
                week.
              </p>

              <dl className="visit-details">
                <div>
                  <dt>Address</dt>
                  <dd>27 Founders Row, Harbor District</dd>
                </div>

                <div>
                  <dt>Hours</dt>
                  <dd>Wednesday – Sunday, 11:00 – 18:00</dd>
                </div>

                <div>
                  <dt>Tastings</dt>
                  <dd>Walk-in flights, Wed–Fri at 14:00</dd>
                </div>
              </dl>
            </div>

            <div className="visit-map" aria-hidden="true">
              <svg viewBox="0 0 400 320">
                <rect
                  className="map-block"
                  x="20"
                  y="30"
                  width="120"
                  height="90"
                />

                <rect
                  className="map-block"
                  x="160"
                  y="30"
                  width="90"
                  height="150"
                />

                <rect
                  className="map-block"
                  x="270"
                  y="60"
                  width="110"
                  height="80"
                />

                <rect
                  className="map-block"
                  x="20"
                  y="150"
                  width="90"
                  height="130"
                />

                <rect
                  className="map-block map-highlight"
                  x="130"
                  y="200"
                  width="130"
                  height="80"
                />

                <line
                  className="map-road"
                  x1="0"
                  y1="140"
                  x2="400"
                  y2="140"
                />

                <line
                  className="map-road"
                  x1="150"
                  y1="0"
                  x2="150"
                  y2="320"
                />

                <circle
                  className="map-pin"
                  cx="195"
                  cy="240"
                  r="8"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="newsletter">
          <div className="wrap newsletter-row">
            <div>
              <h2>Hear about new harvests first</h2>

              <p>
                One email a month — a new origin bar, or a note from a farm
                visit. Nothing else.
              </p>
            </div>

            {/* Newsletter will be connected later */}
            <form className="newsletter-form" id="newsletter-form">
              <label
                className="sr-only"
                htmlFor="newsletter-email"
              >
                Email address
              </label>

              <input
                type="email"
                id="newsletter-email"
                name="email"
                placeholder="you@example.com"
                required
              />

              <button type="submit" className="btn btn-solid">
                Subscribe
              </button>
            </form>

            <p
              className="form-status"
              id="form-status"
              role="status"
              aria-live="polite"
            ></p>
          </div>
        </section>
      </main>

     {/* CONTACT */}
        <section className="contact" id="contact">
          <div className="wrap contact-grid">
            <div className="contact-text">
              <p className="section-kicker">Get in touch</p>

              <h2>Have a question about Terra Cacao?</h2>

              <p>
                Whether you have a question about our chocolate, a
                wholesale inquiry, or simply want to say hello, send us
                a message and we'll get back to you.
              </p>

              <div className="contact-details">
                <p>
                  <strong>Email</strong>
                  <br />
                  hello@terracacao.example
                </p>

                <p>
                  <strong>Phone</strong>
                  <br />
                  +1 (000) 000-0000
                </p>
              </div>
            </div>

            <ContactForm />
          </div>
        </section>
    

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="wrap footer-grid">
          <div>
            <a className="wordmark wordmark-footer" href="#top">
              Terra <span>Cacao</span>
            </a>

            <p>
              Single-origin, bean-to-bar chocolate made out of the Harbor
              District.
            </p>
          </div>

          <div className="footer-col">
            <h4>Visit</h4>

            <p>
              27 Founders Row
              <br />
              Harbor District
            </p>

            <p>Wed – Sun, 11:00 – 18:00</p>
          </div>

          <div className="footer-col">
            <h4>Contact</h4>

            <p>
              <a href="mailto:hello@terracacao.example">
                hello@terracacao.example
              </a>
            </p>

            <p>
              <a href="tel:+10000000000">
                +1 (000) 000-0000
              </a>
            </p>
          </div>

          <div className="footer-col">
            <h4>Follow</h4>

            <p>
              <a href="#top">Instagram</a>
            </p>

            <p>
              <a href="#top">Newsletter archive</a>
            </p>
          </div>
        </div>

        <div className="wrap footer-bottom">
          <p>
            © {new Date().getFullYear()} Terra Cacao Chocolate Makers. All
            rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}