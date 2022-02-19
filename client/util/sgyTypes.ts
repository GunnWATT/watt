// Yes. I did this. I made this. I made every single one of these.
// (I actually used code to make the first few primitive types. Using code to write code :lemongod:)

// Basic Types
export type User = {
    uid: string;
    id: number;
    school_id: number;
    synced: number;
    school_uid: string;
    building_id: number;
    additional_buildings: string;
    name_title: string;
    name_title_show: number;
    name_first: string;
    name_first_preferred: string;
    use_preferred_first_name: string;
    name_middle: string;
    name_middle_show: number;
    name_last: string;
    name_display: string;
    username: string;
    primary_email: string;
    picture_url: string;
    gender: null;
    position: null;
    grad_year: string;
    password: string;
    role_id: number;
    tz_offset: number;
    tz_name: string;
    child_uids: null;
    send_message: number;
    language: string;
    permissions: { is_directory_public: number; allow_connections: number };
};
export type School = {
    id: string;
    title: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    website: string;
    phone: string;
    fax: string;
    building_code: string;
    picture_url: string;
};
export type Section = {
    id: string;
    course_title: string;
    course_code: string;
    course_id: string;
    school_id: string;
    building_id: string;
    access_code: string;
    section_title: string;
    section_code: string;
    section_school_code: string;
    synced: string;
    active: number;
    description: string;
    subject_area: string;
    grade_level_range_start: string;
    grade_level_range_end: string;
    parent_id: string;
    grading_periods: number[];
    profile_url: string;
    location: string;
    meeting_days: string[];
    start_time: string;
    end_time: string;
    weight: string;
    options: {
        weighted_grading_categories: string;
        upload_documents: string;
        create_discussion: string;
        member_post: string;
        member_post_comment: string;
        default_grading_scale_id: number;
        content_index_visibility: {
            topics: number;
            assignments: number;
            assessments: number;
            course_assessment: number;
            common_assessments: number;
            documents: number;
            discussion: number;
            album: number;
            pages: number;
        };
        hide_overall_grade: number;
        hide_grading_period_grade: number;
        allow_custom_overall_grade: number;
        allow_custom_overall_grade_text: number;
    };
    admin: number;
};
export type Group = {
    id: string;
    title: string;
    description: string;
    website: string;
    access_code: null;
    category: string;
    options: {
        member_post: number;
        member_post_comment: number;
        create_discussion: number;
        create_files: number;
        invite_type: number;
    };
    group_code: string;
    privacy_level: string;
    picture_url: string;
    school_id: string;
    building_id: string;
    admin: number;
};
export type Event = {
    id: number;
    title: string;
    description: string;
    start: string;
    has_end: number;
    end: string;
    all_day: number;
    editable: number;
    rsvp: number;
    comments_enabled: number;
    type: string;
    assignment_type: string;
    web_url: string;
    assignment_id: number;
    realm: string;
    section_id: number;
};
export type Discussion = {
    id: number;
    uid: number;
    title: string;
    body: string;
    weight: number;
    graded: number;
    require_initial_post: string;
    published: number;
    available: number;
    completed: number;
    display_weight: number;
    folder_id: number;
    comments_closed: number;
    completion_status: string;
};
export type FrickinBrokenDangNabbitTrashGarbageStinkyPoopooDiscussionComment = {
    id: number;
    uid: number;
    comment: string;
    created: number;
    parent_id: number;
    status: number;
    likes: number;
    user_like_action: boolean;
};
export type Update = {
    id: number;
    body: string;
    uid: number;
    created: number;
    last_updated: string;
    likes: number;
    user_like_action: boolean;
    realm: string;
    section_id: number;
    num_comments: number;
};
export type Album = {
    id: number;
    title: string;
    description: string;
    setting_comments: number;
    setting_member_post: number;
    photo_count: number;
    video_count: number;
    audio_count: number;
    created: number;
    published: number;
    available: number;
    completed: number;
    folder_id: number;
    display_weight: number;
    cover_image_url: string;
    completion_status: string;
};
export type Media = {
    id: number;
    album_id: number;
    uid: number;
    type: string;
    caption: string;
    display_order: number;
    created: number;
    album_cover: number;
    converted_url: null;
    converted_filesize: null;
    converted_md5_checksum: null;
    content_url: string;
    content_filesize: string;
    content_md5_checksum: string;
    thumbnail_url: string;
    thumbnail_dimensions: string;
    content_dimensions: string;
};
export type Document = {
    id: number;
    title: string;
    course_fid: number;
    available: number;
    published: number;
    completion_status: string;
    completed: number;
    display_weight: number;
    attachments: {
        external_tools: {
            external_tool: { id: number; type: string; url: string; title: string }[];
        };
        links: {
            link: { id: number, type: string, url: string, title: string, summary: string, display_inline: number }[]
        };
        files: {
            file: { id: number, type: string, title: string, filename: string, filesize: number, md5_checksum: string, timestamp: number, filemime: string, download_path: string, extension: string }[]
        }
    };
};
export type GradingCategory = {
    id: number;
    title: string;
    delta: number;
    realm: string;
    realm_id: string;
};
export type Assignment = {
    id: number;
    title: string;
    description: string;
    due: string;
    grading_scale: string;
    grading_period: string;
    grading_category: string;
    max_points: string;
    factor: string;
    is_final: string;
    show_comments: string;
    grade_stats: string;
    allow_dropbox: string;
    allow_discussion: string;
    published: number;
    type: string;
    grade_item_id: number;
    available: number;
    completed: number;
    dropbox_locked: number;
    grading_scale_type: number;
    show_rubric: boolean;
    display_weight: null;
    folder_id: string;
    assignment_type: string;
    web_url: string;
    last_updated: string;
    completion_status: string;
};
export type Page = {
    id: number;
    title: string;
    body: string;
    published: number;
    inline: number;
    created: number;
    available: number;
    completed: number;
    folder_id: number;
    display_weight: number;
    completion_status: string;
};

// Responses
export type SectionsResponse = {
    section: Section[];
    links: {
        self: string;
    };
};
export type GroupsResponse = {
    group: Group[];
    links: {
        self: string;
    };
};
export type EventsResponse = {
    event: Event[];
    total: number;
    links: {
        self: string;
        next?: string;
    };
};
export type DiscussionsResponse = {
    discussion: Discussion[];
    total: number;
    links: {
        self: string;
    };
};
export type FrickinBrokenDangNabbitTrashGarbageStinkyPoopooDiscussionCommentsResponse = {
    comment: FrickinBrokenDangNabbitTrashGarbageStinkyPoopooDiscussionComment[];
};
export type UpdatesResponse = {
    update: Update[];
    links: {
        self: string;
        next?: string;
    };
};
export type AlbumsResponse = {
    album: Album[];
    total: number;
    links: {
        self: string;
        next?: string;
    };
};
export type AlbumMediaResponse = {
    content: Media[];
};
export type DocumentsResponse = {
    document: Document[];
    total: number;
    links: {
        self: string;
        next?: string;
    };
};
export type GradingCategoriesResponse = {
    grading_category: GradingCategory[];
};
export type AssignmentsResponse = {
    assignment: Assignment[];
    total: number;
    links: {
        self: string;
        next?: string;
    };
};
export type PagesResponse = {
    page: Page[];
    total: number;
    links: {
        self: string;
        next?: string;
    };
};

// Grading things
export type GradedAssignment = {
    enrollment_id: number;
    assignment_id: number;
    grade: number;
    exception: number;
    max_points: number;
    is_final: number;
    timestamp: number;
    comment: string;
    comment_status: null;
    override: null;
    calculated_grade: null;
    pending: null;
    type: string;
    location: string;
    scale_id: number;
    scale_type: number;
    assignment_type: string;
    web_url: string;
    category_id: number;
};
export type SectionGradingPeriod = {
    period_id: string;
    period_title: string;
    assignment: GradedAssignment[];
};
export type FinalSectionPeriodGrade = {
    period_id: number;
    grade: number;
    weight: number;
    comment: string;
    scale_id: number;
    grading_category?: {
        category_id: number;
        grade: number;
    }[];
};
export type SectionGrade = {
    section_id: string;
    period: SectionGradingPeriod[];
    final_grade: FinalSectionPeriodGrade[];
};
export type GradesResponse = {
    section: SectionGrade[];
};
