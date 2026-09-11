import Header from "./components/Header";
import MainSlide from "./slides/MainSlide";
import IntroSlide from "./slides/IntroSlide";
import FooterSlide from "./slides/FooterSlide";

import "./styles/global.css";
import "./styles/header.css";
import "./styles/mainSlide.css";
import "./styles/introSlide.css";
import "./styles/footerSlide.css";
import "./styles/textarea.css";

function App_render() {
  return (
    <div className="app_page">
      <Header />

      <div className="app_topBlurOverlay"></div>

      <main className="app_main">
        <MainSlide />
        <IntroSlide />
        <FooterSlide />
      </main>
    </div>
  );
}

export default App_render;