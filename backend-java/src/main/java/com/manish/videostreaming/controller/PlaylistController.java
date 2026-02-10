package com.manish.videostreaming.controller;

import com.manish.videostreaming.model.Playlist;
import com.manish.videostreaming.service.PlaylistService;
import com.manish.videostreaming.utils.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping({ "/api/v1/playlist", "/api/v1/playlists" })
@RequiredArgsConstructor
public class PlaylistController {

        private final PlaylistService playlistService;

        @PostMapping
        public ResponseEntity<ApiResponse<Playlist>> createPlaylist(@RequestBody java.util.Map<String, String> body) {
                String name = body.get("name");
                String description = body.get("description");
                return ResponseEntity.ok(
                                new ApiResponse<>(HttpStatus.CREATED.value(),
                                                playlistService.createPlaylist(name, description),
                                                "Playlist created successfully"));
        }

        @GetMapping("/{playlistId}")
        public ResponseEntity<ApiResponse<Playlist>> getPlaylistById(@PathVariable String playlistId) {
                return ResponseEntity.ok(
                                new ApiResponse<>(HttpStatus.OK.value(), playlistService.getPlaylistById(playlistId),
                                                "Playlist fetched successfully"));
        }

        @PatchMapping("/add/{videoId}/{playlistId}")
        public ResponseEntity<ApiResponse<Playlist>> addVideoToPlaylist(
                        @PathVariable String videoId,
                        @PathVariable String playlistId) {
                return ResponseEntity.ok(
                                new ApiResponse<>(HttpStatus.OK.value(),
                                                playlistService.addVideoToPlaylist(playlistId, videoId),
                                                "Video added to playlist successfully"));
        }

        @PatchMapping("/remove/{videoId}/{playlistId}")
        public ResponseEntity<ApiResponse<Playlist>> removeVideoFromPlaylist(
                        @PathVariable String videoId,
                        @PathVariable String playlistId) {
                return ResponseEntity.ok(
                                new ApiResponse<>(HttpStatus.OK.value(),
                                                playlistService.removeVideoFromPlaylist(playlistId, videoId),
                                                "Video removed from playlist successfully"));
        }

        @DeleteMapping("/{playlistId}")
        public ResponseEntity<ApiResponse<Void>> deletePlaylist(@PathVariable String playlistId) {
                playlistService.deletePlaylist(playlistId);
                return ResponseEntity.ok(
                                new ApiResponse<>(HttpStatus.OK.value(), null, "Playlist deleted successfully"));
        }

        @PatchMapping("/{playlistId}")
        public ResponseEntity<ApiResponse<Playlist>> updatePlaylist(
                        @PathVariable String playlistId,
                        @RequestBody java.util.Map<String, String> body) {
                String name = body.get("name");
                String description = body.get("description");
                return ResponseEntity.ok(
                                new ApiResponse<>(HttpStatus.OK.value(),
                                                playlistService.updatePlaylist(playlistId, name, description),
                                                "Playlist updated successfully"));
        }

        @GetMapping("/user/{userId}")
        public ResponseEntity<ApiResponse<List<Playlist>>> getUserPlaylists(@PathVariable String userId) {
                return ResponseEntity.ok(
                                new ApiResponse<>(HttpStatus.OK.value(), playlistService.getUserPlaylists(userId),
                                                "User playlists fetched successfully"));
        }
}
