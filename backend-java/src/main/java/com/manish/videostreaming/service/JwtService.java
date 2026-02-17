package com.manish.videostreaming.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret:dummy}")
    private String secretKey;

    @Value("${jwt.expiration:1d}")
    private String jwtExpiration; // in milliseconds

    @Value("${jwt.refresh-secret:dummy}")
    private String refreshSecretKey;

    @Value("${jwt.refresh-expiration:1d}")
    private String refreshJwtExpiration;

    public long getExpirationInMillis(String expiration) {
        if (expiration == null)
            return 86400000; // default 1 day
        try {
            return Long.parseLong(expiration);
        } catch (NumberFormatException e) {
            // detailed parsing
            String lower = expiration.toLowerCase();
            if (lower.endsWith("d")) {
                return Long.parseLong(lower.replace("d", "")) * 24 * 60 * 60 * 1000;
            } else if (lower.endsWith("h")) {
                return Long.parseLong(lower.replace("h", "")) * 60 * 60 * 1000;
            } else if (lower.endsWith("m")) {
                return Long.parseLong(lower.replace("m", "")) * 60 * 1000;
            } else if (lower.endsWith("s")) {
                return Long.parseLong(lower.replace("s", "")) * 1000;
            }
            return 86400000;
        }
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return buildToken(extraClaims, userDetails, getExpirationInMillis(jwtExpiration), secretKey);
    }

    public String generateRefreshToken(UserDetails userDetails) {
        return buildToken(new HashMap<>(), userDetails, getExpirationInMillis(refreshJwtExpiration), refreshSecretKey);
    }

    private String buildToken(Map<String, Object> extraClaims, UserDetails userDetails, long expiration,
            String secret) {
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignInKey(secret), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey(secretKey))
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey(String secret) {
        byte[] keyBytes = secret.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
