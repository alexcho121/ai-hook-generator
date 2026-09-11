package com.samcho.hookgenerator.history;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "history")
@Getter
@Setter
@NoArgsConstructor
public class History {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String topic;

    @Column(nullable = false)
    private String platform;

    @Column(name = "hook_text", nullable = false, columnDefinition = "TEXT")
    private String hookText;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }

    @Column(name = "score")
    private Integer score = 0;

    @Column(name = "quality_score")
    private Integer qualityScore = 0;

    @Column(name = "engagement_score")
    private Integer engagementScore = 0;

    @Column(name = "hook_type")
    private String hookType;

    @Column(name = "emotion_trigger")
    private String emotionTrigger;

    @Column(name = "length_range")
    private String lengthRange;

    @Column(name = "impression_count")
    private Integer impressionCount = 1;

    @Column(name = "copy_count")
    private Integer copyCount = 0;

    @Column(name = "regenerate_count")
    private Integer regenerateCount = 0;

    @Column(name = "like_count")
    private Integer likeCount = 0;

    @Column(name = "dislike_count")
    private Integer dislikeCount = 0;

    public void incrementLike() {
        this.likeCount++;
    }

    public void incrementDislike() {
        this.dislikeCount++;
    }
}
