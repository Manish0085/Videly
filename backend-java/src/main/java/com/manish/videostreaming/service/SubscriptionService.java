package com.manish.videostreaming.service;

import com.manish.videostreaming.exception.CustomException;
import com.manish.videostreaming.model.Subscription;
import com.manish.videostreaming.model.User;
import com.manish.videostreaming.repository.SubscriptionRepository;
import com.manish.videostreaming.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final UserService userService;

    public void toggleSubscription(String channelId) {
        User currentUser = userService.getCurrentUser();

        if (currentUser.getId().equals(channelId)) {
            throw new CustomException(HttpStatus.BAD_REQUEST.value(), "Cannot subscribe to yourself");
        }

        Optional<Subscription> subscription = subscriptionRepository.findBySubscriber_IdAndChannel_Id(
                currentUser.getId(),
                channelId);

        if (subscription.isPresent()) {
            subscriptionRepository.delete(subscription.get());
        } else {
            User channel = userRepository.findById(channelId)
                    .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND.value(), "Channel not found"));

            Subscription newSubscription = new Subscription();
            newSubscription.setSubscriber(currentUser);
            newSubscription.setChannel(channel);
            subscriptionRepository.save(newSubscription);
        }
    }

    public List<User> getSubscribedChannels(String subscriberId) {
        List<Subscription> subscriptions = subscriptionRepository.findBySubscriber_Id(subscriberId);
        return subscriptions.stream().map(Subscription::getChannel).collect(Collectors.toList());
    }
}
