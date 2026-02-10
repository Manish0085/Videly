package com.manish.videostreaming.repository;

import com.manish.videostreaming.model.Like;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface LikeRepository extends MongoRepository<Like, String> {
    @Query(value = "{ 'video.$id': ?0 }", count = true)
    long countByVideo_Id(String videoId);

    @Query(value = "{ 'comment.$id': ?0 }", count = true)
    long countByComment_Id(String commentId);

    @Query(value = "{ 'tweet.$id': ?0 }", count = true)
    long countByTweet_Id(String tweetId);

    @Query("{ 'video.$id': ?0, 'likedBy.$id': ?1 }")
    Optional<Like> findByVideo_IdAndLikedBy_Id(String videoId, String userId);

    @Query("{ 'comment.$id': ?0, 'likedBy.$id': ?1 }")
    Optional<Like> findByComment_IdAndLikedBy_Id(String commentId, String userId);

    @Query("{ 'tweet.$id': ?0, 'likedBy.$id': ?1 }")
    Optional<Like> findByTweet_IdAndLikedBy_Id(String tweetId, String userId);

    @Query("{ 'likedBy.$id': ?0, 'video': { $exists: true, $ne: null } }")
    List<Like> findByLikedBy_IdAndVideoIsNotNull(String userId);

    // Alias methods for backward compatibility with Service layer
    default long countByVideoId(String videoId) {
        return countByVideo_Id(videoId);
    }

    default long countByCommentId(String commentId) {
        return countByComment_Id(commentId);
    }

    default long countByTweetId(String tweetId) {
        return countByTweet_Id(tweetId);
    }

    default Optional<Like> findByVideoIdAndLikedById(String videoId, String userId) {
        return findByVideo_IdAndLikedBy_Id(videoId, userId);
    }

    default Optional<Like> findByCommentIdAndLikedById(String commentId, String userId) {
        return findByComment_IdAndLikedBy_Id(commentId, userId);
    }

    default Optional<Like> findByTweetIdAndLikedById(String tweetId, String userId) {
        return findByTweet_IdAndLikedBy_Id(tweetId, userId);
    }

    default List<Like> findByLikedByIdAndVideoIsNotNull(String userId) {
        return findByLikedBy_IdAndVideoIsNotNull(userId);
    }
}
