package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import io.github.cdimascio.dotenv.Dotenv;


@SpringBootApplication
@ComponentScan({"controller","service","repository"})
@EnableJpaRepositories("repository")
@EntityScan("entity")
public class ExamEligibilitySystemApplication {

    public static void main(String[] args) {
    	

		Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
		dotenv.entries().forEach(e -> System.setProperty(e.getKey(), e.getValue()));
    	
        SpringApplication.run(ExamEligibilitySystemApplication.class, args);
    }
}