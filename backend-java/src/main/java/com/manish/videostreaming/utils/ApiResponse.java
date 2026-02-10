package com.manish.videostreaming.utils;

import lombok.Data;

@Data
public class ApiResponse<T> {
    private int statusCode;
    private T data;
    private String message;
    private boolean success;

    public ApiResponse(int statusCode, T data, String message) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}
