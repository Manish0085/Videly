package com.manish.videostreaming.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {
    @com.fasterxml.jackson.annotation.JsonProperty("_id")
    private String id;
    private String username;
    private String email;
    private String fullName;
    private String avatar;
    private String coverImage;
    private long subscribersCount;
    private long channelsSubscribedToCount;
    @com.fasterxml.jackson.annotation.JsonProperty("isSubscribed")
    private boolean isSubscribed;
}
