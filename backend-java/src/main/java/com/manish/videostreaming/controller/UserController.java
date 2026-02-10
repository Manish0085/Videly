package com.manish.videostreaming.controller;

import com.manish.videostreaming.dto.AuthResponse;
import com.manish.videostreaming.dto.LoginRequest;
import com.manish.videostreaming.dto.RegisterRequest;
import com.manish.videostreaming.dto.UserDto;
import com.manish.videostreaming.service.UserService;
import com.manish.videostreaming.utils.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping({ "/api/v1/user", "/api/v1/users" })
@RequiredArgsConstructor
public class UserController {

        private final UserService userService;

        @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<ApiResponse<AuthResponse>> register(
                        @RequestParam("username") String username,
                        @RequestParam("email") String email,
                        @RequestParam("fullName") String fullName,
                        @RequestParam("password") String password,
                        @RequestParam("avatar") MultipartFile avatar,
                        @RequestParam(value = "coverImage", required = false) MultipartFile coverImage) {
                RegisterRequest request = RegisterRequest.builder()
                                .username(username)
                                .email(email)
                                .fullName(fullName)
                                .password(password)
                                .build();
                return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(),
                                userService.register(request, avatar, coverImage), "User registered successfully"));
        }

        @PostMapping("/login")
        public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
                return ResponseEntity.ok(
                                new ApiResponse<>(HttpStatus.OK.value(), userService.login(request),
                                                "User logged in successfully"));
        }

        @GetMapping("/current-user")
        public ResponseEntity<ApiResponse<UserDto>> getCurrentUser() {
                return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(),
                                userService.mapToUserDto(userService.getCurrentUser()),
                                "Current user fetched successfully"));
        }

        @PostMapping("/logout")
        public ResponseEntity<ApiResponse<String>> logout() {
                userService.logout();
                return ResponseEntity
                                .ok(new ApiResponse<>(HttpStatus.OK.value(), null, "User logged out successfully"));
        }

        @GetMapping("/c/{username}")
        public ResponseEntity<ApiResponse<UserDto>> getUserChannelProfile(
                        @PathVariable String username) {
                return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(),
                                userService.getUserChannelProfile(username),
                                "User channel fetched successfully"));
        }

        @GetMapping("/history")
        public ResponseEntity<ApiResponse<java.util.List<com.manish.videostreaming.dto.VideoDto>>> getWatchHistory() {
                return ResponseEntity.ok(new ApiResponse<>(HttpStatus.OK.value(),
                                userService.getWatchHistory(),
                                "Watch history fetched successfully"));
        }
}
