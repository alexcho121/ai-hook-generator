function FooterSlide_render() {
  return (
    <section className="footerSlide_section">
      <div className="footerSlide_wrapper">
        <footer className="footerSlide_content">
          <div className="footerSlide_brandBox">

            <h2 className="footerSlide_title">
              좋은 콘텐츠는 강력한
              <br />
              첫 문장에서 시작됩니다.
            </h2>
          </div>

          <nav className="footerSlide_bottomArea" aria-label="Footer navigation">
            <div className="footerSlide_linkBox">
              <a className="footerSlide_link" href="#mainSlide">
                Start
              </a>

              <a className="footerSlide_link" href="mailto:your-email@example.com">
                Contact
              </a>
            </div>

            <p className="footerSlide_copyright">© 2026 samcho</p>
          </nav>
        </footer>

        <p className="footerSlide_notice">
          민감한 개인정보는 입력하지 않는 것을 권장합니다.
        </p>
      </div>
    </section>
  );
}

export default FooterSlide_render;