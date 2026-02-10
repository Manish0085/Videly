package com.manish.videostreaming.controller;

import com.manish.videostreaming.dto.DashboardStats;
import com.manish.videostreaming.dto.VideoDto;
import com.manish.videostreaming.service.DashboardService;
import com.manish.videostreaming.utils.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStats>> getStats() {
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(),
                dashboardService.getStats(),
                "Dashboard stats fetched successfully"));
    }

    @GetMapping("/videos")
    public ResponseEntity<ApiResponse<List<VideoDto>>> getChannelVideos() {
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(),
                dashboardService.getChannelVideos(),
                "Channel videos fetched successfully"));
    }
}
