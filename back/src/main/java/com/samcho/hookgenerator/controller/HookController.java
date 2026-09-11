package com.samcho.hookgenerator.controller;

import com.samcho.hookgenerator.dto.HookGenerateRequest;
import com.samcho.hookgenerator.dto.HookGenerateResponse;
import com.samcho.hookgenerator.service.HookService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/hooks")
@CrossOrigin(origins = {"http://localhost:3456"})
public class HookController {

    private final HookService hookService;

    public HookController(HookService hookService) {
        this.hookService = hookService;
    }

    @PostMapping("/generate")
    public HookGenerateResponse generateHooks(@Valid @RequestBody HookGenerateRequest request) {
        return hookService.generateHooks(request);
    }
}