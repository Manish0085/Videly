package com.manish.videostreaming.service;

import com.manish.videostreaming.dto.TweetDto;
import com.manish.videostreaming.exception.CustomException;
import com.manish.videostreaming.model.Tweet;
import com.manish.videostreaming.model.User;
import com.manish.videostreaming.repository.LikeRepository;
import com.manish.videostreaming.repository.TweetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TweetService {

    private final TweetRepository tweetRepository;
    private final LikeRepository likeRepository;
    private final UserService userService;

    public TweetDto createTweet(String content) {
        User currentUser = userService.getCurrentUser();
        Tweet tweet = new Tweet();
        tweet.setContent(content);
        tweet.setOwner(currentUser);
        Tweet savedTweet = tweetRepository.save(tweet);
        return mapToTweetDto(savedTweet);
    }

    public TweetDto updateTweet(String tweetId, String content) {
        User currentUser = userService.getCurrentUser();
        Tweet tweet = tweetRepository.findById(tweetId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND.value(), "Tweet not found"));

        if (!tweet.getOwner().getId().equals(currentUser.getId())) {
            throw new CustomException(HttpStatus.FORBIDDEN.value(), "You are not authorized to edit this tweet");
        }

        tweet.setContent(content);
        Tweet savedTweet = tweetRepository.save(tweet);
        return mapToTweetDto(savedTweet);
    }

    public void deleteTweet(String tweetId) {
        User currentUser = userService.getCurrentUser();
        Tweet tweet = tweetRepository.findById(tweetId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND.value(), "Tweet not found"));

        if (!tweet.getOwner().getId().equals(currentUser.getId())) {
            throw new CustomException(HttpStatus.FORBIDDEN.value(), "You are not authorized to delete this tweet");
        }

        tweetRepository.delete(tweet);
    }

    public List<TweetDto> getAllTweets() {
        return tweetRepository.findAll().stream()
                .filter(java.util.Objects::nonNull)
                .map(this::mapToTweetDto)
                .toList();
    }

    public List<TweetDto> getUserTweets(String userId) {
        return tweetRepository.findByOwnerId(userId).stream()
                .filter(java.util.Objects::nonNull)
                .map(this::mapToTweetDto)
                .toList();
    }

    private TweetDto mapToTweetDto(Tweet tweet) {
        long likesCount = likeRepository.countByTweetId(tweet.getId());
        boolean isLiked = false;

        try {
            User currentUser = userService.getCurrentUser();
            isLiked = likeRepository.findByTweetIdAndLikedById(tweet.getId(), currentUser.getId()).isPresent();
        } catch (Exception e) {
            // Not logged in or expired
        }

        return TweetDto.builder()
                .id(tweet.getId())
                .content(tweet.getContent())
                .owner(tweet.getOwner() != null ? userService.mapToUserDto(tweet.getOwner()) : null)
                .createdAt(tweet.getCreatedAt())
                .updatedAt(tweet.getUpdatedAt())
                .isLiked(isLiked)
                .likesCount(likesCount)
                .build();
    }
}
