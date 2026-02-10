package com.manish.videostreaming.repository;

import com.manish.videostreaming.model.Subscription;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends MongoRepository<Subscription, String> {
    @Query(value = "{ 'channel.$id': ?0 }", count = true)
    long countByChannel_Id(String channelId); // Subscribers count

    @Query(value = "{ 'subscriber.$id': ?0 }", count = true)
    long countBySubscriber_Id(String subscriberId); // Subscribed to count

    @Query("{ 'subscriber.$id': ?0, 'channel.$id': ?1 }")
    Optional<Subscription> findBySubscriber_IdAndChannel_Id(String subscriberId, String channelId);

    @Query("{ 'subscriber.$id': ?0 }")
    List<Subscription> findBySubscriber_Id(String subscriberId);

    // Aliases for backward compatibility with Service layer
    default long countByChannelId(String channelId) {
        return countByChannel_Id(channelId);
    }

    default long countBySubscriberId(String subscriberId) {
        return countBySubscriber_Id(subscriberId);
    }

    default Optional<Subscription> findBySubscriberIdAndChannelId(String subscriberId, String channelId) {
        return findBySubscriber_IdAndChannel_Id(subscriberId, channelId);
    }

    default List<Subscription> findBySubscriberId(String subscriberId) {
        return findBySubscriber_Id(subscriberId);
    }
}
