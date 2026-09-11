package com.samcho.hookgenerator.dto;

import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

//AI 2단계 결과를 백엔드 내부에서 받기 위한 DTO.

@Getter
@Setter
@NoArgsConstructor
public class GeneratedHookResponse {

    private List<GeneratedHook> hooks;
}