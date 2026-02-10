package com.manish.videostreaming.service;

import com.manish.videostreaming.exception.CustomException;
import com.manish.videostreaming.model.Playlist;
import com.manish.videostreaming.model.User;
import com.manish.videostreaming.model.Video;
import com.manish.videostreaming.repository.PlaylistRepository;
import com.manish.videostreaming.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final VideoRepository videoRepository;
    private final UserService userService;

    public Playlist createPlaylist(String name, String description) {
        User currentUser = userService.getCurrentUser();
        Playlist playlist = new Playlist();
        playlist.setName(name);
        playlist.setDescription(description);
        playlist.setOwner(currentUser);
        return playlistRepository.save(playlist);
    }

    public Playlist getPlaylistById(String playlistId) {
        return playlistRepository.findById(playlistId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND.value(), "Playlist not found"));
    }

    public Playlist addVideoToPlaylist(String playlistId, String videoId) {
        Playlist playlist = getPlaylistById(playlistId);
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND.value(), "Video not found"));

        if (playlist.getVideos().contains(video)) {
            throw new CustomException(HttpStatus.CONFLICT.value(), "Video already in playlist");
        }

        playlist.getVideos().add(video);
        return playlistRepository.save(playlist);
    }

    public Playlist removeVideoFromPlaylist(String playlistId, String videoId) {
        Playlist playlist = getPlaylistById(playlistId);
        Video video = videoRepository.findById(videoId)
                .orElseThrow(() -> new CustomException(HttpStatus.NOT_FOUND.value(), "Video not found"));

        playlist.getVideos().remove(video);
        return playlistRepository.save(playlist);
    }

    public void deletePlaylist(String playlistId) {
        User currentUser = userService.getCurrentUser();
        Playlist playlist = getPlaylistById(playlistId);

        if (!playlist.getOwner().getId().equals(currentUser.getId())) {
            throw new CustomException(HttpStatus.FORBIDDEN.value(), "You are not authorized to delete this playlist");
        }

        playlistRepository.delete(playlist);
    }

    public Playlist updatePlaylist(String playlistId, String name, String description) {
        User currentUser = userService.getCurrentUser();
        Playlist playlist = getPlaylistById(playlistId);

        if (!playlist.getOwner().getId().equals(currentUser.getId())) {
            throw new CustomException(HttpStatus.FORBIDDEN.value(), "You are not authorized to update this playlist");
        }

        playlist.setName(name);
        playlist.setDescription(description);
        return playlistRepository.save(playlist);
    }

    public List<Playlist> getUserPlaylists(String userId) {
        return playlistRepository.findByOwnerId(userId);
    }
}
