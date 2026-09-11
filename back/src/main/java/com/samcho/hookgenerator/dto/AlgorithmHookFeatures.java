package com.samcho.hookgenerator.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AlgorithmHookFeatures {

    private int length;
    private String lengthRange;

    private boolean hasQuestion;
    private boolean hasNumber;
    private boolean hasNegativeWord;
    private boolean hasUrgencyWord;

    private int keywordOverlapCount;
}