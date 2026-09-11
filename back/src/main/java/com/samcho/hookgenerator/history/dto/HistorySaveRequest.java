package com.samcho.hookgenerator.history.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class HistorySaveRequest {

    @NotBlank
    private String topic;

    @NotBlank
    private String platform;

    @NotBlank
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
}