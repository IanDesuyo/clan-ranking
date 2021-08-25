import { useState, useEffect } from "react";
import { ChevronUpIcon } from "@chakra-ui/icons";
import { IconButton } from "@chakra-ui/react";

export default function ScrollToTop() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = () => {
    setScrollPosition(window.pageYOffset);
  };

  const goTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <IconButton
      opacity={scrollPosition > 500 ? 1 : 0}
      sx={{ transition: "opacity 0.5s ease" }}
      icon={<ChevronUpIcon />}
      position="fixed"
      bottom="20px"
      right={["16px", "100px"]}
      zIndex={1}
      onClick={scrollPosition > 500 ? goTop : null}
    />
  );
}
