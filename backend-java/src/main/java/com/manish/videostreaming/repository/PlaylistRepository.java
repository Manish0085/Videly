package com.manish.videostreaming.repository;

import com.manish.videostreaming.model.Playlist;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaylistRepository extends MongoRepository<Playlist, String> {
    @Query("{ 'owner.$id': ?0 }")
    List<Playlist> findByOwner_Id(String ownerId);

    // Alias
    default List<Playlist> findByOwnerId(String ownerId) {
        return findByOwner_Id(ownerId);
    }
}
