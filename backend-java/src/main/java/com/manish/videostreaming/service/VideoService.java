package com.manish.videostreaming.service;

import com.manish.videostreaming.dto.VideoDto;
import com.manish.videostreaming.exception.CustomException;
import com.manish.videostreaming.model.User;
import com.manish.videostreaming.model.Video;
import com.manish.videostreaming.repository.VideoRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class VideoService {

    private final VideoRepository videoRepository;
    private final CloudinaryService cloudinaryService;
    private final UserService userService;
    private final com.manish.videostreaming.repository.LikeRepository likeRepository;
    private final com.manish.videostreaming.repository.SubscriptionRepository subscriptionRepository;

    public String getCurrentUsername() {
        try {
            var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            return (auth != null && auth.isAuthenticated()) ? auth.getName() : "anonymous";
        } catch (Exception e) {
            return "anonymous";
        }
    }

    @CacheEvict(value = { "video:long", "video:short" }, allEntries = true)
    public Video uploadVideo(String title, String description, MultipartFile videoFile, MultipartFile thumbnail,
            boolean isShort) {
        User currentUser = userService.getCurrentUser();

        Map videoUploadResult = cloudinaryService.uploadVideo(videoFile, "videos");
        String videoUrl = (String) videoUploadResult.get("url");
        Double duration = (Double) videoUploadResult.get("duration");

        String thumbnailUrl = cloudinaryService.uploadFile(thumbnail, "thumbnails");

        Video video = new Video();
        video.setTitle(title);
        video.setDescription(description);
        video.setVideoFile(videoUrl);
        video.setThumbnail(thumbnailUrl);
        video.setDuration(duration != null ? duration.intValue() : 0);
        video.setOwner(currentUser);
        video.setViews(0L);
        video.setIsPublished(true);

        // Auto-detect isShort if duration is under 60 seconds, even if user didn't
        // check it
        if (video.getDuration() != null && video.getDuration() > 0 && video.getDuration() <= 60) {
            video.setIsShort(true);
        } else {
            video.setIsShort(isShort);
        }

        return videoRepository.save(video);
    }

    @Cacheable(value = "video:long", key = "#root.methodName + '_' + #root.target.getCurrentUsername()")
    public List<VideoDto> getAllVideos() {
        System.out.println("DEBUG: VideoService.getAllVideos() called for user: " + getCurrentUsername());
        // Return only long videos (isShort = false)
        return videoRepository.findByIsShortFalseAndIsPublishedTrue().stream()
                .map(this::mapToVideoDto)
                .collect(java.util.stream.Collectors.toList());
    }

    @Cacheable(value = "video:short", key = "#root.methodName + '_' + #root.target.getCurrentUsername()")
    public List<VideoDto> getAllShorts() {
        // Return only shorts (isShort = true)
        return videoRepository.findByIsShortTrueAndIsPublishedTrue().stream()
                .map(this::mapToVideoDto)
                .collect(java.util.stream.Collectors.toList());
    }

    @Cacheable(value = "video:entity", key = "#id + '_' + #root.target.getCurrentUsername()")
    public VideoDto getVideoById(String id) {
        Video video = videoRepository.findById(id)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND.value(), "Video not found"));

        try {
            userService.addToWatchHistory(id);
        } catch (Exception e) {
        }

        return mapToVideoDto(video);
    }

    @Cacheable(value = "video:search", key = "#query + '_' + #root.target.getCurrentUsername()")
    public List<VideoDto> searchVideos(String query) {
        System.out.println("DEBUG: VideoService.searchVideos() called with query: " + query + " for user: "
                + getCurrentUsername());
        if (query == null || query.trim().isEmpty()) {
            return java.util.Collections.emptyList();
        }
        return videoRepository.searchByTitleOrDescription(query.trim()).stream()
                .map(this::mapToVideoDto)
                .collect(java.util.stream.Collectors.toList());
    }

    @CacheEvict(value = "video:entity", key = "#videoId")
    public void incrementViews(String videoId) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND.value(), "Video not found"));
        video.setViews(video.getViews() + 1);
        videoRepository.save(video);
    }

    public VideoDto mapToVideoDto(Video video) {
        long likesCount = likeRepository.countByVideo_Id(video.getId());
        long subscribersCount = 0;
        if (video.getOwner() != null) {
            subscribersCount = subscriptionRepository.countByChannel_Id(video.getOwner().getId());
        }

        boolean isLiked = false;
        boolean isSubscribed = false;

        try {
            User currentUser = userService.getCurrentUser();
            isLiked = likeRepository.findByVideo_IdAndLikedBy_Id(video.getId(), currentUser.getId()).isPresent();
            if (video.getOwner() != null) {
                isSubscribed = subscriptionRepository
                        .findBySubscriber_IdAndChannel_Id(currentUser.getId(), video.getOwner().getId()).isPresent();
            }
        } catch (Exception e) {
        }

        return VideoDto.builder()
                .id(video.getId())
                .videoFile(video.getVideoFile())
                .thumbnail(video.getThumbnail())
                .title(video.getTitle())
                .description(video.getDescription())
                .duration(video.getDuration())
                .views(video.getViews())
                .isPublished(video.getIsPublished())
                .isShort(video.getIsShort())
                .owner(userService.mapToUserDto(video.getOwner()))
                .createdAt(video.getCreatedAt())
                .updatedAt(video.getUpdatedAt())
                .isLiked(isLiked)
                .likesCount(likesCount)
                .isSubscribed(isSubscribed)
                .subscribersCount(subscribersCount)
                .build();
    }

    @Caching(evict = {
            @CacheEvict(value = "video:long", allEntries = true),
            @CacheEvict(value = "video:short", allEntries = true),
            @CacheEvict(value = "video:entity", key = "#videoId")
    })
    public Video togglePublishStatus(String videoId) {
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND.value(), "Video not found"));
        User currentUser = userService.getCurrentUser();

        if (!video.getOwner().getId().equals(currentUser.getId())) {
            throw new CustomException(HttpStatus.FORBIDDEN.value(), "You are not the owner of this video");
        }

        video.setIsPublished(!video.getIsPublished());
        return videoRepository.save(video);
    }
}
