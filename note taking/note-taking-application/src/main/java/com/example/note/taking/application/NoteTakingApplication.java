package com.example.note.taking.application;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class NoteTakingApplication {

	public static void main(String[] args) {
		SpringApplication.run(NoteTakingApplication.class, args);
	}

}
