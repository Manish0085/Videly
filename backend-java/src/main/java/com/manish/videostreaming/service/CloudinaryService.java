package com.manish.videostreaming.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public String uploadFile(MultipartFile file, String folder) {
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("folder", folder, "resource_type", "auto"));
            return uploadResult.get("url").toString();
        } catch (IOException e) {
            throw new RuntimeException("Image upload failed");
        }
    }

    public Map uploadVideo(MultipartFile file, String folder) {
        try {
            return cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("folder", folder, "resource_type", "video"));
        } catch (IOException e) {
            throw new RuntimeException("Video upload failed");
        }
    }
}
