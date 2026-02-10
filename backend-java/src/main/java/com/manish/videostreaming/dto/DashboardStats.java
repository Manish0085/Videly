package com.manish.videostreaming.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStats {
    private long totalViews;
    private long totalLikes;
    private long totalVideos;
    private long totalSubscribers;
}
