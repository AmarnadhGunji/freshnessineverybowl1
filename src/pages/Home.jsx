import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>

      {/* =========================
          ANIMATED BACKGROUND
      ========================= */}

      <div
        style={{
          ...styles.circle,
          ...styles.circle1,
        }}
      ></div>

      <div
        style={{
          ...styles.circle,
          ...styles.circle2,
        }}
      ></div>

      <div
        style={{
          ...styles.circle,
          ...styles.circle3,
        }}
      ></div>


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <div style={styles.content}>

        {/* Badge */}

        <div style={styles.badge}>
          🍓 Fresh • Healthy • Delicious
        </div>


        {/* Heading */}

        <h1 style={styles.title}>
          Freshness in
          <span style={styles.highlight}>
            Every Bowl
          </span>
        </h1>


        {/* Description */}

        <p style={styles.description}>
          Enjoy fresh fruit bowls, delicious juices,
          refreshing lassi and creamy milkshakes
          delivered to your doorstep.
        </p>


        {/* =========================
            BUTTONS
        ========================= */}

        <div style={styles.buttonContainer}>

          {/* SHOP NOW */}

          <button
            style={styles.shopButton}
            onClick={() => navigate("/products")}
            onMouseEnter={(event) => {
              event.currentTarget.style.transform =
                "translateY(-5px) scale(1.04)";

              event.currentTarget.style.boxShadow =
                "0 15px 35px rgba(34,197,94,0.35)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.transform =
                "translateY(0) scale(1)";

              event.currentTarget.style.boxShadow =
                "0 8px 25px rgba(34,197,94,0.25)";
            }}
          >
            Shop Now 🛒
          </button>


          {/* ADMIN DASHBOARD */}

          <button
            style={styles.adminButton}
            onClick={() => navigate("/admin-dashboard")}
            onMouseEnter={(event) => {
              event.currentTarget.style.transform =
                "translateY(-5px)";

              event.currentTarget.style.background =
                "#15803d";

              event.currentTarget.style.color =
                "#ffffff";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.transform =
                "translateY(0)";

              event.currentTarget.style.background =
                "#ffffff";

              event.currentTarget.style.color =
                "#15803d";
            }}
          >
            Admin Dashboard ⚙️
          </button>

        </div>


        {/* =========================
            FEATURES
        ========================= */}

        <div style={styles.features}>

          <div style={styles.feature}>
            <span style={styles.icon}>
              🍎
            </span>

            <span>
              Fresh Fruits
            </span>
          </div>


          <div style={styles.feature}>
            <span style={styles.icon}>
              🥤
            </span>

            <span>
              Fresh Drinks
            </span>
          </div>


          <div style={styles.feature}>
            <span style={styles.icon}>
              🚚
            </span>

            <span>
              Fast Delivery
            </span>
          </div>

        </div>

      </div>


      {/* =========================
          FLOATING FRUIT BOWL
      ========================= */}

      <div style={styles.bowlContainer}>

        <div style={styles.glow}></div>

        <div style={styles.bowl}>

          🍓 🍊
          <br />

          🍎 🥝
          <br />

          🍌 🍉

        </div>

      </div>


      {/* =========================
          ANIMATIONS
      ========================= */}

      <style>
        {`

          @keyframes float {

            0% {
              transform: translateY(0px);
            }

            50% {
              transform: translateY(-20px);
            }

            100% {
              transform: translateY(0px);
            }

          }


          @keyframes moveCircle {

            0% {
              transform:
                translate(0, 0)
                scale(1);
            }

            50% {
              transform:
                translate(30px, -30px)
                scale(1.1);
            }

            100% {
              transform:
                translate(0, 0)
                scale(1);
            }

          }


          @keyframes glow {

            0% {
              transform: scale(1);
              opacity: 0.5;
            }

            50% {
              transform: scale(1.2);
              opacity: 0.8;
            }

            100% {
              transform: scale(1);
              opacity: 0.5;
            }

          }


          @media (max-width: 768px) {

            .home-title {
              font-size: 42px !important;
            }

            .home-description {
              font-size: 16px !important;
            }

            .home-bowl {
              display: none;
            }

          }

        `}
      </style>

    </div>
  );
}


/* =====================================================
   STYLES
===================================================== */

const styles = {

  /* FULL SCREEN */

  page: {

    minHeight: "100vh",

    width: "100%",

    position: "relative",

    overflow: "hidden",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    background:
      "linear-gradient(135deg, #f0fdf4 0%, #ffffff 45%, #ecfdf5 100%)",

    fontFamily:
      "Arial, Helvetica, sans-serif",

    boxSizing: "border-box",
  },


  /* MAIN CONTENT */

  content: {

    width: "90%",

    maxWidth: "700px",

    textAlign: "center",

    zIndex: 5,

    padding: "40px 20px",
  },


  /* BADGE */

  badge: {

    display: "inline-block",

    padding: "10px 20px",

    borderRadius: "30px",

    background:
      "rgba(255,255,255,0.85)",

    border:
      "1px solid #bbf7d0",

    color: "#15803d",

    fontSize: "15px",

    fontWeight: "600",

    marginBottom: "25px",

    boxShadow:
      "0 5px 20px rgba(34,197,94,0.08)",
  },


  /* TITLE */

  title: {

    margin: "0",

    fontSize: "64px",

    lineHeight: "1.05",

    fontWeight: "800",

    color: "#14532d",

    letterSpacing: "-2px",
  },


  /* GREEN TITLE */

  highlight: {

    display: "block",

    color: "#16a34a",

    marginTop: "8px",
  },


  /* DESCRIPTION */

  description: {

    maxWidth: "600px",

    margin:
      "25px auto",

    color: "#4b5563",

    fontSize: "18px",

    lineHeight: "1.7",
  },


  /* BUTTON CONTAINER */

  buttonContainer: {

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    gap: "15px",

    marginTop: "10px",

    flexWrap: "wrap",
  },


  /* SHOP BUTTON */

  shopButton: {

    border: "none",

    padding: "16px 38px",

    borderRadius: "35px",

    background:
      "linear-gradient(135deg, #22c55e, #16a34a)",

    color: "#ffffff",

    fontSize: "18px",

    fontWeight: "700",

    cursor: "pointer",

    boxShadow:
      "0 8px 25px rgba(34,197,94,0.25)",

    transition:
      "all 0.3s ease",
  },


  /* ADMIN BUTTON */

  adminButton: {

    border:
      "2px solid #15803d",

    padding: "14px 28px",

    borderRadius: "35px",

    background: "#ffffff",

    color: "#15803d",

    fontSize: "16px",

    fontWeight: "700",

    cursor: "pointer",

    transition:
      "all 0.3s ease",
  },


  /* FEATURES */

  features: {

    display: "flex",

    justifyContent: "center",

    gap: "35px",

    marginTop: "45px",

    flexWrap: "wrap",
  },


  feature: {

    display: "flex",

    alignItems: "center",

    gap: "8px",

    color: "#374151",

    fontSize: "14px",

    fontWeight: "600",
  },


  icon: {

    fontSize: "24px",
  },


  /* FLOATING BOWL */

  bowlContainer: {

    position: "absolute",

    right: "8%",

    bottom: "12%",

    width: "170px",

    height: "170px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    animation:
      "float 4s ease-in-out infinite",

    zIndex: 2,
  },


  /* BOWL */

  bowl: {

    width: "130px",

    height: "130px",

    borderRadius: "50%",

    background:
      "linear-gradient(145deg, #ffffff, #dcfce7)",

    border:
      "8px solid #22c55e",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    textAlign: "center",

    fontSize: "28px",

    lineHeight: "1.4",

    boxShadow:
      "0 20px 50px rgba(34,197,94,0.2)",

    zIndex: 2,
  },


  /* GLOW */

  glow: {

    position: "absolute",

    width: "170px",

    height: "170px",

    borderRadius: "50%",

    background:
      "rgba(74,222,128,0.18)",

    animation:
      "glow 3s ease-in-out infinite",
  },


  /* BACKGROUND CIRCLES */

  circle: {

    position: "absolute",

    borderRadius: "50%",

    filter: "blur(2px)",

    animation:
      "moveCircle 7s ease-in-out infinite",
  },


  circle1: {

    width: "300px",

    height: "300px",

    background:
      "rgba(134,239,172,0.25)",

    top: "-120px",

    left: "-100px",
  },


  circle2: {

    width: "250px",

    height: "250px",

    background:
      "rgba(187,247,208,0.35)",

    bottom: "-100px",

    right: "25%",

    animationDelay: "2s",
  },


  circle3: {

    width: "180px",

    height: "180px",

    background:
      "rgba(74,222,128,0.15)",

    top: "20%",

    right: "-60px",

    animationDelay: "4s",
  },

};


export default Home;