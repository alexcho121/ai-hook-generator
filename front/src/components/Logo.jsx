import samchoCubeLogo from "../assets/samcho-cube-logo.svg";

function Logo_render() {
  return (
    <img
      className="logo_cubeImage"
      src={samchoCubeLogo}
      alt="Samcho cube logo"
      draggable="false"
    />
  );
}

export default Logo_render;