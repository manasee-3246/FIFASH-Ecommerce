import { useEffect, useState } from "react";
import axios from "axios";

function Banner() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/banner/all`);
      // Filter out active banners that have a valid uploaded image (ignores broken old records)
      const activeBanners = res.data.filter((b) => b.isActive && b.image);
      setBanners(activeBanners);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [banners]);

  if (banners.length === 0) {
    return null;
  }

  return (
    <div 
      className="hero-section" 
      style={{ 
        position: "relative", 
        width: "100%", 
        height: "500px", 
        overflow: "hidden",
        marginBottom: "60px",
        borderRadius: "32px",
        boxShadow: "0 18px 44px rgba(79, 54, 30, 0.08)"
      }}
    >
      {banners.map((banner, index) => {
        const src = banner.image || banner.bannerImage;
        let validSrc = src ? (src.startsWith("http") ? src : `${import.meta.env.VITE_API_URL}/${src}`) : "";

        // Safety: only encode the part after the protocol to avoid double encoding http://
        if (validSrc.startsWith("http")) {
          try {
            const url = new URL(validSrc);
            url.pathname = encodeURI(decodeURI(url.pathname));
            validSrc = url.toString();
          } catch (e) {
            console.error("Invalid URL:", validSrc);
          }
        }

        return (
          <img
            key={banner._id || index}
            src={validSrc}
            alt={banner.title || "Hero Banner"}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: index === currentIndex ? 1 : 0,
              transition: "opacity 0.8s ease-in-out",
            }}
          />
        );
      })}
    </div>
  );
}

export default Banner;