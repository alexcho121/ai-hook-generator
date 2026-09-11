import { useEffect, useMemo, useRef, useState } from "react";
import AutoResizeTextarea from "../components/AutoResizeTextarea";
import ResultRecommendationBlock from "../components/ResultRecommendationBlock";
import { hookApi_generateHooks, hookApi_recordCopy } from "../api/hookApi";
import { mainSlideBackground_createRandomStyle } from "../utils/mainSlideBackground";
import {
  mainSlideTexts_subtitles,
  mainSlideTexts_titles,
} from "../constants/mainSlideTexts";
import { randomPicker_pickOne } from "../utils/randomPicker";
import samchoCubeLogo from "../assets/samcho-cube-logo.svg";

function mainSlide_createRandomLoadingLogo() {
  return {
    id: `${Date.now()}-${Math.random()}`,
    left: Math.random() * 82 + 6,
    top: Math.random() * 72 + 10,
    size: Math.random() * 20 + 26,
    rotate: Math.random() * 80 - 40,
  };
}

function mainSlide_createRandomLoadingStar(mainSlide_index) {
  return {
    id: `star-${mainSlide_index}-${Math.random()}`,
    left: Math.random() * 94 + 3,
    top: Math.random() * 86 + 7,
    size: Math.random() * 2.2 + 1.2,
    opacity: Math.random() * 0.42 + 0.34,
  };
}

function MainSlideResultLoadingOverlay_render() {
  const [mainSlide_loadingLogos, mainSlide_setLoadingLogos] = useState(() => [
    mainSlide_createRandomLoadingLogo(),
  ]);

  const mainSlide_loadingStars = useMemo(() => {
    return Array.from({ length: 28 }, (_, mainSlide_index) =>
      mainSlide_createRandomLoadingStar(mainSlide_index)
    );
  }, []);

  useEffect(() => {
    const mainSlide_logoTimer = setInterval(() => {
      mainSlide_setLoadingLogos((mainSlide_previousLogos) => {
        const mainSlide_nextLogos = [
          ...mainSlide_previousLogos,
          mainSlide_createRandomLoadingLogo(),
        ];

        return mainSlide_nextLogos.slice(-16);
      });
    }, 1800);

    return () => {
      clearInterval(mainSlide_logoTimer);
    };
  }, []);

  return (
    <div className="mainSlide_resultLoadingOverlay">
      <div className="mainSlide_resultLoadingSky">
        {mainSlide_loadingStars.map((mainSlide_star) => (
          <span
            key={mainSlide_star.id}
            className="mainSlide_resultLoadingStar"
            style={{
              left: `${mainSlide_star.left}%`,
              top: `${mainSlide_star.top}%`,
              width: `${mainSlide_star.size}px`,
              height: `${mainSlide_star.size}px`,
              opacity: mainSlide_star.opacity,
            }}
          />
        ))}
      </div>

      {mainSlide_loadingLogos.map((mainSlide_logo) => (
        <img
          key={mainSlide_logo.id}
          className="mainSlide_resultLoadingLogo"
          src={samchoCubeLogo}
          alt=""
          draggable="false"
          style={{
            left: `${mainSlide_logo.left}%`,
            top: `${mainSlide_logo.top}%`,
            width: `${mainSlide_logo.size}px`,
            height: `${mainSlide_logo.size}px`,
            "--mainSlide_logoRotation": `${mainSlide_logo.rotate}deg`,
          }}
        />
      ))}
    </div>
  );
}

function MainSlide_render() {
  const [mainSlide_input, mainSlide_setInput] = useState("");
  const [mainSlide_result, mainSlide_setResult] = useState(null);
  const [mainSlide_isLoading, mainSlide_setIsLoading] = useState(false);
  const [mainSlide_selectedPlatforms, mainSlide_setSelectedPlatforms] =
    useState([]);
  const [mainSlide_hasSubmittedOnce, mainSlide_setHasSubmittedOnce] =
    useState(false);
  const [mainSlide_isResultBlockVisible, mainSlide_setIsResultBlockVisible] =
    useState(false);
  const [mainSlide_isMobileScreen, mainSlide_setIsMobileScreen] =
    useState(false);

  const mainSlide_resultDelayTimerRef = useRef(null);

  const mainSlide_platformOptions = [
    { id: "tiktok", label: "TikTok", shortLabel: "Tik" },
    { id: "youtube", label: "YouTube", shortLabel: "YT" },
    { id: "instagram", label: "Instagram", shortLabel: "IG" },
    { id: "blog", label: "Blog", shortLabel: "Blog" },
  ];

  const mainSlide_backgroundStyle = useMemo(() => {
    return mainSlideBackground_createRandomStyle();
  }, []);

  const mainSlide_titleText = useMemo(() => {
    return randomPicker_pickOne(mainSlideTexts_titles);
  }, []);

  const mainSlide_subtitleText = useMemo(() => {
    return randomPicker_pickOne(mainSlideTexts_subtitles);
  }, []);

  useEffect(() => {
    function mainSlide_handleResize() {
      mainSlide_setIsMobileScreen(window.innerWidth <= 768);
    }

    mainSlide_handleResize();

    window.addEventListener("resize", mainSlide_handleResize);

    return () => {
      window.removeEventListener("resize", mainSlide_handleResize);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (mainSlide_resultDelayTimerRef.current) {
        clearTimeout(mainSlide_resultDelayTimerRef.current);
      }
    };
  }, []);

  const mainSlide_placeholderText = mainSlide_isMobileScreen
    ? "아이디어를 적어주세요..."
    : "어떤 느낌의 문장을 만들고 싶은지 알려주세요...";

  function mainSlide_handlePlatformToggle(mainSlide_platformId) {
    if (mainSlide_isLoading) {
      return;
    }

    mainSlide_setSelectedPlatforms((mainSlide_previousPlatforms) => {
      if (mainSlide_previousPlatforms.includes(mainSlide_platformId)) {
        return mainSlide_previousPlatforms.filter(
          (mainSlide_item) => mainSlide_item !== mainSlide_platformId
        );
      }

      return [...mainSlide_previousPlatforms, mainSlide_platformId];
    });
  }

  function mainSlide_extractResultItems(mainSlide_response) {
    if (!mainSlide_response) {
      return [];
    }

    if (Array.isArray(mainSlide_response.results)) {
      return mainSlide_response.results
        .map((mainSlide_item) => {
          if (typeof mainSlide_item === "string") {
            return {
              id: null,
              text: mainSlide_item,
            };
          }

          return {
            id: mainSlide_item.id ?? null,
            text: mainSlide_item.text,
          };
        })
        .filter((mainSlide_item) => mainSlide_item.text)
        .slice(0, 5);
    }

    if (Array.isArray(mainSlide_response.sentences)) {
      return mainSlide_response.sentences
        .filter(Boolean)
        .map((mainSlide_sentence) => ({
          id: null,
          text: mainSlide_sentence,
        }))
        .slice(0, 5);
    }

    return [];
  }

  async function mainSlide_handleSubmit() {
    if (mainSlide_isLoading) {
      return;
    }

    if (!mainSlide_input.trim()) {
      return;
    }

    try {
      mainSlide_setIsLoading(true);

      const mainSlide_previousHistoryIds = mainSlide_extractResultItems(
        mainSlide_result
      )
        .map((mainSlide_item) => mainSlide_item.id)
        .filter(Boolean);

      const mainSlide_response = await hookApi_generateHooks(
        mainSlide_input,
        mainSlide_selectedPlatforms,
        mainSlide_previousHistoryIds
      );

      mainSlide_setResult(mainSlide_response);

      if (!mainSlide_hasSubmittedOnce) {
        mainSlide_setHasSubmittedOnce(true);
        mainSlide_setIsResultBlockVisible(false);

        if (mainSlide_resultDelayTimerRef.current) {
          clearTimeout(mainSlide_resultDelayTimerRef.current);
        }

        mainSlide_resultDelayTimerRef.current = setTimeout(() => {
          mainSlide_setIsResultBlockVisible(true);
        }, 560);
      } else {
        mainSlide_setIsResultBlockVisible(true);
      }
    } catch (mainSlide_error) {
      console.error("Failed to generate hooks:", mainSlide_error);
    } finally {
      mainSlide_setIsLoading(false);
    }
  }

  const mainSlide_resultItems = mainSlide_extractResultItems(mainSlide_result);

  const mainSlide_resultPanelClassName = [
    "mainSlide_resultPanel",
    mainSlide_isResultBlockVisible ? "mainSlide_resultPanelVisible" : "",
    mainSlide_isLoading ? "mainSlide_resultPanelLoading" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section
      id="mainSlide"
      className="mainSlide_section"
      style={mainSlide_backgroundStyle}
    >
      <div className="mainSlide_backgroundOverlay"></div>

      <div
        className={
          mainSlide_hasSubmittedOnce
            ? "mainSlide_content mainSlide_contentResultMode"
            : "mainSlide_content"
        }
      >
        {!mainSlide_hasSubmittedOnce && (
          <div className="mainSlide_introTextBox">
            <h1 className="mainSlide_title">{mainSlide_titleText}</h1>

            <p className="mainSlide_subtitle">{mainSlide_subtitleText}</p>
          </div>
        )}

        <div
          className={
            mainSlide_hasSubmittedOnce
              ? "mainSlide_inputPanel mainSlide_inputPanelResultMode"
              : "mainSlide_inputPanel"
          }
        >
          <AutoResizeTextarea
            value={mainSlide_input}
            onChange={mainSlide_setInput}
            onSubmit={mainSlide_handleSubmit}
            placeholder={mainSlide_placeholderText}
            platformOptions={mainSlide_platformOptions}
            selectedPlatforms={mainSlide_selectedPlatforms}
            onPlatformToggle={mainSlide_handlePlatformToggle}
            resultMode={mainSlide_hasSubmittedOnce}
            isLoading={mainSlide_isLoading}
          />
        </div>

        {mainSlide_hasSubmittedOnce && (
          <div className={mainSlide_resultPanelClassName}>
            <ResultRecommendationBlock
              results={mainSlide_resultItems}
              onCopy={hookApi_recordCopy}
            />

            {mainSlide_isLoading && <MainSlideResultLoadingOverlay_render />}
          </div>
        )}
      </div>
    </section>
  );
}

export default MainSlide_render;
