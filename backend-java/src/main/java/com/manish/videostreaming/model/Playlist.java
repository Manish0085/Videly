package com.manish.videostreaming.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Data
@Document(collection = "playlists")
public class Playlist {
    @Id
    @com.fasterxml.jackson.annotation.JsonProperty("_id")
    private String id;

    private String name;
    private String description;

    @DBRef
    private List<Video> videos = new ArrayList<>();

    @DBRef
    private User owner;

    private Boolean isPublic = true;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
