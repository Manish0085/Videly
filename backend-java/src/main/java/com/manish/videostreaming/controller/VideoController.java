package com.manish.videostreaming.controller;

import com.manish.videostreaming.model.Video;
import com.manish.videostreaming.service.VideoService;
import com.manish.videostreaming.utils.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/videos")
@RequiredArgsConstructor
public class VideoController {

    private final VideoService videoService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<com.manish.videostreaming.dto.VideoDto>>> getAllVideos() {
        return ResponseEntity.ok(
                new ApiResponse<>(HttpStatus.OK.value(), videoService.getAllVideos(), "Videos fetched successfully"));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Video>> publishAVideo(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("videoFile") MultipartFile videoFile,
            @RequestParam("thumbnail") MultipartFile thumbnail,
            @RequestParam(value = "isShort", defaultValue = "false") boolean isShort) {
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(),
                videoService.uploadVideo(title, description, videoFile, thumbnail, isShort),
                "Video published successfully"));
    }

    @GetMapping("/shorts")
    public ResponseEntity<ApiResponse<List<com.manish.videostreaming.dto.VideoDto>>> getAllShorts() {
        return ResponseEntity.ok(
                new ApiResponse<>(HttpStatus.OK.value(), videoService.getAllShorts(), "Shorts fetched successfully"));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<com.manish.videostreaming.dto.VideoDto>>> searchVideos(
            @RequestParam("query") String query) {
        return ResponseEntity.ok(
                new ApiResponse<>(HttpStatus.OK.value(), videoService.searchVideos(query),
                        "Search results fetched successfully"));
    }

    @GetMapping("/{videoId}")
    public ResponseEntity<ApiResponse<com.manish.videostreaming.dto.VideoDto>> getVideoById(
            @PathVariable String videoId) {
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), videoService.getVideoById(videoId),
                "Video fetched successfully"));
    }

    @PatchMapping("/toggle/publish/{videoId}")
    public ResponseEntity<ApiResponse<Video>> togglePublishStatus(@PathVariable String videoId) {
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), videoService.togglePublishStatus(videoId),
                "Video publish status toggled successfully"));
    }

    @PostMapping("/view/{videoId}")
    public ResponseEntity<ApiResponse<Void>> incrementViews(@PathVariable String videoId) {
        videoService.incrementViews(videoId);
        return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(), null, "View count incremented"));
    }
}
