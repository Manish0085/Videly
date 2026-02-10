package com.manish.videostreaming.controller;

import com.manish.videostreaming.dto.CommentDto;
import com.manish.videostreaming.service.CommentService;
import com.manish.videostreaming.utils.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({ "/api/v1/comments", "/api/v1/comment" })
@RequiredArgsConstructor
public class CommentController {

        private final CommentService commentService;

        @GetMapping("/{videoId}")
        public ResponseEntity<ApiResponse<List<CommentDto>>> getVideoComments(
                        @PathVariable String videoId,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size) {
                return ResponseEntity.ok(
                                new ApiResponse<>(HttpStatus.OK.value(),
                                                commentService.getVideoComments(videoId, page, size).getContent(),
                                                "Comments fetched successfully"));
        }

        @PostMapping("/{videoId}")
        public ResponseEntity<ApiResponse<CommentDto>> addComment(
                        @PathVariable String videoId,
                        @RequestBody Map<String, String> body) {
                String content = body.get("content");
                return ResponseEntity.ok(
                                new ApiResponse<>(HttpStatus.CREATED.value(),
                                                commentService.addComment(videoId, content),
                                                "Comment added successfully"));
        }

        @PostMapping("/reply/{commentId}")
        public ResponseEntity<ApiResponse<CommentDto>> addReply(
                        @PathVariable String commentId,
                        @RequestBody Map<String, String> body) {
                String content = body.get("content");
                return ResponseEntity.ok(
                                new ApiResponse<>(HttpStatus.CREATED.value(),
                                                commentService.addReply(commentId, content),
                                                "Reply added successfully"));
        }

        @GetMapping("/replies/{commentId}")
        public ResponseEntity<ApiResponse<List<CommentDto>>> getCommentReplies(
                        @PathVariable String commentId,
                        @RequestParam(defaultValue = "0") int page,
                        @RequestParam(defaultValue = "10") int size) {
                return ResponseEntity.ok(
                                new ApiResponse<>(HttpStatus.OK.value(),
                                                commentService.getCommentReplies(commentId, page, size).getContent(),
                                                "Replies fetched successfully"));
        }

        @PatchMapping("/c/{commentId}")
        public ResponseEntity<ApiResponse<CommentDto>> updateComment(
                        @PathVariable String commentId,
                        @RequestBody Map<String, String> body) {
                String content = body.get("content");
                return ResponseEntity.ok(
                                new ApiResponse<>(HttpStatus.OK.value(),
                                                commentService.updateComment(commentId, content),
                                                "Comment updated successfully"));
        }

        @DeleteMapping("/c/{commentId}")
        public ResponseEntity<ApiResponse<Void>> deleteComment(@PathVariable String commentId) {
                commentService.deleteComment(commentId);
                return ResponseEntity.ok(
                                new ApiResponse<>(HttpStatus.OK.value(), null, "Comment deleted successfully"));
        }
}
