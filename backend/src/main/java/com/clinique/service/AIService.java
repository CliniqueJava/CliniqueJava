package com.clinique.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class AIService {

    private final RestTemplate restTemplate = new RestTemplate();

    private final String PYTHON_API = "http://localhost:5000/medical-agent";

    public Map analyzeSymptoms(String message, String userId) {

        Map<String, Object> request = new HashMap<>();
        request.put("message", message);
        request.put("user_id", userId);

        Map response = restTemplate.postForObject(
                PYTHON_API,
                request,
                Map.class
        );

        return response;
    }
}
// iyadh: RestTemplate proxy
