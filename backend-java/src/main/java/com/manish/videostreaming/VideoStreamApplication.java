package com.manish.videostreaming;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class VideoStreamApplication {

	public static void main(String[] args) {
		// Dotenv dotenv = Dotenv.configure().directory("..").ignoreIfMissing().load();
		// dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(),
		// entry.getValue()));

		SpringApplication.run(VideoStreamApplication.class, args);
	}

}
