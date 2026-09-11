package com.samcho.hookgenerator.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

//front와 json 구조 통일

@Getter
@AllArgsConstructor
public class HookResult {

    private Long id;
    private String text;
    private String provider;
    private int score;
}