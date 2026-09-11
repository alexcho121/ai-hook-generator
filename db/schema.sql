CREATE TABLE IF NOT EXISTS history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    topic VARCHAR(255) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    hook_text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    score INT DEFAULT 0,
    quality_score INT DEFAULT 0,
    engagement_score INT DEFAULT 0,
    hook_type VARCHAR(50),
    emotion_trigger VARCHAR(50),
    length_range VARCHAR(20),
    impression_count INT DEFAULT 1,
    copy_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    dislike_count INT DEFAULT 0,
    regenerate_count INT DEFAULT 0
);
