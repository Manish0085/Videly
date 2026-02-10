package com.manish.videostreaming.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentDto {
    @com.fasterxml.jackson.annotation.JsonProperty("_id")
    private String id;
    private String content;
    private UserDto owner;
    private Instant createdAt;
    private Instant updatedAt;
    private long likesCount;
    private boolean isLiked;
    private long repliesCount;
    private String videoId;
    private String parentCommentId;
}
