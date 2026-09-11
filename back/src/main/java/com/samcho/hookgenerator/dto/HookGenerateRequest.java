package com.samcho.hookgenerator.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter

// 사용자가 프론트에서 입력한 자연어
public class HookGenerateRequest {

    @NotBlank
    @Size(max = 1000)
    private String input;

    @Size(max = 4)
    private List<String> platforms;

    private List<Long> previousHistoryIds;
}