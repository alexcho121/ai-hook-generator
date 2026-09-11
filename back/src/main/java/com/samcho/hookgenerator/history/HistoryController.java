package com.samcho.hookgenerator.history;

import com.samcho.hookgenerator.history.dto.HistoryResponse;
import com.samcho.hookgenerator.history.dto.HistorySaveRequest;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/history")
@CrossOrigin(origins = {"http://localhost:3456"})
public class HistoryController {

    private final HistoryService historyService;

    public HistoryController(HistoryService historyService) {
        this.historyService = historyService;
    }

    @PostMapping
    public HistoryResponse saveHistory(@Valid @RequestBody HistorySaveRequest request) {
        return historyService.saveHistory(request);
    }

    @GetMapping
    public List<HistoryResponse> getAllHistories() {
        return historyService.getAllHistories();
    }

    @PostMapping("/{id}/copy")
    public HistoryResponse addCopy(@PathVariable Long id) {
        return historyService.addCopy(id);
    }
}