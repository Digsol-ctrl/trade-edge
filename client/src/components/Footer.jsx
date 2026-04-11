export default function Footer() {
  return (
    <footer style={{
      background: "var(--surface)",
      borderTop: "1px solid var(--border)",
      padding: "60px 32px 30px",
      marginTop: 80,
      fontFamily: "'Inter', sans-serif"
    }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        
        {/* Disclaimer */}
        <div style={{
          textAlign: "center",
          fontSize: 11,
          color: "var(--muted)",
          fontStyle: "italic",
          lineHeight: 1.6
        }}>
          <p>
            The Spec King is a trade journaling and analytics tool. We do not provide financial advice, investment recommendations, or trading signals. All trading involves risk. You are solely responsible for your trading decisions.
          </p>
          <p style={{ marginTop: 12 }}>
            © 2024 The Spec King. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
