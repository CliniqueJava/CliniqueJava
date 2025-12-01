package com.clinique.controller;

import com.clinique.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/ai")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/diagnose")
    public ResponseEntity<?> diagnose(@RequestBody Map<String, String> request) {

        String message = request.get("message");
        String userId = request.getOrDefault("user_id", "anonymous");

        return ResponseEntity.ok(aiService.analyzeSymptoms(message, userId));
    }
}