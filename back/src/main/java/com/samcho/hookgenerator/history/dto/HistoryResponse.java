package com.samcho.hookgenerator.history.dto;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class HistoryResponse {

    private Long id;
    private String topic;
    private String platform;
    private String hookText;

    private Integer score;
    private Integer qualityScore;
    private Integer engagementScore;

    private String hookType;
    private String emotionTrigger;
    private String lengthRange;

    private Integer impressionCount;
    private Integer copyCount;
    private Integer regenerateCount;

    private Integer likeCount;
    private Integer dislikeCount;

    private LocalDateTime createdAt;
}
