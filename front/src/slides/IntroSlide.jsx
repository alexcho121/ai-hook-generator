import { useCallback, useEffect, useRef, useState } from "react";

function IntroSlide_render() {
  const introSlide_usageGridRef = useRef(null);

  const introSlide_totalSubmitAnimationFrameRef = useRef(null);
  const introSlide_weeklySubmitAnimationFrameRef = useRef(null);

  const [
    introSlide_animatedTotalSubmitCount,
    introSlide_setAnimatedTotalSubmitCount,
  ] = useState(0);

  const [
    introSlide_animatedWeeklySubmitCount,
    introSlide_setAnimatedWeeklySubmitCount,
  ] = useState(0);

  function introSlide_formatCount(introSlide_count) {
    if (introSlide_count < 1000) {
      return introSlide_count.toLocaleString();
    }

    if (introSlide_count < 10000) {
      const introSlide_formattedCount = introSlide_count / 1000;

      return `${Number(introSlide_formattedCount.toFixed(1))}K`;
    }

    const introSlide_formattedCount = introSlide_count / 1000;

    return `${Math.floor(introSlide_formattedCount)}K`;
  }

  const introSlide_cancelAnimationFrame = useCallback((introSlide_frameRef) => {
    if (introSlide_frameRef.current) {
      cancelAnimationFrame(introSlide_frameRef.current);
      introSlide_frameRef.current = null;
    }
  }, []);

  const introSlide_animateNumber = useCallback(({
    introSlide_from,
    introSlide_to,
    introSlide_duration,
    introSlide_onUpdate,
    introSlide_frameRef,
  }) => {
    introSlide_cancelAnimationFrame(introSlide_frameRef);

    const introSlide_startTime = performance.now();

    function introSlide_updateNumber(introSlide_currentTime) {
      const introSlide_elapsedTime =
        introSlide_currentTime - introSlide_startTime;

      const introSlide_progress = Math.min(
        introSlide_elapsedTime / introSlide_duration,
        1
      );

      const introSlide_easedProgress =
        1 - Math.pow(1 - introSlide_progress, 3);

      const introSlide_currentValue = Math.round(
        introSlide_from +
          (introSlide_to - introSlide_from) * introSlide_easedProgress
      );

      introSlide_onUpdate(introSlide_currentValue);

      if (introSlide_progress < 1) {
        introSlide_frameRef.current = requestAnimationFrame(
          introSlide_updateNumber
        );
      } else {
        introSlide_frameRef.current = null;
      }
    }

    introSlide_frameRef.current = requestAnimationFrame(
      introSlide_updateNumber
    );
  }, [introSlide_cancelAnimationFrame]);

  const introSlide_benefitItems = [
    {
      title: "좋은 아이디어가 지나쳐지지 않도록",
      description:
        "첫 문장은 사용자가 콘텐츠를 계속 볼지 결정하는 가장 중요한 요소예요.",
    },
    {
      title: "플랫폼 맞춤형 문장으로",
      description:
        "TikTok, YouTube, Instagram, Blog처럼 채널마다 다른 접근이 필요해요.",
    },
    {
      title: "시선을 집중시켜요",
      description:
        "막연한 키워드나 설명을 사람들이 이해하기 쉬운 첫 문장으로 정리해요.",
    },
  ];

  const introSlide_totalSubmitCount = 12482;
  const introSlide_weeklySubmitCount = 843;
  const introSlide_hooksPerSubmit = 5;

  useEffect(() => {
    const introSlide_usageGrid = introSlide_usageGridRef.current;

    if (!introSlide_usageGrid) {
      return;
    }

    function introSlide_resetUsageAnimation() {
      introSlide_cancelAnimationFrame(introSlide_totalSubmitAnimationFrameRef);
      introSlide_cancelAnimationFrame(introSlide_weeklySubmitAnimationFrameRef);

      introSlide_setAnimatedTotalSubmitCount(0);
      introSlide_setAnimatedWeeklySubmitCount(0);
    }

    function introSlide_startUsageAnimation() {
      introSlide_resetUsageAnimation();

      introSlide_animateNumber({
        introSlide_from: 0,
        introSlide_to: introSlide_totalSubmitCount,
        introSlide_duration: 2400,
        introSlide_onUpdate: introSlide_setAnimatedTotalSubmitCount,
        introSlide_frameRef: introSlide_totalSubmitAnimationFrameRef,
      });

      introSlide_animateNumber({
        introSlide_from: 0,
        introSlide_to: introSlide_weeklySubmitCount,
        introSlide_duration: 2000,
        introSlide_onUpdate: introSlide_setAnimatedWeeklySubmitCount,
        introSlide_frameRef: introSlide_weeklySubmitAnimationFrameRef,
      });
    }

    const introSlide_observer = new IntersectionObserver(
      (introSlide_entries) => {
        const introSlide_entry = introSlide_entries[0];

        if (introSlide_entry.isIntersecting) {
          introSlide_startUsageAnimation();
          return;
        }

        introSlide_resetUsageAnimation();
      },
      {
        threshold: 0.35,
      }
    );

    introSlide_observer.observe(introSlide_usageGrid);

    return () => {
      introSlide_observer.disconnect();
      introSlide_cancelAnimationFrame(introSlide_totalSubmitAnimationFrameRef);
      introSlide_cancelAnimationFrame(introSlide_weeklySubmitAnimationFrameRef);
    };
  }, [
    introSlide_animateNumber,
    introSlide_cancelAnimationFrame,
    introSlide_totalSubmitCount,
    introSlide_weeklySubmitCount,
  ]);

  const introSlide_animatedTotalHookCount =
    introSlide_animatedTotalSubmitCount * introSlide_hooksPerSubmit;

  const introSlide_usageStats = [
    {
      label: "누적 사용량",
      value: introSlide_formatCount(introSlide_animatedTotalSubmitCount),
    },
    {
      label: "생성된 hook 문장",
      value: introSlide_formatCount(introSlide_animatedTotalHookCount),
    },
    {
      label: "이번 주 사용량",
      value: introSlide_formatCount(introSlide_animatedWeeklySubmitCount),
    },
  ];

  return (
    <section className="introSlide_section">
      <div className="introSlide_content">
        <div className="introSlide_titleArea">
          <h2 className="introSlide_title">
            콘텐츠의 첫 문장,
            <br />
            왜 중요할까요?
          </h2>
        </div>

        <div className="introSlide_mainGrid">
          <div className="introSlide_benefitList">
            {introSlide_benefitItems.map((introSlide_item, introSlide_index) => (
              <div className="introSlide_benefitItem" key={introSlide_index}>
                <span className="introSlide_benefitIndex"></span>

                <div className="introSlide_benefitTextBox">
                  <h3 className="introSlide_benefitTitle">
                    {introSlide_item.title}
                  </h3>

                  <p className="introSlide_benefitDescription">
                    {introSlide_item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="introSlide_demoArea">
            <div className="introSlide_gifPlaceholder">
              <span className="introSlide_gifPlaceholderText">
                Demo GIF Area
              </span>
            </div>
          </div>
        </div>

        <div className="introSlide_usageSection">
          <div className="introSlide_usageGrid" ref={introSlide_usageGridRef}>
            {introSlide_usageStats.map((introSlide_stat, introSlide_index) => (
              <div className="introSlide_usageCard" key={introSlide_index}>
                <p className="introSlide_usageCardLabel">
                  {introSlide_stat.label}
                </p>

                <strong className="introSlide_usageCardValue">
                  {introSlide_stat.value}
                </strong>
              </div>
            ))}
          </div>

          <div className="introSlide_usageMessageBox">
            <p className="introSlide_usageMessage">
              “이미 많은 크리에이터가 사용하고 있습니다.”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default IntroSlide_render;
