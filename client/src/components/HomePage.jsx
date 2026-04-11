import { useState, useEffect } from "react";
import { isAuthenticated } from "../services/authService";
import Footer from "./Footer";
import { FaGift, FaChartBar, FaCreditCard, FaLock, FaClipboardList, FaChartLine, FaLockOpen, FaGlobe, FaBolt } from "react-icons/fa";

export default function HomePage({ onShowLogin, onShowSignup }) {
  const [dismissedDisclaimer, setDismissedDisclaimer] = useState(false);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      window.location.reload();
    }
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      color: "var(--text)",
      fontFamily: "'Inter', sans-serif"
    }}>
      <style>{`
        :root {
          --bg: #04060f;
          --surface: #090d1a;
          --surface2: #0f1525;
          --surface3: #161d2e;
          --border: rgba(255,255,255,0.05);
          --border2: rgba(255,255,255,0.1);
          --accent: #4682B4;
          --accent-dim: rgba(70,130,180,0.1);
          --accent-glow: rgba(70,130,180,0.25);
          --blue: #3b82f6;
          --blue-dim: rgba(59,130,246,0.12);
          --red: #f43f5e;
          --red-dim: rgba(244,63,94,0.12);
          --gold: #f59e0b;
          --text: #dde1ef;
          --text2: #8892a8;
          --muted: #3d4660;
        }
        h1, h2, h3, h4, h5, h6 { font-family: 'Space Grotesk', sans-serif; }
      `}</style>

      {/* Navbar */}
      <nav style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        height: 64,
        borderBottom: "1px solid var(--border)",
        background: "rgba(4,6,15,0.95)",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 16,
            color: "#fff"
          }}>◆</div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>The Spec King</span>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <button
            onClick={onShowLogin}
            style={{
              padding: "8px 20px",
              background: "transparent",
              border: "1px solid var(--accent)",
              color: "var(--accent)",
              borderRadius: 8,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "var(--accent-dim)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
            }}
          >
            Login
          </button>
          <button
            onClick={onShowSignup}
            style={{
              padding: "8px 20px",
              background: "var(--accent)",
              border: "none",
              color: "#fff",
              borderRadius: 8,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 800,
              fontSize: 13,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = "0.9";
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = "1";
            }}
          >
            Start Free
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: "80px 32px 60px",
        maxWidth: "1280px",
        margin: "0 auto",
        textAlign: "center"
      }}>
        <div style={{ marginBottom: 24 }}>
          <span style={{
            display: "inline-block",
            padding: "6px 16px",
            background: "var(--accent-dim)",
            border: "1px solid var(--accent-dim)",
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 700,
            color: "var(--accent)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 16
          }}>✓ Professional Trade Journal</span>
        </div>

        <h1 style={{
          fontSize: 64,
          fontWeight: 800,
          marginBottom: 16,
          letterSpacing: "-0.02em",
          lineHeight: 1.1
        }}>
          Your Complete Trading<br />Operating System
        </h1>
        <p style={{
          fontSize: 20,
          color: "var(--text2)",
          marginBottom: 12,
          maxWidth: 700,
          margin: "0 auto",
          lineHeight: 1.6
        }}>
          All-in-one trade journal, performance analytics, and pro tools. Transform trading insights into consistent profitability.
        </p>
        
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          marginBottom: 32,
          fontSize: 13,
          color: "var(--text2)"
        }}>
          <span>🎯 Track Every Trade</span>
          <span>•</span>
          <span>💳 Free plan stays free. No credit card.</span>
        </div>

        <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
          <button
            onClick={onShowSignup}
            style={{
              padding: "14px 32px",
              background: "var(--accent)",
              border: "none",
              color: "#fff",
              borderRadius: 8,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 800,
              fontSize: 15,
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 0 24px rgba(70,130,180,0.25)"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 32px rgba(70,130,180,0.35)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 0 24px rgba(70,130,180,0.25)";
            }}
          >
            Get Started Free →
          </button>
          <button
            onClick={onShowLogin}
            style={{
              padding: "14px 32px",
              background: "transparent",
              border: "1px solid var(--border2)",
              color: "var(--text)",
              borderRadius: 8,
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "var(--accent)";
              e.target.style.color = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "var(--border2)";
              e.target.style.color = "var(--text)";
            }}
          >
            See Demo
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{
        padding: "60px 32px",
        background: "linear-gradient(180deg, var(--bg) 0%, var(--surface) 100%)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)"
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: 40,
            textAlign: "center"
          }}>
            {[
              { number: "100%", label: "Free Forever", icon: <FaGift size={40} /> },
              { number: "∞", label: "Unlimited Trades", icon: <FaChartBar size={40} /> },
              { number: "0%", label: "Credit Card Required", icon: <FaCreditCard size={40} /> },
              { number: "24/7", label: "Your Data", icon: <FaLock size={40} /> }
            ].map((stat, i) => (
              <div key={i}>
                <div style={{ fontSize: 48, marginBottom: 12, color: "var(--accent)" }}>{stat.icon}</div>
                <div style={{
                  fontSize: 36,
                  fontWeight: 800,
                  color: "var(--accent)",
                  marginBottom: 6
                }}>
                  {stat.number}
                </div>
                <div style={{ color: "var(--text2)", fontSize: 14 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{
        padding: "80px 32px",
        maxWidth: "1280px",
        margin: "0 auto"
      }}>
        <h2 style={{
          fontSize: 36,
          fontWeight: 800,
          marginBottom: 60,
          textAlign: "center",
          letterSpacing: "-0.02em"
        }}>
          Browse Your Trading Toolkit
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24
        }}>
          {[
            {
              icon: <FaClipboardList size={40} style={{ marginBottom: 16 }} />,
              tier: "FREE",
              title: "Trade Journal",
              desc: "Journal every trade with entry/exit, stop loss, take profit, strategy tags, and detailed notes. Capture your setup and lessons learned."
            },
            {
              icon: <FaChartLine size={40} style={{ marginBottom: 16 }} />,
              tier: "FREE",
              title: "Analytics Dashboard",
              desc: "Track win rate, P&L, R-multiple, and review trade patterns. See what's really working in your strategies."
            }
          ].map((feature, i) => (
            <div
              key={i}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 32,
                transition: "all 0.3s",
                position: "relative",
                overflow: "hidden"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.boxShadow = "0 0 32px rgba(70,130,180,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{
                display: "inline-block",
                padding: "4px 10px",
                background: feature.tier === "FREE" ? "var(--accent-dim)" : "var(--red-dim)",
                color: feature.tier === "FREE" ? "var(--accent)" : "var(--red)",
                borderRadius: 4,
                fontSize: 10,
                fontWeight: 700,
                marginBottom: 12,
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}>
                {feature.tier}
              </div>
              <div style={{ fontSize: 40, marginBottom: 16, color: "var(--accent)" }}>{feature.icon}</div>
              <h3 style={{
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 12,
                color: "var(--text)"
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: 14,
                color: "var(--text2)",
                lineHeight: 1.6
              }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{
        padding: "80px 32px",
        background: "linear-gradient(180deg, var(--bg) 0%, var(--surface) 100%)",
        borderTop: "1px solid var(--border)"
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <h2 style={{
            fontSize: 36,
            fontWeight: 800,
            marginBottom: 60,
            textAlign: "center",
            letterSpacing: "-0.02em"
          }}>
            Get Better at Trading
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 40
          }}>
            {[
              {
                number: "01",
                title: "Journal Trades",
                desc: "Log every trade with entry/exit, stop loss, take profit, strategy tags, and detailed notes. Capture what matters."
              },
              {
                number: "02",
                title: "Analyze Patterns",
                desc: "Filter by setup, timeframe, session, or account. See which strategies work and which ones waste capital."
              },
              {
                number: "03",
                title: "Improve Consistently",
                desc: "Identify weaknesses, track progress, and refine your edge. Data-driven trading beats guesswork."
              }
            ].map((step, i) => (
              <div key={i}>
                <div style={{
                  fontSize: 48,
                  fontWeight: 800,
                  color: "var(--accent)",
                  marginBottom: 16,
                  opacity: 0.3
                }}>
                  {step.number}
                </div>
                <h3 style={{
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 12,
                  color: "var(--text)"
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: 14,
                  color: "var(--text2)",
                  lineHeight: 1.7
                }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section style={{
        padding: "80px 32px",
        background: "linear-gradient(180deg, var(--bg) 0%, var(--surface) 100%)",
        borderTop: "1px solid var(--border)"
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <h2 style={{
            fontSize: 36,
            fontWeight: 800,
            marginBottom: 60,
            textAlign: "center",
            letterSpacing: "-0.02em"
          }}>
            Your Data, Your Privacy
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24
          }}>
            {[
              { icon: <FaLock size={40} />, title: "Secure Storage", desc: "Your trading data is encrypted and protected. We never share your data with third parties." },
              { icon: <FaLockOpen size={40} />, title: "Ownership", desc: "All your trade journals and analytics belong to you. You can export your data anytime." },
              { icon: <FaGlobe size={40} />, title: "Web-Based Access", desc: "Access your journal from any device, anywhere. Your data syncs across browsers." },
              { icon: <FaBolt size={40} />, title: "Fast & Reliable", desc: "Built for traders who need speed and reliability when logging trades." }
            ].map((trust, i) => (
              <div
                key={i}
                style={{
                  background: "var(--surface2)",
                  borderRadius: 12,
                  padding: 28,
                  textAlign: "center"
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 16, color: "var(--accent)" }}>{trust.icon}</div>
                <h3 style={{
                  fontSize: 16,
                  fontWeight: 700,
                  marginBottom: 10,
                  color: "var(--text)"
                }}>
                  {trust.title}
                </h3>
                <p style={{
                  fontSize: 13,
                  color: "var(--text2)",
                  lineHeight: 1.6
                }}>
                  {trust.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{
        padding: "80px 32px",
        maxWidth: "900px",
        margin: "0 auto"
      }}>
        <h2 style={{
          fontSize: 36,
          fontWeight: 800,
          marginBottom: 60,
          textAlign: "center",
          letterSpacing: "-0.02em"
        }}>
          Frequently Asked Questions
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            {
              q: "What is The Spec King?",
              a: "The Spec King is a professional trade journaling and performance analytics platform designed to help traders track, analyze, and improve their trading edge. We handle the data so you can focus on the trading."
            },
            {
              q: "How do I get started?",
              a: "Create a free account in under 60 seconds. Log your first trade, then start building your journal. No credit card required to get started."
            },
            {
              q: "Is my data secure?",
              a: "Yes. Your trading data is encrypted and protected. We never share your data with third parties. Your data ownership is guaranteed."
            },
            {
              q: "Can I use it on mobile?",
              a: "The platform is responsive and works on mobile browsers. You can access your journal from any device with a web browser."
            },
            {
              q: "Do you offer customer support?",
              a: "Yes, we have support available. You can reach out for help with getting started or using the platform features."
            },
            {
              q: "What's the difference between Free and Pro?",
              a: "Free plan includes trade journaling and analytics dashboard. Coming soon: Pro tier with advanced features to help you refine your trading edge."
            }
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 24,
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              <h3 style={{
                fontSize: 15,
                fontWeight: 700,
                marginBottom: 10,
                color: "var(--accent)"
              }}>
                {item.q}
              </h3>
              <p style={{
                fontSize: 13,
                color: "var(--text2)",
                lineHeight: 1.6,
                margin: 0
              }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        padding: "80px 32px",
        maxWidth: "1280px",
        margin: "0 auto",
        textAlign: "center"
      }}>
        <h2 style={{
          fontSize: 40,
          fontWeight: 800,
          marginBottom: 24,
          letterSpacing: "-0.02em"
        }}>
          Start Your Trade Journal Today
        </h2>
        <p style={{
          fontSize: 16,
          color: "var(--text2)",
          marginBottom: 32,
          maxWidth: 600,
          margin: "0 auto 32px"
        }}>
          Start your free journal today. Upgrade when you're ready. No credit card required.
        </p>
        <button
          onClick={onShowSignup}
          style={{
            padding: "16px 48px",
            background: "var(--accent)",
            border: "none",
            color: "#fff",
            borderRadius: 8,
            fontFamily: "'Inter', sans-serif",
            fontWeight: 800,
            fontSize: 16,
            cursor: "pointer",
            transition: "all 0.2s",
            boxShadow: "0 0 24px rgba(70,130,180,0.25)"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 8px 32px rgba(70,130,180,0.35)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 0 24px rgba(70,130,180,0.25)";
          }}
        >
          Get Started Free →
        </button>
      </section>

      {/* Footer */}
      <Footer />

      {/* Login Disclaimer Banner */}
      {!dismissedDisclaimer && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            background: "var(--surface)",
            borderTop: "1px solid var(--border)",
            padding: "16px 32px",
            zIndex: 150,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 12,
            color: "var(--text2)",
            lineHeight: 1.6
          }}
        >
          <p style={{ marginBottom: 0, maxWidth: "calc(100% - 100px)" }}>
            <strong style={{ color: "var(--text)" }}>⚠️ Risk Disclaimer:</strong> The Spec King is a trade journaling tool only. We do not provide financial advice, investment recommendations, or trading signals. All trading involves risk. You are solely responsible for your trading decisions.
          </p>
          <button
            onClick={() => setDismissedDisclaimer(true)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text2)",
              cursor: "pointer",
              fontSize: 20,
              padding: 0,
              flexShrink: 0
            }}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}