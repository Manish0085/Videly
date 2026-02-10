package com.manish.videostreaming.repository;

import com.manish.videostreaming.model.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends MongoRepository<Comment, String> {
    @Query("{ 'video.$id': ?0, 'parentComment': null }")
    Page<Comment> findByVideo_IdAndParentCommentIsNull(String videoId, Pageable pageable);

    @Query("{ 'parentComment.$id': ?0 }")
    Page<Comment> findByParentComment_Id(String parentCommentId, Pageable pageable);

    @Query(value = "{ 'parentComment.$id': ?0 }", count = true)
    long countByParentComment_Id(String parentCommentId);

    // Aliases
    default Page<Comment> findByVideoIdAndParentCommentIsNull(String videoId, Pageable pageable) {
        return findByVideo_IdAndParentCommentIsNull(videoId, pageable);
    }

    default Page<Comment> findByParentCommentId(String parentCommentId, Pageable pageable) {
        return findByParentComment_Id(parentCommentId, pageable);
    }

    default long countByParentCommentId(String parentCommentId) {
        return countByParentComment_Id(parentCommentId);
    }
}
