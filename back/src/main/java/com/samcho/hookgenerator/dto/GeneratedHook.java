package com.samcho.hookgenerator.dto;

import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class GeneratedHook {

    private String text;

    // AI가 판단하는 feature
    private String hookType;
    private String emotionTrigger;
    private String tone;
    private List<String> keywords;

    private int curiosityLevel;
    private int naturalness;
    private int platformFit;
}