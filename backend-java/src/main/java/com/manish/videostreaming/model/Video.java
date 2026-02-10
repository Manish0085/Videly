package com.manish.videostreaming.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "videos")
public class Video {
    @Id
    @com.fasterxml.jackson.annotation.JsonProperty("_id")
    private String id;

    private String videoFile; // cloudinary url
    private String thumbnail; // cloudinary url

    private String title;
    private String description;
    private Integer duration;

    private Long views = 0L;
    private Boolean isPublished = true;
    private Boolean isShort = false;

    @DBRef
    private User owner;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
