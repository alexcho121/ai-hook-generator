package com.samcho.hookgenerator.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// ai 1단계 결과를 담는 내부 DTO입니당. (즉 AI 1, AI 2 사이의 중간데이터)

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StructuredHookInput {

    private String topic;
    private String targetAudience;
    private String tone;
    private String category;
    private List<String> platforms;
    private String hookGoal;
    private String language;
    private double confidence;
}