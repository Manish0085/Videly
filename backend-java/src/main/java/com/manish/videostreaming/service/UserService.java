package com.manish.videostreaming.service;

import com.manish.videostreaming.dto.AuthResponse;
import com.manish.videostreaming.dto.LoginRequest;
import com.manish.videostreaming.dto.RegisterRequest;
import com.manish.videostreaming.dto.UserDto;
import com.manish.videostreaming.exception.CustomException;
import com.manish.videostreaming.model.User;
import com.manish.videostreaming.model.Video;
import com.manish.videostreaming.repository.UserRepository;
import com.manish.videostreaming.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.manish.videostreaming.repository.SubscriptionRepository;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final VideoRepository videoRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CloudinaryService cloudinaryService;
    private final SubscriptionRepository subscriptionRepository;

    public AuthResponse register(RegisterRequest request, MultipartFile avatar, MultipartFile coverImage) {
        if (repository.existsByUsername(request.getUsername())) {
            throw new CustomException(HttpStatus.BAD_REQUEST.value(), "Username already exists");
        }
        if (repository.existsByEmail(request.getEmail())) {
            throw new CustomException(HttpStatus.BAD_REQUEST.value(), "Email already exists");
        }

        String avatarUrl = cloudinaryService.uploadFile(avatar, "avatars");
        String coverImageUrl = coverImage != null ? cloudinaryService.uploadFile(coverImage, "covers") : null;

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullName(request.getFullName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setAvatar(avatarUrl);
        user.setCoverImage(coverImageUrl);

        repository.save(user);

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities("USER")
                .build();

        String accessToken = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        user.setRefreshToken(refreshToken);
        repository.save(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(mapToUserDto(user))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        String identifier = request.getEmail() != null && !request.getEmail().isEmpty() ? request.getEmail()
                : request.getUsername();

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(identifier, request.getPassword()));

        User user = repository.findByEmailOrUsername(identifier, identifier)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND.value(), "User not found"));

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities("USER")
                .build();

        String accessToken = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        user.setRefreshToken(refreshToken);
        repository.save(user);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(mapToUserDto(user))
                .build();
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || authentication.getPrincipal() instanceof String) {
            throw new CustomException(HttpStatus.UNAUTHORIZED.value(), "Not authenticated");
        }

        UserDetails principal = (UserDetails) authentication.getPrincipal();
        return repository.findByEmail(principal.getUsername())
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND.value(), "User not found"));
    }

    public void logout() {
        User user = getCurrentUser();
        user.setRefreshToken(null);
        repository.save(user);
    }

    public UserDto mapToUserDto(User user) {
        if (user == null)
            return null;
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .avatar(user.getAvatar())
                .coverImage(user.getCoverImage())
                .build();
    }

    public UserDto getUserChannelProfile(String username) {
        User user = repository.findByUsername(username)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND.value(), "User not found"));

        long subscribersCount = subscriptionRepository.countByChannelId(user.getId());
        long channelsSubscribedToCount = subscriptionRepository.countBySubscriberId(user.getId());

        boolean isSubscribed = false;
        try {
            User currentUser = getCurrentUser();
            isSubscribed = subscriptionRepository.findBySubscriberIdAndChannelId(currentUser.getId(), user.getId())
                    .isPresent();
        } catch (Exception e) {
            // Not logged in or other issue
        }

        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .avatar(user.getAvatar())
                .coverImage(user.getCoverImage())
                .subscribersCount(subscribersCount)
                .channelsSubscribedToCount(channelsSubscribedToCount)
                .isSubscribed(isSubscribed)
                .build();
    }

    public void addToWatchHistory(String videoId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()
                && !(authentication.getPrincipal() instanceof String)) {
            User user = getCurrentUser();

            Video video = videoRepository.findById(videoId)
                    .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND.value(), "Video not found"));

            // Remove if exists to re-add at the end (most recent)
            user.getWatchHistory().removeIf(v -> v.getId().equals(videoId));
            user.getWatchHistory().add(video);

            repository.save(user);
        }
    }

    public java.util.List<com.manish.videostreaming.dto.VideoDto> getWatchHistory() {
        User user = getCurrentUser();
        if (user.getWatchHistory() == null)
            return java.util.Collections.emptyList();

        return user.getWatchHistory().stream()
                .filter(java.util.Objects::nonNull)
                .map(video -> com.manish.videostreaming.dto.VideoDto.builder()
                        .id(video.getId())
                        .videoFile(video.getVideoFile())
                        .thumbnail(video.getThumbnail())
                        .title(video.getTitle())
                        .description(video.getDescription())
                        .duration(video.getDuration())
                        .views(video.getViews())
                        .isPublished(video.getIsPublished())
                        .owner(video.getOwner() != null ? mapToUserDto(video.getOwner()) : null)
                        .createdAt(video.getCreatedAt())
                        .updatedAt(video.getUpdatedAt())
                        .build())
                .collect(java.util.stream.Collectors.toList());
    }
}
