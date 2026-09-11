package com.samcho.hookgenerator.history;

import com.samcho.hookgenerator.history.dto.HistoryResponse;
import com.samcho.hookgenerator.history.dto.HistorySaveRequest;
import com.samcho.hookgenerator.service.HookScoringService;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class HistoryServiceTest {

    @Mock
    private HistoryRepository historyRepository;

    @Mock
    private HookScoringService hookScoringService;

    @InjectMocks
    private HistoryService historyService;

    @Test
    void saveHistory_returnsCorrectResponse() {
        HistorySaveRequest request = new HistorySaveRequest();
        request.setTopic("건강한 식단");
        request.setPlatform("youtube");
        request.setHookText("지금 이걸 모르면 손해입니다");

        request.setScore(88);
        request.setQualityScore(88);
        request.setEngagementScore(0);
        request.setHookType("problem");
        request.setEmotionTrigger("loss_aversion");
        request.setLengthRange("medium");
        request.setImpressionCount(1);
        request.setCopyCount(0);
        request.setRegenerateCount(0);

        History saved = new History();
        saved.setTopic("건강한 식단");
        saved.setPlatform("youtube");
        saved.setHookText("지금 이걸 모르면 손해입니다");

        saved.setScore(88);
        saved.setQualityScore(88);
        saved.setEngagementScore(0);
        saved.setHookType("problem");
        saved.setEmotionTrigger("loss_aversion");
        saved.setLengthRange("medium");
        saved.setImpressionCount(1);
        saved.setCopyCount(0);
        saved.setRegenerateCount(0);
        saved.prePersist();

        given(historyRepository.save(any(History.class))).willReturn(saved);

        HistoryResponse response = historyService.saveHistory(request);

        assertThat(response.getTopic()).isEqualTo("건강한 식단");
        assertThat(response.getPlatform()).isEqualTo("youtube");
        assertThat(response.getHookText()).isEqualTo("지금 이걸 모르면 손해입니다");

        assertThat(response.getScore()).isEqualTo(88);
        assertThat(response.getQualityScore()).isEqualTo(88);
        assertThat(response.getEngagementScore()).isEqualTo(0);
        assertThat(response.getHookType()).isEqualTo("problem");
        assertThat(response.getEmotionTrigger()).isEqualTo("loss_aversion");
        assertThat(response.getLengthRange()).isEqualTo("medium");
        assertThat(response.getImpressionCount()).isEqualTo(1);
        assertThat(response.getCopyCount()).isEqualTo(0);
        assertThat(response.getRegenerateCount()).isEqualTo(0);

        assertThat(response.getCreatedAt()).isNotNull();
    }

    @Test
    void getAllHistories_returnsList() {
        History h1 = new History();
        h1.setTopic("주제1");
        h1.setPlatform("tiktok");
        h1.setHookText("훅 문장 A");
        h1.setScore(85);
        h1.setQualityScore(85);
        h1.setEngagementScore(0);
        h1.setImpressionCount(1);
        h1.setCopyCount(0);
        h1.setRegenerateCount(0);
        h1.prePersist();

        History h2 = new History();
        h2.setTopic("주제1");
        h2.setPlatform("tiktok");
        h2.setHookText("훅 문장 B");
        h2.setScore(90);
        h2.setQualityScore(90);
        h2.setEngagementScore(0);
        h2.setImpressionCount(1);
        h2.setCopyCount(0);
        h2.setRegenerateCount(0);
        h2.prePersist();

        given(historyRepository.findAll()).willReturn(List.of(h1, h2));

        List<HistoryResponse> responses = historyService.getAllHistories();

        assertThat(responses).hasSize(2);
        assertThat(responses.get(0).getHookText()).isEqualTo("훅 문장 A");
        assertThat(responses.get(1).getHookText()).isEqualTo("훅 문장 B");
        assertThat(responses.get(0).getScore()).isEqualTo(85);
        assertThat(responses.get(1).getScore()).isEqualTo(90);
    }

    @Test
    void addCopy_increasesCopyCountAndRecalculatesScore() {
        History history = new History();
        history.setTopic("건강한 식단");
        history.setPlatform("youtube");
        history.setHookText("지금 이걸 모르면 손해입니다");

        history.setQualityScore(80);
        history.setEngagementScore(0);
        history.setScore(80);

        history.setImpressionCount(1);
        history.setCopyCount(0);
        history.setRegenerateCount(0);
        history.prePersist();

        given(historyRepository.findById(1L)).willReturn(Optional.of(history));
        given(hookScoringService.calculateEngagementScore(1, 1, 0)).willReturn(90);
        given(hookScoringService.calculateFinalScore(80, 90, 1, 0)).willReturn(82);
        given(historyRepository.save(any(History.class))).willReturn(history);

        HistoryResponse response = historyService.addCopy(1L);

        assertThat(response.getCopyCount()).isEqualTo(1);
        assertThat(response.getEngagementScore()).isEqualTo(90);
        assertThat(response.getScore()).isEqualTo(82);
    }

    @Test
    void addRegenerateToHistories_increasesRegenerateCountAndRecalculatesScore() {
        History history = new History();
        history.setTopic("건강한 식단");
        history.setPlatform("youtube");
        history.setHookText("지금 이걸 모르면 손해입니다");

        history.setQualityScore(80);
        history.setEngagementScore(0);
        history.setScore(80);

        history.setImpressionCount(1);
        history.setCopyCount(0);
        history.setRegenerateCount(0);
        history.prePersist();

        given(historyRepository.findAllById(List.of(1L))).willReturn(List.of(history));
        given(hookScoringService.calculateEngagementScore(1, 0, 1)).willReturn(30);
        given(hookScoringService.calculateFinalScore(80, 30, 0, 1)).willReturn(70);
        given(historyRepository.saveAll(any())).willReturn(List.of(history));

        historyService.addRegenerateToHistories(List.of(1L));

        assertThat(history.getRegenerateCount()).isEqualTo(1);
        assertThat(history.getEngagementScore()).isEqualTo(30);
        assertThat(history.getScore()).isEqualTo(70);
    }
}