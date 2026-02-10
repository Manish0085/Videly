package com.manish.videostreaming.service;

import com.manish.videostreaming.dto.DashboardStats;
import com.manish.videostreaming.dto.VideoDto;
import com.manish.videostreaming.model.User;
import com.manish.videostreaming.model.Video;
import com.manish.videostreaming.repository.LikeRepository;
import com.manish.videostreaming.repository.SubscriptionRepository;
import com.manish.videostreaming.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final VideoRepository videoRepository;
    private final LikeRepository likeRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final UserService userService;
    private final VideoService videoService;

    public DashboardStats getStats() {
        User user = userService.getCurrentUser();
        List<Video> userVideos = videoRepository.findByOwner_Id(user.getId());

        long totalViews = userVideos.stream().mapToLong(Video::getViews).sum();
        long totalVideos = userVideos.size();

        long totalLikes = 0;
        for (Video v : userVideos) {
            totalLikes += likeRepository.countByVideoId(v.getId());
        }

        long totalSubscribers = subscriptionRepository.countByChannelId(user.getId());

        return DashboardStats.builder()
                .totalViews(totalViews)
                .totalVideos(totalVideos)
                .totalLikes(totalLikes)
                .totalSubscribers(totalSubscribers)
                .build();
    }

    public List<VideoDto> getChannelVideos() {
        User user = userService.getCurrentUser();
        return videoRepository.findByOwner_Id(user.getId()).stream()
                .map(videoService::mapToVideoDto)
                .toList();
    }
}
