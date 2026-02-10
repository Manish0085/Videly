package com.manish.videostreaming.repository;

import com.manish.videostreaming.model.Video;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoRepository extends MongoRepository<Video, String> {
    List<Video> findByIsPublishedTrue();

    // Long videos: either isShort is explicitly false, or the field is missing
    @Query("{ 'isPublished': true, 'isShort': false }")
    List<Video> findByIsShortFalseAndIsPublishedTrue();

    // Shorts: must have isShort explicitly set to true
    @Query("{ 'isPublished': true, 'isShort': true }")
    List<Video> findByIsShortTrueAndIsPublishedTrue();

    // Find all videos by owner using a flexible query that handles both DBRef and
    // raw ID
    @Query("{ $or: [ { 'owner.$id': ?0 }, { 'owner': ?0 }, { 'owner._id': ?0 } ] }")
    List<Video> findByOwner_Id(String ownerId);

    List<Video> findByOwner(com.manish.videostreaming.model.User owner);

    // Search videos by title or description (case-insensitive) - excluding shorts
    @Query("{ 'isPublished': true, 'isShort': { $ne: true }, $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'description': { $regex: ?0, $options: 'i' } } ] }")
    List<Video> searchByTitleOrDescription(String query);

    // Alias
    default List<Video> findByOwnerId(String ownerId) {
        return findByOwner_Id(ownerId);
    }
}
