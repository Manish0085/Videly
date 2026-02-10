package com.manish.videostreaming.controller;

import com.manish.videostreaming.service.LikeService;
import com.manish.videostreaming.utils.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({ "/api/v1/likes", "/api/v1/like" })
@RequiredArgsConstructor
public class LikeController {

    private final LikeService likeService;

    @PostMapping("/toggle/v/{videoId}")
    public ResponseEntity<ApiResponse<Void>> toggleVideoLike(@PathVariable String videoId) {
        likeService.toggleVideoLike(videoId);
        return ResponseEntity.ok(
                new ApiResponse<>(HttpStatus.OK.value(), null, "Like toggled successfully"));
    }

    @PostMapping("/toggle/c/{commentId}")
    public ResponseEntity<ApiResponse<Void>> toggleCommentLike(@PathVariable String commentId) {
        likeService.toggleCommentLike(commentId);
        return ResponseEntity.ok(
                new ApiResponse<>(HttpStatus.OK.value(), null, "Like toggled successfully"));
    }

    @PostMapping("/toggle/t/{tweetId}")
    public ResponseEntity<ApiResponse<Void>> toggleTweetLike(@PathVariable String tweetId) {
        likeService.toggleTweetLike(tweetId);
        return ResponseEntity.ok(
                new ApiResponse<>(HttpStatus.OK.value(), null, "Like toggled successfully"));
    }

    @GetMapping("/videos")
    public ResponseEntity<ApiResponse<java.util.List<com.manish.videostreaming.dto.VideoDto>>> getLikedVideos() {
        return ResponseEntity.ok(
                new ApiResponse<>(HttpStatus.OK.value(), likeService.getLikedVideos(),
                        "Liked videos fetched successfully"));
    }
}
