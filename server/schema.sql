-- ====================================================================
-- FASTHUNT RECRUITMENT AGENT - DATABASE SCHEMA
-- Compatible with PostgreSQL, MySQL 8.0+, and SQLite 3
-- Module: Zalo AI Assistant & Candidate / Job Management
-- ====================================================================

-- 1. Table: zalo_oa_configs (Zalo Official Account Credentials & Tokens)
CREATE TABLE IF NOT EXISTS zalo_oa_configs (
    id VARCHAR(64) PRIMARY KEY,
    app_id VARCHAR(128) NOT NULL,
    secret_key VARCHAR(256) NOT NULL,
    oa_id VARCHAR(128) NOT NULL,
    oa_name VARCHAR(256) DEFAULT 'FASTHUNT Tuyển Dụng',
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    webhook_secret VARCHAR(256),
    webhook_url VARCHAR(512),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Table: messages (Ingested Zalo Webhook Messages & Group Chats)
CREATE TABLE IF NOT EXISTS messages (
    id VARCHAR(64) PRIMARY KEY,
    oa_id VARCHAR(128) NOT NULL,
    sender_id VARCHAR(128) NOT NULL,
    sender_name VARCHAR(256) NOT NULL,
    group_id VARCHAR(128) DEFAULT NULL,
    group_name VARCHAR(256) DEFAULT NULL,
    event_type VARCHAR(64) NOT NULL, -- 'user_send_text', 'user_send_file', 'user_send_image', 'oa_send_text'
    content TEXT,
    attachment_url VARCHAR(1024),
    attachment_type VARCHAR(64), -- 'pdf', 'docx', 'image', 'none'
    category VARCHAR(64) DEFAULT 'OTHER', -- 'CV_NEW', 'SUPPORT_QUERY', 'STATUS_UPDATE', 'OTHER'
    ai_summary TEXT,
    ai_classification_confidence FLOAT DEFAULT 0.0,
    extracted_candidate_id VARCHAR(64) DEFAULT NULL,
    reply_content TEXT,
    status VARCHAR(32) DEFAULT 'PROCESSED', -- 'RECEIVED', 'PROCESSING', 'PROCESSED', 'REPLIED', 'FAILED'
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for querying messages by group, sender, and category
CREATE INDEX IF NOT EXISTS idx_messages_category ON messages(category);
CREATE INDEX IF NOT EXISTS idx_messages_group_id ON messages(group_id);
CREATE INDEX IF NOT EXISTS idx_messages_received_at ON messages(received_at DESC);

-- 3. Table: jobs (Job Openings synced from Google Sheet)
CREATE TABLE IF NOT EXISTS jobs (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(256) NOT NULL,
    company VARCHAR(256) NOT NULL,
    location VARCHAR(128) NOT NULL,
    industry VARCHAR(128) NOT NULL,
    salary VARCHAR(128),
    headcount INT DEFAULT 1,
    warranty_period VARCHAR(64),
    bonus VARCHAR(128),
    requirements TEXT,
    jd_file VARCHAR(256),
    status VARCHAR(64) DEFAULT 'MỚI', -- 'TUYỂN GẤP', 'MỚI', 'TUYỂN LẠI', 'BỊ TẠM NGƯNG', 'ĐÃ HOÀN THÀNH'
    sheet_row_index INT,
    sheet_row_url VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Table: candidates (Candidates extracted from CVs & Sheet 1)
CREATE TABLE IF NOT EXISTS candidates (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(256) NOT NULL,
    phone VARCHAR(64),
    email VARCHAR(128),
    desired_salary VARCHAR(128),
    start_time VARCHAR(128),
    ctv_code VARCHAR(64),
    position_company VARCHAR(256),
    matched_job_id VARCHAR(64) REFERENCES jobs(id) ON DELETE SET NULL,
    match_score INT DEFAULT 0, -- 0 to 100%
    skills TEXT, -- JSON or comma separated string
    experience_years FLOAT DEFAULT 0.0,
    education TEXT,
    strengths TEXT,
    weaknesses TEXT,
    ai_evaluation TEXT,
    suggested_alternative_jobs TEXT, -- JSON array of alternative job titles
    cv_url VARCHAR(1024),
    source_message_id VARCHAR(64) REFERENCES messages(id) ON DELETE SET NULL,
    stage VARCHAR(64) DEFAULT 'applied', -- 'applied', 'cv_pass', 'interviewing', 'onboarded', 'rejected'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_candidates_matched_job ON candidates(matched_job_id);
CREATE INDEX IF NOT EXISTS idx_candidates_stage ON candidates(stage);
CREATE INDEX IF NOT EXISTS idx_candidates_ctv_code ON candidates(ctv_code);

-- 5. Table: ctv_broadcast_list (CTV Push Notifications with Human Approval Queue)
CREATE TABLE IF NOT EXISTS ctv_broadcast_list (
    id VARCHAR(64) PRIMARY KEY,
    job_id VARCHAR(64) REFERENCES jobs(id) ON DELETE CASCADE,
    target_type VARCHAR(64) DEFAULT 'ALL_CTV', -- 'ALL_CTV', 'ACTIVE_CTV', 'CUSTOM_GROUP', 'ZALO_OA_BROADCAST'
    target_group_id VARCHAR(128),
    draft_title VARCHAR(256) NOT NULL,
    draft_content TEXT NOT NULL,
    ai_generated BOOLEAN DEFAULT TRUE,
    bonus_highlight VARCHAR(128),
    status VARCHAR(32) DEFAULT 'PENDING_APPROVAL', -- 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'SENT', 'FAILED'
    reviewed_by VARCHAR(128),
    reviewed_at TIMESTAMP,
    rejection_reason TEXT,
    sent_at TIMESTAMP,
    recipients_count INT DEFAULT 0,
    zalo_msg_id VARCHAR(128),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_broadcast_status ON ctv_broadcast_list(status);
CREATE INDEX IF NOT EXISTS idx_broadcast_job_id ON ctv_broadcast_list(job_id);

-- 6. Table: message_templates (Configurable Zalo Broadcast & Reply Templates)
CREATE TABLE IF NOT EXISTS message_templates (
    id VARCHAR(64) PRIMARY KEY,
    template_name VARCHAR(256) NOT NULL,
    category VARCHAR(64) NOT NULL, -- 'JOB_PUSH_URGENT', 'JOB_PUSH_NEW', 'CV_RECEIVED_REPLY', 'CTV_COMMISSION_REMINDER'
    template_content TEXT NOT NULL,
    variables VARCHAR(512), -- comma-separated e.g. '{jobTitle},{company},{salary},{bonus},{deadline},{sheetUrl}'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
