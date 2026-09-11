package com.samcho.hookgenerator.service;

import com.samcho.hookgenerator.dto.AlgorithmHookFeatures;
import com.samcho.hookgenerator.dto.GeneratedHook;
import org.springframework.stereotype.Service;

//점수 계산 알고리즘

@Service
public class HookScoringService {

    public int calculateQualityScore(
            GeneratedHook hook,
            AlgorithmHookFeatures features
    ) {
        int relevanceScore = calculateRelevanceScore(features);
        int hookStrengthScore = calculateHookStrengthScore(hook, features);
        int platformFitScore = normalizeAiScore(hook.getPlatformFit(), 20);
        int clarityScore = calculateClarityScore(features);
        int naturalnessScore = normalizeAiScore(hook.getNaturalness(), 10);
        int uniquenessScore = calculateUniquenessScore(hook);

        int total = relevanceScore
                + hookStrengthScore
                + platformFitScore
                + clarityScore
                + naturalnessScore
                + uniquenessScore;

        return clamp(total, 0, 100);
    }

    public int calculateEngagementScore(
            int impressionCount,
            int copyCount,
            int regenerateCount
    ) {
        if (impressionCount <= 0) {
            return 0;
        }

        double copyRate = (double) copyCount / impressionCount;
        double regenerateRate = (double) regenerateCount / impressionCount;

        double rawScore = 50
                + (copyRate * 40)
                - (regenerateRate * 20);

        return clamp((int) Math.round(rawScore), 0, 100);
    }

    public int calculateFinalScore(
            int qualityScore,
            int engagementScore,
            int copyCount,
            int regenerateCount
    ) {
        if (copyCount == 0 && regenerateCount == 0) {
            return qualityScore;
        }

        double finalScore = (qualityScore * 0.8) + (engagementScore * 0.2);

        return clamp((int) Math.round(finalScore), 0, 100);
    }

    private int calculateRelevanceScore(AlgorithmHookFeatures features) {
        int score = 15 + (features.getKeywordOverlapCount() * 4);
        return clamp(score, 0, 25);
    }

    private int calculateHookStrengthScore(
            GeneratedHook hook,
            AlgorithmHookFeatures features
    ) {
        int score = normalizeAiScore(hook.getCuriosityLevel(), 15);

        if (features.isHasQuestion()) {
            score += 3;
        }

        if (features.isHasNegativeWord()) {
            score += 4;
        }

        if (features.isHasUrgencyWord()) {
            score += 3;
        }

        return clamp(score, 0, 25);
    }

    private int calculateClarityScore(AlgorithmHookFeatures features) {
        if ("short".equals(features.getLengthRange())) {
            return 13;
        }

        if ("medium".equals(features.getLengthRange())) {
            return 15;
        }

        return 9;
    }

    private int calculateUniquenessScore(GeneratedHook hook) {
        if (hook.getHookType() == null || hook.getHookType().isBlank()) {
            return 3;
        }

        return 5;
    }

    private int normalizeAiScore(int aiScore, int maxScore) {
        int safeScore = clamp(aiScore, 0, 10);
        return (int) Math.round((safeScore / 10.0) * maxScore);
    }

    private int clamp(int value, int min, int max) {
        return Math.max(min, Math.min(max, value));
    }
}