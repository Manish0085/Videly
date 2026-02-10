package com.manish.videostreaming.controller;

import com.manish.videostreaming.model.User;
import com.manish.videostreaming.service.SubscriptionService;
import com.manish.videostreaming.utils.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({ "/api/v1/subscriptions", "/api/v1/subscription" })
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping("/c/{channelId}")
    public ResponseEntity<ApiResponse<Void>> toggleSubscription(@PathVariable String channelId) {
        subscriptionService.toggleSubscription(channelId);
        return ResponseEntity.ok(
                new ApiResponse<>(HttpStatus.OK.value(), null, "Subscription toggled successfully"));
    }

    @GetMapping("/u/{subscriberId}")
    public ResponseEntity<ApiResponse<List<User>>> getSubscribedChannels(@PathVariable String subscriberId) {
        return ResponseEntity.ok(
                new ApiResponse<>(HttpStatus.OK.value(), subscriptionService.getSubscribedChannels(subscriberId),
                        "Subscribed channels fetched successfully"));
    }
}
