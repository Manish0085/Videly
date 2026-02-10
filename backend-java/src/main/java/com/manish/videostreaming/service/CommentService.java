package com.manish.videostreaming.service;

import com.manish.videostreaming.dto.CommentDto;
import com.manish.videostreaming.exception.CustomException;
import com.manish.videostreaming.model.Comment;
import com.manish.videostreaming.model.User;
import com.manish.videostreaming.model.Video;
import com.manish.videostreaming.repository.CommentRepository;
import com.manish.videostreaming.repository.LikeRepository;
import com.manish.videostreaming.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final VideoRepository videoRepository;
    private final LikeRepository likeRepository;
    private final UserService userService;

    public CommentDto addComment(String videoId, String content) {
        User currentUser = userService.getCurrentUser();
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND.value(), "Video not found"));

        Comment comment = new Comment();
        comment.setContent(content);
        comment.setVideo(video);
        comment.setOwner(currentUser);

        Comment savedComment = commentRepository.save(comment);
        return mapToCommentDto(savedComment);
    }

    public CommentDto addReply(String commentId, String content) {
        User currentUser = userService.getCurrentUser();
        Comment parentComment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND.value(), "Comment not found"));

        Comment reply = new Comment();
        reply.setContent(content);
        reply.setVideo(parentComment.getVideo());
        reply.setOwner(currentUser);
        reply.setParentComment(parentComment);

        Comment savedReply = commentRepository.save(reply);
        return mapToCommentDto(savedReply);
    }

    public CommentDto updateComment(String commentId, String content) {
        User currentUser = userService.getCurrentUser();
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND.value(), "Comment not found"));

        if (!comment.getOwner().getId().equals(currentUser.getId())) {
            throw new CustomException(HttpStatus.FORBIDDEN.value(), "You are not authorized to edit this comment");
        }

        comment.setContent(content);
        Comment savedComment = commentRepository.save(comment);
        return mapToCommentDto(savedComment);
    }

    public void deleteComment(String commentId) {
        User currentUser = userService.getCurrentUser();
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND.value(), "Comment not found"));

        if (!comment.getOwner().getId().equals(currentUser.getId())) {
            throw new CustomException(HttpStatus.FORBIDDEN.value(), "You are not authorized to delete this comment");
        }

        // Optional: delete children? or keep them orphaned. Usually better to delete.
        commentRepository.delete(comment);
    }

    public Page<CommentDto> getVideoComments(String videoId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return commentRepository.findByVideoIdAndParentCommentIsNull(videoId, pageable)
                .map(this::mapToCommentDto);
    }

    public Page<CommentDto> getCommentReplies(String commentId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());
        return commentRepository.findByParentCommentId(commentId, pageable)
                .map(this::mapToCommentDto);
    }

    private CommentDto mapToCommentDto(Comment comment) {
        long likesCount = likeRepository.countByCommentId(comment.getId());
        long repliesCount = commentRepository.countByParentCommentId(comment.getId());

        boolean isLiked = false;
        try {
            User currentUser = userService.getCurrentUser();
            isLiked = likeRepository.findByCommentIdAndLikedById(comment.getId(), currentUser.getId()).isPresent();
        } catch (Exception e) {
            // Not logged in
        }

        return CommentDto.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .owner(userService.mapToUserDto(comment.getOwner()))
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .likesCount(likesCount)
                .isLiked(isLiked)
                .repliesCount(repliesCount)
                .videoId(comment.getVideo().getId())
                .parentCommentId(comment.getParentComment() != null ? comment.getParentComment().getId() : null)
                .build();
    }
}
