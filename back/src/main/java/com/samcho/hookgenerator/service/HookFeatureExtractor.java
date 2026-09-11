package com.samcho.hookgenerator.service;

import com.samcho.hookgenerator.dto.AlgorithmHookFeatures;
import com.samcho.hookgenerator.dto.StructuredHookInput;
import java.util.List;
import org.springframework.stereotype.Service;

// feature extractor algorithm

@Service
public class HookFeatureExtractor {

    public AlgorithmHookFeatures extract(String hookText, StructuredHookInput input) {
        int length = hookText.length();

        return new AlgorithmHookFeatures(
                length,
                getLengthRange(length),
                hasQuestion(hookText),
                hasNumber(hookText),
                hasNegativeWord(hookText),
                hasUrgencyWord(hookText),
                countKeywordOverlap(hookText, input)
        );
    }

    private String getLengthRange(int length) {
        if (length <= 15) {
            return "short";
        }

        if (length <= 30) {
            return "medium";
        }

        return "long";
    }

    private boolean hasQuestion(String text) {
        return text.contains("?")
                || text.contains("왜")
                || text.contains("어떻게")
                || text.contains("무엇")
                || text.contains("뭘");
    }

    private boolean hasNumber(String text) {
        return text.matches(".*\\d+.*");
    }

    private boolean hasNegativeWord(String text) {
        List<String> negativeWords = List.of(
                "실수", "손해", "후회", "놓치는", "망하는", "모르는", "위험"
        );

        return negativeWords.stream().anyMatch(text::contains);
    }

    private boolean hasUrgencyWord(String text) {
        List<String> urgencyWords = List.of(
                "지금", "당장", "오늘", "바로", "놓치면", "반드시", "꼭"
        );

        return urgencyWords.stream().anyMatch(text::contains);
    }

    private int countKeywordOverlap(String hookText, StructuredHookInput input) {
        int count = 0;

        if (input.getTopic() != null) {
            String[] topicWords = input.getTopic().split("\\s+");

            for (String word : topicWords) {
                if (!word.isBlank() && hookText.contains(word)) {
                    count++;
                }
            }
        }

        if (input.getTargetAudience() != null
                && hookText.contains(input.getTargetAudience())) {
            count++;
        }

        if (input.getCategory() != null
                && hookText.contains(input.getCategory())) {
            count++;
        }

        return count;
    }
}