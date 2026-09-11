import { useEffect, useRef, useState } from "react";

function scrollLogoMotion_clamp(scrollLogoMotion_value) {
  return Math.min(Math.max(scrollLogoMotion_value, 0), 1);
}

function scrollLogoMotion_lerp(
  scrollLogoMotion_start,
  scrollLogoMotion_end,
  scrollLogoMotion_progress
) {
  return (
    scrollLogoMotion_start +
    (scrollLogoMotion_end - scrollLogoMotion_start) * scrollLogoMotion_progress
  );
}

function scrollLogoMotion_getStageProgress(
  scrollLogoMotion_progress,
  scrollLogoMotion_start,
  scrollLogoMotion_end
) {
  return scrollLogoMotion_clamp(
    (scrollLogoMotion_progress - scrollLogoMotion_start) /
      (scrollLogoMotion_end - scrollLogoMotion_start)
  );
}

function useScrollLogoMotion_getMotion() {
  const scrollLogoMotion_frameRef = useRef(null);

  const [scrollLogoMotion_motion, scrollLogoMotion_setMotion] = useState({
    scrollLogoMotion_cubeX: 0,
    scrollLogoMotion_cubeRotation: 0,
    scrollLogoMotion_wordLogoOpacity: 0,
    scrollLogoMotion_wordLogoTranslateX: -8,
  });

  useEffect(() => {
    function scrollLogoMotion_calculateMotion() {
      const scrollLogoMotion_windowWidth = window.innerWidth;
      const scrollLogoMotion_slideHeight = window.innerHeight;
      const scrollLogoMotion_scrollY = window.scrollY;

      const scrollLogoMotion_cubeWidth = 36;
      const scrollLogoMotion_desktopLeftTarget = 70;
      const scrollLogoMotion_mobileLeftTarget = 24;
      const scrollLogoMotion_mobileBreakpoint = 760;
      const scrollLogoMotion_totalRotation = -360;

      const scrollLogoMotion_isMobile =
        scrollLogoMotion_windowWidth <= scrollLogoMotion_mobileBreakpoint;

      const scrollLogoMotion_leftTarget = scrollLogoMotion_isMobile
        ? scrollLogoMotion_mobileLeftTarget
        : scrollLogoMotion_desktopLeftTarget;

      if (scrollLogoMotion_isMobile) {
        scrollLogoMotion_setMotion({
          scrollLogoMotion_cubeX: scrollLogoMotion_leftTarget,
          scrollLogoMotion_cubeRotation: 0,
          scrollLogoMotion_wordLogoOpacity: 1,
          scrollLogoMotion_wordLogoTranslateX: 0,
        });

        return;
      }

      const scrollLogoMotion_centerX =
        scrollLogoMotion_windowWidth / 2 - scrollLogoMotion_cubeWidth / 2;

      const scrollLogoMotion_totalProgress = scrollLogoMotion_clamp(
        scrollLogoMotion_scrollY / scrollLogoMotion_slideHeight
      );

      /*
        0 ~ 0.72:
        cube 로고만 중앙에서 왼쪽으로 이동.
      */
      const scrollLogoMotion_cubeMoveProgress =
        scrollLogoMotion_getStageProgress(
          scrollLogoMotion_totalProgress,
          0,
          0.72
        );

      /*
        0.72 ~ 1:
        cube가 왼쪽에 도착한 뒤 samcho-logo.svg가 천천히 나타남.
      */
      const scrollLogoMotion_wordLogoShowProgress =
        scrollLogoMotion_getStageProgress(
          scrollLogoMotion_totalProgress,
          0.72,
          1
        );

      const scrollLogoMotion_cubeX = scrollLogoMotion_lerp(
        scrollLogoMotion_centerX,
        scrollLogoMotion_leftTarget,
        scrollLogoMotion_cubeMoveProgress
      );

      const scrollLogoMotion_cubeRotation = scrollLogoMotion_lerp(
        0,
        scrollLogoMotion_totalRotation,
        scrollLogoMotion_cubeMoveProgress
      );

      const scrollLogoMotion_wordLogoOpacity = scrollLogoMotion_lerp(
        0,
        1,
        scrollLogoMotion_wordLogoShowProgress
      );

      const scrollLogoMotion_wordLogoTranslateX = scrollLogoMotion_lerp(
        -8,
        0,
        scrollLogoMotion_wordLogoShowProgress
      );

      scrollLogoMotion_setMotion({
        scrollLogoMotion_cubeX,
        scrollLogoMotion_cubeRotation,
        scrollLogoMotion_wordLogoOpacity,
        scrollLogoMotion_wordLogoTranslateX,
      });
    }

    function scrollLogoMotion_requestUpdate() {
      if (scrollLogoMotion_frameRef.current) {
        return;
      }

      scrollLogoMotion_frameRef.current = requestAnimationFrame(() => {
        scrollLogoMotion_calculateMotion();
        scrollLogoMotion_frameRef.current = null;
      });
    }

    scrollLogoMotion_calculateMotion();

    window.addEventListener("scroll", scrollLogoMotion_requestUpdate, {
      passive: true,
    });

    window.addEventListener("resize", scrollLogoMotion_requestUpdate);

    return () => {
      window.removeEventListener("scroll", scrollLogoMotion_requestUpdate);
      window.removeEventListener("resize", scrollLogoMotion_requestUpdate);

      if (scrollLogoMotion_frameRef.current) {
        cancelAnimationFrame(scrollLogoMotion_frameRef.current);
      }
    };
  }, []);

  return scrollLogoMotion_motion;
}

export default useScrollLogoMotion_getMotion;