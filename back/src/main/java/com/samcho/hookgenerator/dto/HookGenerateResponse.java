package com.samcho.hookgenerator.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;

//HookResult랑 연결되는겁니다.

@Getter
@AllArgsConstructor
public class HookGenerateResponse {

    private List<HookResult> results;
}