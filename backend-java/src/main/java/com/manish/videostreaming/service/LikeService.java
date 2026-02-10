package com.manish.videostreaming.service;

import com.manish.videostreaming.exception.CustomException;
import com.manish.videostreaming.model.Like;
import com.manish.videostreaming.model.User;
import com.manish.videostreaming.repository.CommentRepository;
import com.manish.videostreaming.repository.LikeRepository;
import com.manish.videostreaming.repository.TweetRepository;
import com.manish.videostreaming.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final VideoRepository videoRepository;
    private final CommentRepository commentRepository;
    private final TweetRepository tweetRepository;
    private final UserService userService;

    public void toggleVideoLike(String videoId) {
        User currentUser = userService.getCurrentUser();

        Optional<Like> existingLike = likeRepository.findByVideo_IdAndLikedBy_Id(videoId, currentUser.getId());

        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
        } else {
            Like like = new Like();
            like.setVideo(videoRepository.findById(videoId)
                    .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND.value(), "Video not found")));
            like.setLikedBy(currentUser);
            likeRepository.save(like);
        }
    }

    public void toggleCommentLike(String commentId) {
        User currentUser = userService.getCurrentUser();

        Optional<Like> existingLike = likeRepository.findByComment_IdAndLikedBy_Id(commentId, currentUser.getId());

        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
        } else {
            Like like = new Like();
            like.setComment(commentRepository.findById(commentId)
                    .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND.value(), "Comment not found")));
            like.setLikedBy(currentUser);
            likeRepository.save(like);
        }
    }

    public void toggleTweetLike(String tweetId) {
        User currentUser = userService.getCurrentUser();

        Optional<Like> existingLike = likeRepository.findByTweet_IdAndLikedBy_Id(tweetId, currentUser.getId());

        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
        } else {
            Like like = new Like();
            like.setTweet(tweetRepository.findById(tweetId)
                    .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND.value(), "Tweet not found")));
            like.setLikedBy(currentUser);
            likeRepository.save(like);
        }
    }

    public java.util.List<com.manish.videostreaming.dto.VideoDto> getLikedVideos() {
        User currentUser = userService.getCurrentUser();
        return likeRepository.findByLikedBy_IdAndVideoIsNotNull(currentUser.getId()).stream()
                .map(like -> like.getVideo())
                .filter(java.util.Objects::nonNull)
                .map(video -> com.manish.videostreaming.dto.VideoDto.builder()
                        .id(video.getId())
                        .thumbnail(video.getThumbnail())
                        .title(video.getTitle())
                        .duration(video.getDuration())
                        .views(video.getViews())
                        .owner(video.getOwner() != null ? userService.mapToUserDto(video.getOwner()) : null)
                        .createdAt(video.getCreatedAt())
                        .build())
                .toList();
    }
}
