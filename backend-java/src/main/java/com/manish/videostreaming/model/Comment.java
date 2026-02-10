package com.manish.videostreaming.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "comments")
public class Comment {
    @Id
    @com.fasterxml.jackson.annotation.JsonProperty("_id")
    private String id;

    private String content;

    @DBRef
    private Video video; // The video this comment belongs to

    @DBRef
    private User owner; // The user who made the comment

    @DBRef
    private Comment parentComment; // For replies

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
