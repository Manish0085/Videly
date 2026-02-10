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
public class VideoDto {
    @com.fasterxml.jackson.annotation.JsonProperty("_id")
    private String id;
    private String videoFile;
    private String thumbnail;
    private String title;
    private String description;
    private Integer duration;
    private Long views;
    @com.fasterxml.jackson.annotation.JsonProperty("isPublished")
    private Boolean isPublished;
    @com.fasterxml.jackson.annotation.JsonProperty("isShort")
    private Boolean isShort;
    private UserDto owner;
    private Instant createdAt;
    private Instant updatedAt;

    // Extra fields for frontend
    @com.fasterxml.jackson.annotation.JsonProperty("isLiked")
    private boolean isLiked;
    private long likesCount;
    @com.fasterxml.jackson.annotation.JsonProperty("isSubscribed")
    private boolean isSubscribed;
    private long subscribersCount;
}
