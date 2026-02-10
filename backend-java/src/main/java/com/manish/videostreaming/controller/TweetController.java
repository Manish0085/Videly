package com.manish.videostreaming.controller;

import com.manish.videostreaming.dto.TweetDto;
import com.manish.videostreaming.service.TweetService;
import com.manish.videostreaming.utils.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tweets")
@RequiredArgsConstructor
public class TweetController {

        private final TweetService tweetService;

        @PostMapping
        public ResponseEntity<ApiResponse<TweetDto>> createTweet(@RequestBody java.util.Map<String, String> body) {
                String content = body.get("content");
                return ResponseEntity.ok(
                                new ApiResponse<>(HttpStatus.CREATED.value(), tweetService.createTweet(content),
                                                "Tweet created successfully"));
        }

        @GetMapping
        public ResponseEntity<ApiResponse<List<TweetDto>>> getAllTweets() {
                return ResponseEntity.ok(
                                new ApiResponse<>(HttpStatus.OK.value(), tweetService.getAllTweets(),
                                                "Tweets fetched successfully"));
        }

        @GetMapping("/user/{userId}")
        public ResponseEntity<ApiResponse<List<TweetDto>>> getUserTweets(@PathVariable String userId) {
                return ResponseEntity.ok(
                                new ApiResponse<>(HttpStatus.OK.value(), tweetService.getUserTweets(userId),
                                                "Tweets fetched successfully"));
        }

        @PatchMapping("/{tweetId}")
        public ResponseEntity<ApiResponse<TweetDto>> updateTweet(@PathVariable String tweetId,
                        @RequestBody java.util.Map<String, String> body) {
                String content = body.get("content");
                return ResponseEntity.ok(
                                new ApiResponse<>(HttpStatus.OK.value(), tweetService.updateTweet(tweetId, content),
                                                "Tweet updated successfully"));
        }

        @DeleteMapping("/{tweetId}")
        public ResponseEntity<ApiResponse<Void>> deleteTweet(@PathVariable String tweetId) {
                tweetService.deleteTweet(tweetId);
                return ResponseEntity.ok(
                                new ApiResponse<>(HttpStatus.OK.value(), null, "Tweet deleted successfully"));
        }
}
