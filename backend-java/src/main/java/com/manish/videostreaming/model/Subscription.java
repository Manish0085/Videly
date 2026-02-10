package com.manish.videostreaming.model;

import lombok.Data;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Data
@Document(collection = "subscriptions")
public class Subscription {
    @Id
    @com.fasterxml.jackson.annotation.JsonProperty("_id")
    private String id;

    @DBRef
    private User subscriber;

    @DBRef
    private User channel;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
