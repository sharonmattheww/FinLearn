import React from "react";

function Footer() {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "1.2rem",
        backgroundColor: "#1e3a5f",
        color: "#94a3b8",
        fontSize: "0.85rem",
        marginTop: "auto",
      }}
    >
      <p>
        © {new Date().getFullYear()} FinLearn — Financial Literacy for Everyone
      </p>
    </footer>
  );
}

export default Footer;
