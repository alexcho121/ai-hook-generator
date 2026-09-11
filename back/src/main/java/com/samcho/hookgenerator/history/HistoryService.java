package com.samcho.hookgenerator.history;

import com.samcho.hookgenerator.history.dto.HistoryResponse;
import com.samcho.hookgenerator.history.dto.HistorySaveRequest;
import com.samcho.hookgenerator.service.HookScoringService;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class HistoryService {

    private final HistoryRepository historyRepository;
    private final HookScoringService hookScoringService;

    public HistoryService(
            HistoryRepository historyRepository,
            HookScoringService hookScoringService
    ) {
        this.historyRepository = historyRepository;
        this.hookScoringService = hookScoringService;
    }

    public HistoryResponse saveHistory(HistorySaveRequest request) {
        History history = new History();

        history.setTopic(request.getTopic());
        history.setPlatform(request.getPlatform());
        history.setHookText(request.getHookText());

        history.setScore(defaultValue(request.getScore(), 0));
        history.setQualityScore(defaultValue(request.getQualityScore(), history.getScore()));
        history.setEngagementScore(defaultValue(request.getEngagementScore(), 0));

        history.setHookType(request.getHookType());
        history.setEmotionTrigger(request.getEmotionTrigger());
        history.setLengthRange(request.getLengthRange());

        history.setImpressionCount(defaultValue(request.getImpressionCount(), 1));
        history.setCopyCount(defaultValue(request.getCopyCount(), 0));
        history.setRegenerateCount(defaultValue(request.getRegenerateCount(), 0));

        History saved = historyRepository.save(history);

        return toResponse(saved);
    }

    public HistoryResponse addCopy(Long historyId) {
        History history = historyRepository.findById(historyId)
                .orElseThrow(() -> new IllegalArgumentException("History not found."));

        history.setCopyCount(safeCount(history.getCopyCount()) + 1);

        updateEngagementAndFinalScore(history);

        History saved = historyRepository.save(history);

        return toResponse(saved);
    }

    public void addRegenerateToHistories(List<Long> historyIds) {
        if (historyIds == null || historyIds.isEmpty()) {
            return;
        }

        List<History> histories = historyRepository.findAllById(historyIds);

        for (History history : histories) {
            history.setRegenerateCount(safeCount(history.getRegenerateCount()) + 1);

            updateEngagementAndFinalScore(history);
        }

        historyRepository.saveAll(histories);
    }

    public List<HistoryResponse> getAllHistories() {
        return historyRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    private void updateEngagementAndFinalScore(History history) {
        int impressionCount = safeCount(history.getImpressionCount());
        int copyCount = safeCount(history.getCopyCount());
        int regenerateCount = safeCount(history.getRegenerateCount());
        int qualityScore = safeCount(history.getQualityScore());

        int engagementScore = hookScoringService.calculateEngagementScore(
                impressionCount,
                copyCount,
                regenerateCount
        );

        int finalScore = hookScoringService.calculateFinalScore(
                qualityScore,
                engagementScore,
                copyCount,
                regenerateCount
        );

        history.setEngagementScore(engagementScore);
        history.setScore(finalScore);
    }

    private HistoryResponse toResponse(History history) {
        return new HistoryResponse(
                history.getId(),
                history.getTopic(),
                history.getPlatform(),
                history.getHookText(),

                history.getScore(),
                history.getQualityScore(),
                history.getEngagementScore(),

                history.getHookType(),
                history.getEmotionTrigger(),
                history.getLengthRange(),

                history.getImpressionCount(),
                history.getCopyCount(),
                history.getRegenerateCount(),

                history.getLikeCount(),
                history.getDislikeCount(),

                history.getCreatedAt()
        );
    }

    private int defaultValue(Integer value, int defaultValue) {
        return value == null ? defaultValue : value;
    }

    private int safeCount(Integer value) {
        return value == null ? 0 : value;
    }
}
