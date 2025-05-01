export interface UserInfoResponse {
    status: string;
    data: {
      user: InstagramUser;
    };
  }
  
  export interface InstagramUser {
    ai_agent_type: any;
    biography: string;
    bio_links: any[];
    fb_profile_biolink: any;
    biography_with_entities: {
      raw_text: string;
      entities: any[];
    };
    blocked_by_viewer: boolean;
    restricted_by_viewer: boolean;
    country_block: boolean;
    eimu_id: string;
    external_url: string | null;
    external_url_linkshimmed: string | null;
    edge_followed_by: {
      count: number;
    };
    fbid: string;
    followed_by_viewer: boolean;
    edge_follow: {
      count: number;
    };
    follows_viewer: boolean;
    full_name: string;
    group_metadata: any;
    has_ar_effects: boolean;
    has_clips: boolean;
    has_guides: boolean;
    has_chaining: boolean;
    has_channel: boolean;
    has_blocked_viewer: boolean;
    highlight_reel_count: number;
    has_requested_viewer: boolean;
    hide_like_and_view_counts: boolean;
    id: string;
    is_business_account: boolean;
    is_professional_account: boolean;
    is_supervision_enabled: boolean;
    is_guardian_of_viewer: boolean;
    is_supervised_by_viewer: boolean;
    is_supervised_user: boolean;
    is_embeds_disabled: boolean;
    is_joined_recently: boolean;
    guardian_id: any;
    business_address_json: {
      city_name: string | null;
      city_id: string | null;
      latitude: string | null;
      longitude: string | null;
      street_address: string | null;
      zip_code: string | null;
    };
    business_contact_method: string;
    business_email: string | null;
    business_phone_number: string | null;
    business_category_name: string;
    overall_category_name: string | null;
    category_enum: string;
    category_name: string;
    is_private: boolean;
    is_verified: boolean;
    is_verified_by_mv4b: boolean;
    is_regulated_c18: boolean;
    edge_mutual_followed_by: {
      count: number;
      edges: any[];
    };
    pinned_channels_list_count: number;
    profile_pic_url: string;
    profile_pic_url_hd: string;
    requested_by_viewer: boolean;
    should_show_category: boolean;
    should_show_public_contacts: boolean;
    show_account_transparency_details: boolean;
    transparency_label: any;
    transparency_product: any;
    username: string;
    connected_fb_page: any;
    pronouns: string[];
    edge_owner_to_timeline_media: {
      count: number;
      page_info: {
        has_next_page: boolean;
        end_cursor: string | null;
      };
      edges: any[];
    };
  }
  