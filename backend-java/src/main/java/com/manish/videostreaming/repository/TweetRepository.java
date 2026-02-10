package com.manish.videostreaming.repository;

import com.manish.videostreaming.model.Tweet;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TweetRepository extends MongoRepository<Tweet, String> {
    @Query("{ 'owner.$id': ?0 }")
    List<Tweet> findByOwner_Id(String ownerId);

    // Alias
    default List<Tweet> findByOwnerId(String ownerId) {
        return findByOwner_Id(ownerId);
    }
}
