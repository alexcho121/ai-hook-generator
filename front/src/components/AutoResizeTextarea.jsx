import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import samchoArrowButton from "../assets/samcho-arrow-button.svg";

const autoResizeTextarea_loadingMessages = [
  "문장을 만들고 있어요.",
  "문장을 만들고 있어요..",
  "문장을 만들고 있어요...",
  "잠시만 기다려 주세요.",
  "잠시만 기다려 주세요..",
  "잠시만 기다려 주세요...",
  "열심히 일하고 있어요.",
  "열심히 일하고 있어요..",
  "열심히 일하고 있어요...",
];

function AutoResizeTextareaLoadingOverlay_render() {
  const [
    autoResizeTextarea_loadingMessageIndex,
    autoResizeTextarea_setLoadingMessageIndex,
  ] = useState(0);

  useEffect(() => {
    const autoResizeTextarea_loadingMessageTimer = setInterval(() => {
      autoResizeTextarea_setLoadingMessageIndex(
        (autoResizeTextarea_previousIndex) =>
          (autoResizeTextarea_previousIndex + 1) %
          autoResizeTextarea_loadingMessages.length
      );
    }, 1200);

    return () => {
      clearInterval(autoResizeTextarea_loadingMessageTimer);
    };
  }, []);

  return (
    <div className="autoResizeTextarea_loadingOverlay">
      <p className="autoResizeTextarea_loadingText">
        {
          autoResizeTextarea_loadingMessages[
            autoResizeTextarea_loadingMessageIndex
          ]
        }
      </p>
    </div>
  );
}

function AutoResizeTextarea_render({
  value,
  onChange,
  onSubmit,
  placeholder,
  platformOptions,
  selectedPlatforms,
  onPlatformToggle,
  resultMode = false,
  isLoading = false,
}) {
  const autoResizeTextarea_textareaRef = useRef(null);
  const autoResizeTextarea_resizeFrameRef = useRef(null);
  const autoResizeTextarea_mobileModeRef = useRef(false);
  const autoResizeTextarea_lastHeightRef = useRef(null);

  const [autoResizeTextarea_isFocused, autoResizeTextarea_setIsFocused] =
    useState(false);

  const [autoResizeTextarea_isScrollable, autoResizeTextarea_setIsScrollable] =
    useState(false);

  const [
    autoResizeTextarea_isMobileScreen,
    autoResizeTextarea_setIsMobileScreen,
  ] = useState(false);

  const autoResizeTextarea_collapsedHeight = autoResizeTextarea_isMobileScreen
    ? 26
    : 28;

  const autoResizeTextarea_mobileFixedTextareaHeight = resultMode ? 82 : 68;

  const autoResizeTextarea_expandedMinHeight = resultMode
    ? autoResizeTextarea_isMobileScreen
      ? 82
      : 118
    : autoResizeTextarea_isMobileScreen
      ? 68
      : 78;

  const autoResizeTextarea_maxHeight = resultMode
    ? autoResizeTextarea_isMobileScreen
      ? 210
      : 260
    : autoResizeTextarea_isMobileScreen
      ? 210
      : 220;

  const autoResizeTextarea_hasAnyValue = value.length > 0;
  const autoResizeTextarea_hasSubmittableValue = value.trim().length > 0;

  const autoResizeTextarea_isExpanded =
    autoResizeTextarea_isFocused || autoResizeTextarea_hasAnyValue || resultMode;

  const autoResizeTextarea_isSubmitDisabled =
    isLoading || !autoResizeTextarea_hasSubmittableValue;

  const autoResizeTextarea_shouldUseShortPlatformLabel =
    resultMode || autoResizeTextarea_isMobileScreen;

  const autoResizeTextarea_shouldUseMobileFastTypingMode =
    autoResizeTextarea_isMobileScreen && autoResizeTextarea_isExpanded;

  const autoResizeTextarea_getMinimumHeight = useCallback(() => {
    if (autoResizeTextarea_isExpanded) {
      return autoResizeTextarea_expandedMinHeight;
    }

    return autoResizeTextarea_collapsedHeight;
  }, [
    autoResizeTextarea_collapsedHeight,
    autoResizeTextarea_expandedMinHeight,
    autoResizeTextarea_isExpanded,
  ]);

  const autoResizeTextarea_updateScrollableState = useCallback((
    autoResizeTextarea_shouldScroll
  ) => {
    autoResizeTextarea_setIsScrollable((autoResizeTextarea_previousValue) => {
      if (autoResizeTextarea_previousValue === autoResizeTextarea_shouldScroll) {
        return autoResizeTextarea_previousValue;
      }

      return autoResizeTextarea_shouldScroll;
    });
  }, []);

  const autoResizeTextarea_applyHeight = useCallback((autoResizeTextarea_nextHeight) => {
    const autoResizeTextarea_textarea = autoResizeTextarea_textareaRef.current;

    if (!autoResizeTextarea_textarea) {
      return;
    }

    if (autoResizeTextarea_lastHeightRef.current === autoResizeTextarea_nextHeight) {
      return;
    }

    autoResizeTextarea_textarea.style.height = `${autoResizeTextarea_nextHeight}px`;
    autoResizeTextarea_lastHeightRef.current = autoResizeTextarea_nextHeight;
  }, []);

  const autoResizeTextarea_resizeTextarea = useCallback(() => {
    const autoResizeTextarea_textarea = autoResizeTextarea_textareaRef.current;

    if (!autoResizeTextarea_textarea) {
      return;
    }

    const autoResizeTextarea_minimumHeight =
      autoResizeTextarea_getMinimumHeight();

    if (autoResizeTextarea_shouldUseMobileFastTypingMode) {
      autoResizeTextarea_applyHeight(
        Math.max(
          autoResizeTextarea_minimumHeight,
          autoResizeTextarea_mobileFixedTextareaHeight
        )
      );

      autoResizeTextarea_updateScrollableState(true);

      return;
    }

    autoResizeTextarea_textarea.style.height = "auto";
    autoResizeTextarea_lastHeightRef.current = null;

    const autoResizeTextarea_contentHeight =
      autoResizeTextarea_textarea.scrollHeight;

    const autoResizeTextarea_nextHeight = Math.min(
      Math.max(
        autoResizeTextarea_contentHeight,
        autoResizeTextarea_minimumHeight
      ),
      autoResizeTextarea_maxHeight
    );

    autoResizeTextarea_applyHeight(autoResizeTextarea_nextHeight);

    const autoResizeTextarea_shouldScroll =
      autoResizeTextarea_contentHeight > autoResizeTextarea_maxHeight;

    autoResizeTextarea_updateScrollableState(autoResizeTextarea_shouldScroll);

    if (!autoResizeTextarea_shouldScroll) {
      autoResizeTextarea_textarea.scrollTop = 0;
    }
  }, [
    autoResizeTextarea_applyHeight,
    autoResizeTextarea_getMinimumHeight,
    autoResizeTextarea_maxHeight,
    autoResizeTextarea_mobileFixedTextareaHeight,
    autoResizeTextarea_shouldUseMobileFastTypingMode,
    autoResizeTextarea_updateScrollableState,
  ]);

  const autoResizeTextarea_requestResizeTextarea = useCallback(() => {
    if (autoResizeTextarea_resizeFrameRef.current) {
      return;
    }

    autoResizeTextarea_resizeFrameRef.current = requestAnimationFrame(() => {
      autoResizeTextarea_resizeTextarea();
      autoResizeTextarea_resizeFrameRef.current = null;
    });
  }, [autoResizeTextarea_resizeTextarea]);

  useEffect(() => {
    function autoResizeTextarea_checkMobileScreen() {
      const autoResizeTextarea_nextMobileMode = window.innerWidth <= 768;

      if (
        autoResizeTextarea_mobileModeRef.current ===
        autoResizeTextarea_nextMobileMode
      ) {
        return;
      }

      autoResizeTextarea_mobileModeRef.current =
        autoResizeTextarea_nextMobileMode;

      autoResizeTextarea_setIsMobileScreen(autoResizeTextarea_nextMobileMode);
    }

    autoResizeTextarea_mobileModeRef.current = window.innerWidth <= 768;
    autoResizeTextarea_setIsMobileScreen(autoResizeTextarea_mobileModeRef.current);

    window.addEventListener("resize", autoResizeTextarea_checkMobileScreen, {
      passive: true,
    });

    return () => {
      window.removeEventListener(
        "resize",
        autoResizeTextarea_checkMobileScreen
      );

      if (autoResizeTextarea_resizeFrameRef.current) {
        cancelAnimationFrame(autoResizeTextarea_resizeFrameRef.current);
      }
    };
  }, []);

  useLayoutEffect(() => {
    autoResizeTextarea_requestResizeTextarea();
  }, [
    value,
    autoResizeTextarea_isFocused,
    autoResizeTextarea_requestResizeTextarea,
    resultMode,
    autoResizeTextarea_isMobileScreen,
  ]);

  function autoResizeTextarea_handleChange(event) {
    onChange(event.target.value);
  }

  function autoResizeTextarea_handleFocus() {
    autoResizeTextarea_setIsFocused(true);
  }

  function autoResizeTextarea_handleBlur() {
    autoResizeTextarea_setIsFocused(false);
  }

  function autoResizeTextarea_handleSubmitClick() {
    if (autoResizeTextarea_isSubmitDisabled) {
      return;
    }

    const autoResizeTextarea_textarea = autoResizeTextarea_textareaRef.current;

    if (autoResizeTextarea_textarea) {
      autoResizeTextarea_textarea.blur();
    }

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    onSubmit();
  }

  function autoResizeTextarea_handlePlatformClick(autoResizeTextarea_platformId) {
    if (isLoading) {
      return;
    }

    onPlatformToggle(autoResizeTextarea_platformId);
  }

  const autoResizeTextarea_containerClassName = [
    "autoResizeTextarea_container",
    autoResizeTextarea_isExpanded
      ? "autoResizeTextarea_containerExpanded"
      : "",
    resultMode ? "autoResizeTextarea_containerResultMode" : "",
    autoResizeTextarea_isMobileScreen
      ? "autoResizeTextarea_containerMobileMode"
      : "",
    isLoading ? "autoResizeTextarea_containerLoading" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={autoResizeTextarea_containerClassName}>
      <div className="autoResizeTextarea_inputArea">
        <textarea
          ref={autoResizeTextarea_textareaRef}
          className="autoResizeTextarea_input"
          value={value}
          onChange={autoResizeTextarea_handleChange}
          onFocus={autoResizeTextarea_handleFocus}
          onBlur={autoResizeTextarea_handleBlur}
          placeholder={placeholder}
          rows={1}
          style={{
            overflowY: autoResizeTextarea_isScrollable ? "auto" : "hidden",
          }}
        />
      </div>

      <div
        className={
          autoResizeTextarea_isExpanded
            ? "autoResizeTextarea_platformRow autoResizeTextarea_platformRowVisible"
            : "autoResizeTextarea_platformRow"
        }
      >
        <div className="autoResizeTextarea_platformList">
          {platformOptions.map((autoResizeTextarea_platform) => {
            const autoResizeTextarea_isSelected = selectedPlatforms.includes(
              autoResizeTextarea_platform.id
            );

            return (
              <button
                key={autoResizeTextarea_platform.id}
                className={
                  autoResizeTextarea_isSelected
                    ? "autoResizeTextarea_platformButton autoResizeTextarea_platformButtonSelected"
                    : "autoResizeTextarea_platformButton"
                }
                type="button"
                disabled={isLoading}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  autoResizeTextarea_handlePlatformClick(
                    autoResizeTextarea_platform.id
                  )
                }
              >
                <span className="autoResizeTextarea_platformCircle"></span>

                <span className="autoResizeTextarea_platformLabel">
                  {autoResizeTextarea_shouldUseShortPlatformLabel
                    ? autoResizeTextarea_platform.shortLabel
                    : autoResizeTextarea_platform.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        className="autoResizeTextarea_submitButton"
        type="button"
        disabled={autoResizeTextarea_isSubmitDisabled}
        onMouseDown={(event) => event.preventDefault()}
        onClick={autoResizeTextarea_handleSubmitClick}
        aria-label="Submit prompt"
      >
        <img
          className="autoResizeTextarea_submitIcon"
          src={samchoArrowButton}
          alt=""
          draggable="false"
        />
      </button>

      {isLoading && <AutoResizeTextareaLoadingOverlay_render />}
    </div>
  );
}

export default AutoResizeTextarea_render;
