import { useRef, useState } from "react";

function ResultRecommendationBlock_render({
  results = [],
  sentences = [],
  onCopy,
}) {
  const resultRecommendationBlock_copyStatusTimerRef = useRef(null);

  const [
    resultRecommendationBlock_copiedIndex,
    resultRecommendationBlock_setCopiedIndex,
  ] = useState(null);

  function resultRecommendationBlock_copyWithFallback(
    resultRecommendationBlock_sentence
  ) {
    const resultRecommendationBlock_temporaryTextarea =
      document.createElement("textarea");

    resultRecommendationBlock_temporaryTextarea.value =
      resultRecommendationBlock_sentence;

    resultRecommendationBlock_temporaryTextarea.setAttribute("readonly", "");
    resultRecommendationBlock_temporaryTextarea.style.position = "fixed";
    resultRecommendationBlock_temporaryTextarea.style.top = "-9999px";
    resultRecommendationBlock_temporaryTextarea.style.left = "-9999px";

    document.body.appendChild(resultRecommendationBlock_temporaryTextarea);

    resultRecommendationBlock_temporaryTextarea.select();
    resultRecommendationBlock_temporaryTextarea.setSelectionRange(
      0,
      resultRecommendationBlock_temporaryTextarea.value.length
    );

    document.execCommand("copy");

    document.body.removeChild(resultRecommendationBlock_temporaryTextarea);
  }

  async function resultRecommendationBlock_handleCopy(
    resultRecommendationBlock_result,
    resultRecommendationBlock_index
  ) {
    try {
      const resultRecommendationBlock_sentence =
        resultRecommendationBlock_result.text;

      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(resultRecommendationBlock_sentence);
      } else {
        resultRecommendationBlock_copyWithFallback(
          resultRecommendationBlock_sentence
        );
      }

      resultRecommendationBlock_setCopiedIndex(resultRecommendationBlock_index);

      if (resultRecommendationBlock_copyStatusTimerRef.current) {
        clearTimeout(resultRecommendationBlock_copyStatusTimerRef.current);
      }

      resultRecommendationBlock_copyStatusTimerRef.current = setTimeout(() => {
        resultRecommendationBlock_setCopiedIndex(null);
      }, 1100);

      if (resultRecommendationBlock_result.id && onCopy) {
        try {
          await onCopy(resultRecommendationBlock_result.id);
        } catch (resultRecommendationBlock_error) {
          console.error("Copy tracking failed:", resultRecommendationBlock_error);
        }
      }
    } catch (resultRecommendationBlock_error) {
      console.error("Copy failed:", resultRecommendationBlock_error);
    }
  }

  const resultRecommendationBlock_visibleSentences =
    results.length > 0
      ? results
      : sentences.map((resultRecommendationBlock_sentence) => ({
          id: null,
          text: resultRecommendationBlock_sentence,
        }));

  return (
    <div className="resultRecommendationBlock_container">
      <div className="resultRecommendationBlock_header">
        <h2 className="resultRecommendationBlock_title">
          이런 문장을 추천드려요!
        </h2>

        <p className="resultRecommendationBlock_description">
          마음에 드는 문장을 누르면 바로 복사돼요.
        </p>
      </div>

      <div className="resultRecommendationBlock_list">
        {resultRecommendationBlock_visibleSentences.map(
          (
            resultRecommendationBlock_sentence,
            resultRecommendationBlock_index
          ) => (
            <div
              className="resultRecommendationBlock_textItem"
              key={`${
                resultRecommendationBlock_sentence.id ??
                resultRecommendationBlock_sentence.text
              }-${resultRecommendationBlock_index}`}
            >
              <button
                className={
                  resultRecommendationBlock_copiedIndex ===
                  resultRecommendationBlock_index
                    ? "resultRecommendationBlock_sentenceText resultRecommendationBlock_sentenceTextCopied"
                    : "resultRecommendationBlock_sentenceText"
                }
                type="button"
                onClick={() =>
                  resultRecommendationBlock_handleCopy(
                    resultRecommendationBlock_sentence,
                    resultRecommendationBlock_index
                  )
                }
              >
                {resultRecommendationBlock_sentence.text}
              </button>

              {resultRecommendationBlock_copiedIndex ===
                resultRecommendationBlock_index && (
                <span className="resultRecommendationBlock_copyStatus">
                  복사됨
                </span>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default ResultRecommendationBlock_render;
