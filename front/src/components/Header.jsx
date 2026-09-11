import Logo from "./Logo";
import samchoWordLogo from "../assets/samcho-logo.svg";
import useScrollLogoMotion from "../hooks/useScrollLogoMotion";

function Header_render() {
  const {
    scrollLogoMotion_cubeX,
    scrollLogoMotion_cubeRotation,
    scrollLogoMotion_wordLogoOpacity,
    scrollLogoMotion_wordLogoTranslateX,
  } = useScrollLogoMotion();

  return (
    <header className="header_container">
      <div
        className="header_logoGroup"
        style={{
          transform: `translateX(${scrollLogoMotion_cubeX}px)`,
        }}
      >
        <div
          className="header_cubeLogoWrapper"
          style={{
            transform: `rotate(${scrollLogoMotion_cubeRotation}deg)`,
          }}
        >
          <Logo />
        </div>

        <img
          className="header_wordLogoImage"
          src={samchoWordLogo}
          alt="samcho"
          draggable="false"
          style={{
            opacity: scrollLogoMotion_wordLogoOpacity,
            transform: `translateX(${scrollLogoMotion_wordLogoTranslateX}px)`,
          }}
        />
      </div>
    </header>
  );
}

export default Header_render;